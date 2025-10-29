import { BehaviorSubject, catchError, filter, first, map, of, Subject, tap, throwError } from "rxjs";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import {
  QaHtmlElements,
  qaMoveBottomButton,
  qaMoveButtonsContainer,
  qaMoveTopButton,
} from "../../html-element-processing/qa-html-elements";
import { Ids, SvgDrawPath } from "../../html-element-processing/element-data";
import { DisconnectFn } from "../types/disconnectable";

const videoListMutationSubject = new Subject<MutationRecord>();
const videoListMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // A button is added to the DOM by the extension which can be caught by the observer causing an infinite loop.
    if (
      Array.from(mutation.addedNodes).every((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          return element.id !== Ids.QA_FLEX_CONTAINER_MOVE_BUTTONS && element.id !== Ids.QA_REMOVE_BUTTON;
        }
        return true;
      })
    ) {
      videoListMutationSubject.next(mutation);
    }
  });
});

const popupOpenedSubject = new Subject<MutationRecord>();
const popupMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName !== "style") {
      popupOpenedSubject.next(mutation);
    }
  });
});

const removeButtonClicked$ = new BehaviorSubject(false);
const moveTopButtonClicked$ = new BehaviorSubject(false);
const moveBottomButtonClicked$ = new BehaviorSubject(false);

const addCustomButtonsToDom$ = videoListMutationSubject.pipe(
  filter((record) => record.target.nodeName === "YTD-PLAYLIST-VIDEO-RENDERER"),
  tap((record) => {
    const menuElement = HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter("div", "menu"))
      .consume();
    if (menuElement) {
      const optionsButton = HtmlTreeNavigator.startFrom(menuElement)
        .findFirst(new IdNavigationFilter("button", "button"))
        .consume();

      const removeButton = QaHtmlElements.removeButton();
      removeButton.onclick = () => {
        optionsButton.click();
        removeButtonClicked$.next(true);
      };

      menuElement.parentNode.appendChild(removeButton);
    }

    const dragContainer = HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter("div", "index-container"))
      .consume();
    if (dragContainer && menuElement) {
      dragContainer.setAttribute("style", `${dragContainer.getAttribute("style")} position: relative;`);
      const optionsButton = HtmlTreeNavigator.startFrom(menuElement)
        .findFirst(new IdNavigationFilter("button", "button"))
        .consume();

      const topButton = qaMoveTopButton(() => {
        moveTopButtonClicked$.next(true);
        optionsButton.click();
      });
      const bottomButton = qaMoveBottomButton(() => {
        moveBottomButtonClicked$.next(true);
        optionsButton.click();
      });
      const qaContainer = qaMoveButtonsContainer([topButton, bottomButton]);

      dragContainer.append(qaContainer);
    }
  }),
  catchError((error) => {
    videoListMutationObserver.disconnect();
    return throwError(() => error);
  })
);

/**
 * Try to click the remove button as early as possible, so there is no popup flash in YouTube.
 *
 * Implementation details:
 * - We check with a behavior subject if the remove button was clicked, so the popup menu can be opened for other
 *   actions manually.
 * - We rely on the MutationObserver to detect if the popup is in a state where we can click on the remove button.
 *   We listen to the SVG element for this since other elements yield unreliable results.
 * - The span mutation records are windowed into new observables so that we can immediately click the remove button
 *   and stop listening to further span records - `first()`. This also helps with isolating the remove
 *   operation for multiple videos since they will end up in new subscriptions.
 * - The DOM element for the popup container is "reloaded" with an XPath query because mutation records can have
 *   stale references/data.
 * - Finally, set the state of the behavior subject to false so that the dialog is usable for other actions again.
 */
const clickRemoveItemInPopup$ = popupOpenedSubject.pipe(
  filter(() => removeButtonClicked$.value === true),
  filter((record) => record.target.nodeName === "SPAN"),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;

    const button = HtmlTreeNavigator.startFrom(popup)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.TRASH_ICON))
      .intoParentNavigator()
      .find(new TagNavigationFilter("tp-yt-paper-item"))
      .consume();
    if (button) {
      button.click();
    }
  }),
  catchError((err) => {
    popupMutationObserver.disconnect();
    console.error("yt-err", err);
    return of(undefined);
  }),
  tap(() => {
    removeButtonClicked$.next(false);
    clickRemoveItemInPopup$.subscribe();
  })
);

const clickMoveTopButtonInPopup$ = popupOpenedSubject.pipe(
  filter(() => moveTopButtonClicked$.value === true),
  tap(() => {
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: hidden;`);
  }),
  filter((record) => {
    return (
      (record.target.nodeName === "YTD-MENU-SERVICE-ITEM-RENDERER" &&
        HtmlTreeNavigator.startFrom(record.target as HTMLElement)
          .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_TOP))
          .exists()) ||
      (record.target.nodeName === "SPAN" &&
        record.addedNodes.length > 0 &&
        record.addedNodes.item(0).nodeName === "DIV" &&
        HtmlTreeNavigator.startFrom(record.addedNodes.item(0) as HTMLElement)
          .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_TOP))
          .exists())
    );
  }),
  first(),
  map(() => {
    // "Reload" the DOM element for its children.
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;

    const button = HtmlTreeNavigator.startFrom(popup)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_TOP))
      .intoParentNavigator()
      .find(new TagNavigationFilter("tp-yt-paper-item"))
      .consume();
    if (button) {
      button.click();
    }

    return popup;
  }),
  catchError((err) => {
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);

    popupMutationObserver.disconnect();
    console.error("yt-err", err);
    return of(null);
  }),
  tap((popup) => {
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);
    moveTopButtonClicked$.next(false);
    clickMoveTopButtonInPopup$.subscribe();
  })
);

const clickMoveBottomButtonInPopup$ = popupOpenedSubject.pipe(
  filter(() => moveBottomButtonClicked$.value === true),
  tap((record) => {
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: hidden;`);
  }),
  filter((record) => {
    return (
      (record.target.nodeName === "YTD-MENU-SERVICE-ITEM-RENDERER" &&
        HtmlTreeNavigator.startFrom(record.target as HTMLElement)
          .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_BOTTOM))
          .exists()) ||
      (record.target.nodeName === "SPAN" &&
        record.addedNodes.length > 0 &&
        record.addedNodes.item(0).nodeName === "DIV" &&
        HtmlTreeNavigator.startFrom(record.addedNodes.item(0) as HTMLElement)
          .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_BOTTOM))
          .exists())
    );
  }),
  first(),
  map(() => {
    // "Reload" the DOM element for its children.
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;

    const button = HtmlTreeNavigator.startFrom(popup)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_BOTTOM))
      .intoParentNavigator()
      .find(new TagNavigationFilter("tp-yt-paper-item"))
      .consume();
    if (button) {
      button.click();
    }

    return popup;
  }),
  catchError((err) => {
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);

    popupMutationObserver.disconnect();
    console.error("yt-err", err);
    return of(null);
  }),
  tap((popup) => {
    moveBottomButtonClicked$.next(false);
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);
    clickMoveBottomButtonInPopup$.subscribe();
  })
);

export function initPlaylistObservers(): DisconnectFn {
  // Avoid listening to the whole DOM by using the ytd-page-manager element.
  const ytdPopupManager = document.evaluate(
    "/html/body/ytd-app/div[1]/ytd-page-manager",
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as HTMLElement;

  const videoListObserverConfig: MutationObserverInit = { attributes: false, childList: true, subtree: true };
  videoListMutationObserver.observe(ytdPopupManager, videoListObserverConfig);

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter("ytd-popup-container"))
    .consume();
  const popupObserverConfig: MutationObserverInit = { attributes: true, childList: true, subtree: true };
  popupMutationObserver.observe(popupContainer, popupObserverConfig);

  const addRemoveButtonToPlaylistSubscription = addCustomButtonsToDom$.subscribe();
  const clickRemoveItemSubscription = clickRemoveItemInPopup$.subscribe();
  const clickMoveTopButtonSubscription = clickMoveTopButtonInPopup$.subscribe();
  const clickMoveBottomButtonSubscription = clickMoveBottomButtonInPopup$.subscribe();

  return () => {
    videoListMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    addRemoveButtonToPlaylistSubscription.unsubscribe();
    clickRemoveItemSubscription.unsubscribe();
    clickMoveTopButtonSubscription.unsubscribe();
    clickMoveBottomButtonSubscription.unsubscribe();
  };
}
