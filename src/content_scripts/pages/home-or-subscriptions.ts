import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import {
  IdNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import {
  Ids,
  SvgDrawPath,
  Tags,
} from "../../html-element-processing/element-data";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { PageObserver } from "../../observation/observer-types";
import { OneshotObserverId } from "../../enums/oneshot-observer-id";
import { LogProvider } from "../../logging/log-provider";
import {
  contentLogProvider,
  contentScriptObserversManager,
} from "../init-globals";
import { MutationSummary } from "mutation-summary";
import { YtdPopupContainerClicker } from "../../html-element-processing/ytd-popup-container-clicker";

const logger = contentLogProvider.getLogger(LogProvider.HOME_PAGE);

let watchLaterClicker: YtdPopupContainerClicker;

function setupWatchLaterButtonIfNotPresent(videoMenuButton: HTMLElement): void {
  const divDismissible = HtmlParentNavigator.startFrom(videoMenuButton)
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
        contentScriptObserversManager
          .upsertOneshotObserver(watchLaterClicker.oneshotObserver)
          .observe();
        watchLaterClicker.observeAndBufferMutationChangesThenClickSvg();
        videoMenuButton.click();
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
            const addedButtons: Node[] = summaries[0].added ?? [];
            addedButtons
              .filter((button) =>
                HtmlParentNavigator.startFrom(button as HTMLElement)
                  .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_MEDIA))
                  .exists()
              )
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
    OneshotObserverId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
    SvgDrawPath.WATCH_LATER,
    ytdPopupContainer as HTMLElement
  );
}
