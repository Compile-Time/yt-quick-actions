import { DisconnectFn } from "../types/disconnectable";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { SvgDrawPathNavigationFilter, TagNavigationFilter } from "../../html-navigation/filter/navigation-filter";
import { BehaviorSubject, catchError, debounceTime, filter, first, of, Subject, tap, throwError } from "rxjs";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import { SvgDrawPath } from "../../html-element-processing/element-data";

const contentMutationSubject = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach((mutation) => {
    if (Array.from(mutation.addedNodes).every((node) => node.nodeName !== "BUTTON")) {
      contentMutationSubject.next(mutation);
    }
  });
});

const popupMutationSubject = new Subject<MutationRecord>();
const popupMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // We manipulate the style in some cases, and we generally don't check for it in any use case, so we can
    // ignore it.
    if (mutation.attributeName !== "style") {
      popupMutationSubject.next(mutation);
    }
  });
});

const watchLaterButtonClickedSubject = new BehaviorSubject<boolean>(false);
const saveVideoInOptionsClickedSubject = new BehaviorSubject<boolean>(false);

const createWatchLaterButtons = contentMutationSubject.pipe(
  filter(
    (record) => record.target.nodeName === "DIV" && (record.target as HTMLElement).id === "top-level-buttons-computed"
  ),
  // There may be multiple changes to the "top-level-buttons-computed" element, so we debounce the changes.
  debounceTime(400),
  // After the button is set up in the DOM, we don't need the subscription anymore.
  first(),
  tap((record) => {
    const watchLaterButton = QaHtmlElements.watchLaterUnderVideoButton(() => {
      // TODO: save later may be outside the options button.
      const moreOptionsButton = document.getElementById("button-shape");
      if (moreOptionsButton) {
        (moreOptionsButton.children[0] as HTMLElement).click();
      }
      watchLaterButtonClickedSubject.next(true);
    });
    record.target.appendChild(watchLaterButton);
  }),
  tap(() => {
    contentMutationObserver.disconnect();
  }),
  catchError((error) => {
    contentMutationObserver.disconnect();
    return throwError(() => error);
  })
);

const clickPopupVideoSaveButton$ = popupMutationSubject.pipe(
  filter(() => watchLaterButtonClickedSubject.value === true && saveVideoInOptionsClickedSubject.value === false),
  filter((record) => record.target.nodeName === "TP-YT-IRON-DROPDOWN"),
  tap((record) => {
    const popup = record.target as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: hidden;`);
  }),
  debounceTime(300),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const xpath = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    const svg = HtmlTreeNavigator.startFrom(xpath as HTMLElement)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
      .consume();

    const button = HtmlParentNavigator.startFrom(svg).find(new TagNavigationFilter("tp-yt-paper-item")).consume();
    console.log("buttn?", button);
    button.click();
    saveVideoInOptionsClickedSubject.next(true);
  }),
  catchError((error) => {
    popupMutationObserver.disconnect();

    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);

    return throwError(() => error);
  }),
  tap(() => {
    clickPopupVideoSaveButton$.subscribe();
  })
);

const clickPopupWatchLaterPlaylist$ = popupMutationSubject.pipe(
  filter(() => saveVideoInOptionsClickedSubject.value === true),
  filter((record) => record.target.nodeName === "TP-YT-IRON-DROPDOWN"),
  tap((record) => {
    const popup = record.target as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: hidden;`);
  }),
  debounceTime(600),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const popupContainer = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;

    const ytListItem = HtmlTreeNavigator.startFrom(popupContainer)
      .findFirst(new TagNavigationFilter("yt-list-item-view-model"))
      .consume();
    console.log("ytListItem?", ytListItem, popupContainer);
    ytListItem.click();
  }),
  catchError(() => {
    popupMutationObserver.disconnect();

    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);

    return of(null);
  }),
  tap((record) => {
    watchLaterButtonClickedSubject.next(false);
    saveVideoInOptionsClickedSubject.next(false);

    if (!record) {
      return;
    }

    const popup = record.target as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);
    clickPopupWatchLaterPlaylist$.subscribe();
  })
);

export function initWatchVideo(): DisconnectFn {
  // Avoid listening to the whole DOM by using the ytd-page-manager element.
  const ytdPageManager = document.evaluate(
    '//*[@id="page-manager"]',
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as HTMLElement;

  const contentObserverConf = { attributes: false, childList: true, subtree: true };
  contentMutationObserver.observe(ytdPageManager, contentObserverConf);

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter("ytd-popup-container"))
    .consume();
  const popupObserverConf = { attributes: true, childList: false, subtree: true };
  popupMutationObserver.observe(popupContainer, popupObserverConf);

  const createWatchLaterButtonSubscription = createWatchLaterButtons.subscribe();
  const clickPopupVideoSaveSubscription = clickPopupVideoSaveButton$.subscribe();
  const clickPopupWatchLaterPlaylistSubscription = clickPopupWatchLaterPlaylist$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    createWatchLaterButtonSubscription.unsubscribe();
    clickPopupVideoSaveSubscription.unsubscribe();
    clickPopupWatchLaterPlaylistSubscription.unsubscribe();
  };
}
