import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import {
  IdNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import { Ids, Tags } from "../../html-element-processing/element-data";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { PageObserver } from "../../observation/observer-types";
import { OneshotObserverId } from "../../enums/oneshot-observer-id";
import { contentScriptObserversManager } from "../init-globals";
import { MutationSummary } from "mutation-summary";
import { YtdPopupContainerClicker } from "../../mutations/ytd-popup-container-clicker";
import { ANY_WATCH_LATER_ICON } from "../../html-navigation/filter/filter-groups";

let watchLaterClicker: YtdPopupContainerClicker;

function setupWatchLaterButtonIfNotPresent(menuButton: HTMLElement): void {
  const divDismissible = HtmlParentNavigator.startFrom(menuButton)
    .find(new IdNavigationFilter(Tags.DIV, Ids.DISMISSIBLE))
    .consume();
  // Set position relative so when 'position: absolute' is used in our elements the position of
  // divDismissible is used as the position context.
  divDismissible.setAttribute("style", "position: relative");

  if (
    HtmlTreeNavigator.startFrom(divDismissible)
      .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_HOME_WATCH_LATER))
      .notExists()
  ) {
    const watchLaterButtonInContainer =
      QaHtmlElements.watchLaterHomeVideoButton(() => {
        watchLaterClicker.observeAndBufferMutationChangesThenClickSvg();
        menuButton.click();
      });

    divDismissible.appendChild(watchLaterButtonInContainer.completeHtmlElement);
  }
}

export function initHomeOrSubscriptionsObservers(): void {
  contentScriptObserversManager
    .addBackgroundObserver(
      new PageObserver(() => {
        const summary = new MutationSummary({
          callback: (summaries) => {
            const addedMenuButtons: Node[] = summaries[0].added ?? [];

            addedMenuButtons
              .filter((button) => {
                const menuButton = button as HTMLElement;
                return (
                  // Only look for buttons in `ytd-rich-grid-media` elements for home page and subscriptions
                  // flow one (?flow=1).
                  HtmlParentNavigator.startFrom(menuButton)
                    .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_MEDIA))
                    .exists() ||
                  // Only look for buttons in `ytd-video-renderer` elements for subscriptions flow two (?flow=2).
                  HtmlParentNavigator.startFrom(menuButton)
                    .find(new TagNavigationFilter(Tags.YTD_VIDEO_RENDERER))
                    .exists()
                );
              })
              .forEach((ytdRichGridMediaOptionsButton) =>
                setupWatchLaterButtonIfNotPresent(
                  ytdRichGridMediaOptionsButton as HTMLElement
                )
              );
          },
          rootNode: document.body,
          queries: [{ element: "button#button" }],
        });
        summary.disconnect();
        return summary;
      })
    )
    .observe();

  const ytdPopupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
    .consume();

  watchLaterClicker = new YtdPopupContainerClicker(
    ytdPopupContainer as HTMLElement
  );
  watchLaterClicker.connectToMutationsExtractorEmitterOneshotObserver(
    YtdPopupContainerClicker.createOneshotObserverForClicker(
      OneshotObserverId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
      ANY_WATCH_LATER_ICON,
      watchLaterClicker
    )
  );
}
