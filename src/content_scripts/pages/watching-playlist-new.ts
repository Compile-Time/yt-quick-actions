import { DisconnectFn } from "../types/disconnectable";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import { BehaviorSubject, catchError, debounceTime, filter, first, map, of, Subject, tap } from "rxjs";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { SvgDrawPath } from "../../html-element-processing/element-data";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";

const contentMutationSubject = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
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

const removeButtonClickedSubject = new BehaviorSubject<boolean>(false);

const createRemoveButtons$ = contentMutationSubject.pipe(
  filter((record) => record.target.nodeName === "DIV" && (record.target as HTMLElement).id === "menu"),
  tap((record) => {
    const menuElement = record.target as HTMLElement;
    const optionsButton = HtmlTreeNavigator.startFrom(menuElement)
      .findFirst(new IdNavigationFilter("button", "button"))
      .consume();

    const removeButton = QaHtmlElements.removeButton();
    removeButton.onclick = () => {
      optionsButton.click();
      removeButtonClickedSubject.next(true);
    };

    menuElement.parentNode.appendChild(removeButton);
  })
);

const clickPopupRemoveButton$ = popupMutationSubject.pipe(
  tap(r => console.log('r', r)),
  filter(() => removeButtonClickedSubject.value === true),
  filter((record) => record.target.nodeName === "TP-YT-IRON-DROPDOWN"),
  tap(() => {
    const popup = document.evaluate(
      "/html/body/ytd-app/ytd-popup-container",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement;
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: hidden;`);
    return popup;
  }),
  debounceTime(300),
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

    const svg = HtmlTreeNavigator.startFrom(popup)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.TRASH_ICON))
      .consume();
    const button = HtmlParentNavigator.startFrom(svg).find(new TagNavigationFilter("tp-yt-paper-item")).consume();
    button.click();

    return popup;
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
  tap((popup) => {
    if (!popup) {
      return;
    }
    clickPopupRemoveButton$.subscribe();
    removeButtonClickedSubject.next(false);
    popup.setAttribute("style", `${popup.getAttribute("style")} visibility: visible;`);
  })
);

export function initWatchingPlaylistNew(): DisconnectFn {
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

  const createRemoveButtonSubscription = createRemoveButtons$.subscribe();
  const clickPopupRemoveButtonSubscription = clickPopupRemoveButton$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    createRemoveButtonSubscription.unsubscribe();
    clickPopupRemoveButtonSubscription.unsubscribe();
  };
}
