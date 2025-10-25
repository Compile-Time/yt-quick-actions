import { BehaviorSubject, concatAll, filter, first, map, Subject, tap, windowCount } from "rxjs";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { SvgDrawPath } from "../../html-element-processing/element-data";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import { Disconnectable, disonnectable } from "../types/disconnectable";

const popupXpath = "/html/body/ytd-app/ytd-popup-container";

const videoListMutationSubject = new Subject<MutationRecord>();
const popupOpenedSubject = new Subject<MutationRecord>();

const removeButtonClickedSubject = new BehaviorSubject<boolean>(false);

const addRemoveButtonToPlaylistEntries = videoListMutationSubject.pipe(
  filter((record) => {
    return (
      record.target.nodeName === "YTD-PLAYLIST-VIDEO-RENDERER" &&
      // A button is added to the DOM by the extension which can be caught by the observer causing an infinite loop.
      Array.from(record.addedNodes).every((node) => node.nodeName !== "BUTTON")
    );
  }),
  map((record) =>
    HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter("div", "menu"))
      .consume()
  ),
  filter((menuElement) => menuElement !== null),
  tap((menuElement) => {
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
 *   operation for multiple videos since they will end up in new observables.
 * - The DOM element for the popup container is "reloaded" with an XPath query because mutation records can have
 *   stale references/data.
 * - Finally, set the state of the behavior subject to false so that the dialog is usable for other actions again.
 */
const clickRemoveItemInPopup = popupOpenedSubject.pipe(
  filter(() => removeButtonClickedSubject.value === true),
  filter((record) => record.target.nodeName === "SPAN"),
  windowCount(1),
  map((window) => {
    return window.pipe(
      first(),
      tap(() => {
        const svg = HtmlTreeNavigator.startFrom(
          // "Reload" the DOM element for its children.
          document.evaluate(popupXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue as HTMLElement
        )
          .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.TRASH_ICON))
          .consume();
        const button = HtmlParentNavigator.startFrom(svg).find(new TagNavigationFilter("tp-yt-paper-item")).consume();
        button.click();
      }),
      tap(() => {
        // Setup subscription again.
        // clickRemoveItemInPopup.subscribe();
        removeButtonClickedSubject.next(false);
      })
    );
  }),
  concatAll()
);

export function initPlaylistObserversNew(): Disconnectable[] {
  const videoListObserverConfig: MutationObserverInit = { attributes: false, childList: true, subtree: true };
  const videoListMutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      videoListMutationSubject.next(mutation);
    });
  });
  videoListMutationObserver.observe(document.body, videoListObserverConfig);

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter("ytd-popup-container"))
    .consume();
  const popupObserverConfig: MutationObserverInit = { attributes: true, childList: true, subtree: true };
  const popupMutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      popupOpenedSubject.next(mutation);
    });
  });
  popupMutationObserver.observe(popupContainer, popupObserverConfig);

  return [
    disonnectable(videoListMutationObserver.disconnect),
    disonnectable(popupMutationObserver.disconnect),
    disonnectable(addRemoveButtonToPlaylistEntries.subscribe().unsubscribe),
    disonnectable(clickRemoveItemInPopup.subscribe().unsubscribe),
  ];
}
