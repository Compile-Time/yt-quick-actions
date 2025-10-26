import {
  BehaviorSubject,
  catchError,
  concatAll,
  debounceTime,
  filter,
  first,
  map,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
  windowCount,
} from "rxjs";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import { SvgDrawPathNavigationFilter, TagNavigationFilter } from "../../html-navigation/filter/navigation-filter";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { SvgDrawPath } from "../../html-element-processing/element-data";
import { DisconnectFn } from "../types/disconnectable";

const queueWatchLaterClickSubject = new Subject<HTMLElement>();

const contentMutationSubject = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      !Array.from(mutation.addedNodes).some(
        (node) => node.nodeName === "DIV" && (node as HTMLElement).classList.contains("qa-home-watch-later")
      )
    ) {
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

const createWatchLaterButtons$ = contentMutationSubject.pipe(
  filter((mutationRecord) => {
    return mutationRecord.target.nodeName === "DIV" && (mutationRecord.target as HTMLElement).id === "content";
  }),
  filter((mutationRecord) => {
    return HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
      .find(new TagNavigationFilter("YTD-RICH-SECTION-RENDERER"))
      .notExists();
  }),
  filter((mutationRecord) =>
    HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
      .findFirst(new TagNavigationFilter("ytd-ad-slot-renderer"))
      .notExists()
  ),
  tap((mutationRecord) => {
    const divContent = mutationRecord.target as HTMLElement;
    const optionsButton = HtmlTreeNavigator.startFrom(divContent)
      .filter(new TagNavigationFilter("BUTTON-VIEW-MODEL"))
      .findFirst(new TagNavigationFilter("BUTTON"))
      .consume();

    const qaButton = QaHtmlElements.watchLaterHomeVideoButton(() => {
      queueWatchLaterClickSubject.next(optionsButton);
    });
    divContent.appendChild(qaButton.completeHtmlElement);
  }),
  catchError((error) => {
    contentMutationObserver.disconnect();
    return throwError(() => error);
  })
);

/**
 * Click the watch later button in the popup.
 *
 * Implementation details:
 * - We check with a behavior subject if the watch later button was clicked, so the popup can still be used the
 *   normal way
 * - The popup container visibility is set to hidden to prevent the popup from flashing in YouTube. It is necessary
 *   to debounce the changes of the mutation observer, or else the process of clicking the watch later button might
 *   fail. Adding a debounce operation, however, makes the popup flash.
 * - Because the popup is being hidden, and we are listening to attribute changes with a mutation observer, we need
 *   to exclude changes caused by the style attribute, or we are stuck in a loop.
 * - We are only interested in the first change that manages to go through the filters, so we use the first()
 *   operator. This means we need to manually re-subscribe onto the subject afterward. There may be better appraoches
 *   but this keeps the code simple.
 */
const clickPopupWatchLaterButton$ = popupMutationSubject.pipe(
  filter(() => watchLaterButtonClickedSubject.value === true),
  filter((record) => record.target.nodeName === "TP-YT-IRON-DROPDOWN"),
  tap((record) => {
    const popup = record.target as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: hidden;`);
  }),
  debounceTime(300),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const popupContainer = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;

    const svg = HtmlTreeNavigator.startFrom(popupContainer)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.WATCH_LATER_HOME_PAGE))
      .consume();

    const button = HtmlParentNavigator.startFrom(svg)
      .find(new TagNavigationFilter("yt-list-item-view-model"))
      .consume();
    button.click();
  }),
  catchError(() => {
    popupMutationObserver.disconnect();
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown",
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

    if (!record) {
      return;
    }

    const popup = record.target as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);
  })
);

/**
 * Queue watch later clicks with `windowCount` to prevent buggy behavior.
 *
 * `windowCount` creates a window of observables until the specific count is reached. We use this to put each
 * button click into a new observable and concat them with `concatAll`. `concatAll` subscribes to each observable
 * sequentially, so the next watch later action will only be performed after the previous one is finished.
 */
const processQueuedWatchLaterClick$ = queueWatchLaterClickSubject.pipe(
  windowCount(1),
  map((window) =>
    window.pipe(
      switchMap((optionsButton) => {
        watchLaterButtonClickedSubject.next(true);
        optionsButton.click();
        return clickPopupWatchLaterButton$;
      })
    )
  ),
  concatAll()
);

export function initHomeObserver(): DisconnectFn {
  // Avoid listening to the whole DOM by using the ytd-page-manager element.
  const ytdPageManager = document.evaluate(
    "/html/body/ytd-app/div[1]/ytd-page-manager",
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

  const createWatchLaterButtonSubscription = createWatchLaterButtons$.subscribe();
  const queueWatchLaterClicksSubscription = processQueuedWatchLaterClick$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    createWatchLaterButtonSubscription.unsubscribe();
    queueWatchLaterClicksSubscription.unsubscribe();
  };
}
