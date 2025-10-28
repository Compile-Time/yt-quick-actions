import { DisconnectFn } from "../types/disconnectable";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  of,
  Subject,
  tap,
  throwError,
} from "rxjs";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { SvgDrawPath } from "../../html-element-processing/element-data";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";

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

const topLevelComputedButtonsMutations$ = contentMutationSubject.pipe(
  filter(
    (record) => record.target.nodeName === "DIV" && (record.target as HTMLElement).id === "top-level-buttons-computed"
  ),
  debounceTime(400),
  map((record) => record.target as HTMLElement)
);
const moreOptionsMutations$ = contentMutationSubject.pipe(
  filter((record) => {
    const ytButton = record.target as HTMLElement;
    return HtmlParentNavigator.startFrom(ytButton).find(new IdNavigationFilter("yt-button-shape", "button-shape")).exists();
  }),
  debounceTime(400),
  map((record) => record.target as HTMLElement)
);

const createWatchLaterButton$ = combineLatest({
  topLevelButtonsComputed: topLevelComputedButtonsMutations$,
  moreOptionsButton: moreOptionsMutations$,
}).pipe(
  // There may be multiple changes to the top level buttons or more options element, so we debounce the changes.
  debounceTime(400),
  // After the button is set up in the DOM, we don't need the subscription anymore.
  first(),
  tap(({ topLevelButtonsComputed, moreOptionsButton }) => {
    const watchLaterButton = QaHtmlElements.watchLaterUnderVideoButton(() => {
      const saveToPlaylistButton = HtmlTreeNavigator.startFrom(topLevelButtonsComputed.parentElement)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
        .intoParentNavigator()
        .find(new TagNavigationFilter("button"))
        .consume();
      if (saveToPlaylistButton) {
        saveToPlaylistButton.click();
        saveVideoInOptionsClickedSubject.next(true);
      } else {
        (moreOptionsButton.children[0] as HTMLElement).click();
        watchLaterButtonClickedSubject.next(true);
      }
    });
    topLevelButtonsComputed.appendChild(watchLaterButton);
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
    const tpYtIronDropdown = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;

    const button = HtmlTreeNavigator.startFrom(tpYtIronDropdown as HTMLElement)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
      .intoParentNavigator()
      .find(new TagNavigationFilter("tp-yt-paper-item"))
      .consume();

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

  const createWatchLaterButtonSubscription = createWatchLaterButton$.subscribe();
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
