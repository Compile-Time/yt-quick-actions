import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import {
  AttributeNames,
  Ids,
  SVG_DRAW_PATH,
  Tags,
} from "../../html-element-processing/element-data";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import { MutationElementExistsWatcher } from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import { LogProvider } from "../../logging/log-provider";
import {
  contentLogProvider,
  contentScriptObserversManager,
} from "../init-globals";
import { MutationSummary } from "mutation-summary";
import {
  OneshotObserver,
  PageObserver,
} from "../../observation/observer-types";
import { OneshotObserverId } from "../../enums/oneshot-observer-id";
import { buffer, debounceTime, first, Subject } from "rxjs";
import { MutationChange } from "../../mutations/mutation-change";

const createdElements: HTMLElement[] = [];
const logger = contentLogProvider.getLogger(LogProvider.VIDEO);

let fullScreenSaveObserver: OneshotObserver;
let halfScreenSaveObserver: OneshotObserver;

const moreOptionsMenuChangesSubject: Subject<MutationChange> =
  new Subject<MutationChange>();

/**
 * Initialize a {@link OneshotObserver} with a {@link MutationSummary} for a full screen size YouTube browser
 * window and immediately disconnect from it.
 *
 * The created {@link MutationSummary} will observe changes to YouTube's "Save To" popup dialog, so a video can be
 * added to the "Watch later" playlist.
 *
 * One important implementation detail is that the popup dialog will initialize all its HTML on the first appearance
 * and only removes/adds tags or changes tag attributes on subsequent appearances.
 *
 * @param ytdPopupContainer - A YouTube ytd-popup-container HTML element that should be watched for changes
 */
function initFullScreenSaveObserver(ytdPopupContainer: Node) {
  fullScreenSaveObserver = new OneshotObserver(
    OneshotObserverId.SAVE_TO_FULL_SCREEN_POPUP_READY,
    (disconnectFn) => {
      const summary = new MutationSummary({
        callback: (summaries) => {
          const popupCloseSvgPaths: HTMLElement[] = summaries[0].added
            .map((pathNode) => pathNode as HTMLElement)
            .filter(
              (pathElement) =>
                pathElement.getAttribute(AttributeNames.D) ===
                SVG_DRAW_PATH.POPUP_CLOSE
            );

          if (popupCloseSvgPaths.length > 0) {
            // The "Save To" popup is rendered for the first time -> The close button SVG is rendered in at some
            // point.
            disconnectFn();

            const closePopupButton = HtmlParentNavigator.startFrom(
              popupCloseSvgPaths[0]
            )
              .find(new IdNavigationFilter(Tags.BUTTON, Ids.BUTTON))
              .consume();
            const watchLaterCheckboxEntry = HtmlParentNavigator.startFrom(
              closePopupButton
            )
              .find(new TagNavigationFilter(Tags.YTD_ADD_TO_PLAYLIST_RENDERER))
              .intoTreeNavigator()
              .filter(new IdNavigationFilter(Tags.DIV, Ids.PLAYLISTS))
              .filter(
                new TagNavigationFilter(
                  Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER
                )
              )
              .findFirst(
                new IdNavigationFilter(Tags.TP_YT_PAPER_CHECKBOX, Ids.CHECKBOX)
              )
              .consume();

            watchLaterCheckboxEntry.click();
            closePopupButton.click();
          } else if (summaries[1].removed.length > 0) {
            // The "Save To" popup was already opened -> 'aria-hidden' attribute should be removed from the
            // popup itself.
            summaries[1].removed
              .map((tpYtPaperDialog) => tpYtPaperDialog as HTMLElement)
              .filter((removedFromElement) =>
                HtmlTreeNavigator.startFrom(removedFromElement)
                  .findFirst(
                    new TagNavigationFilter(
                      Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER
                    )
                  )
                  .exists()
              )
              .forEach((tpYtPaperDialog) => {
                disconnectFn();

                const watchLaterCheckboxEntry = HtmlTreeNavigator.startFrom(
                  tpYtPaperDialog
                )
                  .filter(new IdNavigationFilter(Tags.DIV, Ids.PLAYLISTS))
                  .filter(
                    new TagNavigationFilter(
                      Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER
                    )
                  )
                  .findFirst(
                    new IdNavigationFilter(
                      Tags.TP_YT_PAPER_CHECKBOX,
                      Ids.CHECKBOX
                    )
                  )
                  .consume();
                watchLaterCheckboxEntry.click();

                const closePopupButton = HtmlTreeNavigator.startFrom(
                  tpYtPaperDialog
                )
                  .filter(new IdNavigationFilter(Tags.DIV, Ids.HEADER))
                  .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.BUTTON))
                  .consume();
                closePopupButton.click();
              });
          }
        },
        rootNode: ytdPopupContainer,
        queries: [{ element: "path" }, { attribute: "aria-hidden" }],
      });
      summary.disconnect();
      return summary;
    }
  );
}

/**
 * Initialize a {@link OneshotObserver} with a {@link MutationSummary} for a full screen size YouTube browser
 * window and immediately disconnect from it.
 *
 * The created {@link MutationSummary} will observe changes to YouTube's more options popup drop-down ("..."), so it
 * can push summaries into {@link moreOptionsMenuChangesSubject}. These changes will then be processed by RxJS
 * operations.
 *
 * On half-screen sizes some video actions are hidden into the more options button ("..."). This includes the
 * "Save" action. Because the "Save" action only exists in either the more options popup or directly under
 * the video both cases need to be handled.
 *
 * @param ytdPopupContainer - A YouTube ytd-popup-container HTML element that should be watched for changes
 */
function initHalfScreenSaveObserver(ytdPopupContainer: Node) {
  halfScreenSaveObserver = new OneshotObserver(
    OneshotObserverId.SAVE_TO_HALF_SCREEN_POPUP_READY,
    () => {
      const svgPathFilter = new SvgDrawPathNavigationFilter(
        SVG_DRAW_PATH.VIDEO_SAVE
      );
      const summary = new MutationSummary({
        callback: (summaries) =>
          moreOptionsMenuChangesSubject.next(
            new MutationChange(svgPathFilter, summaries)
          ),
        rootNode: ytdPopupContainer,
        queries: [
          { element: `path[d="${SVG_DRAW_PATH.VIDEO_SAVE}"]` },
          { attribute: "hidden" },
        ],
      });
      summary.disconnect();
      return summary;
    }
  );
}

function processMoreOptionsMenuChanges(
  mutationChanges: MutationChange[]
): void {
  const addedSvgElements = mutationChanges
    .map((mutationChange) =>
      mutationChange.extractAddedSvgElementFromSummaries()
    )
    .filter((addedSvgElement) => !!addedSvgElement);
  const unHiddenYtdMenuServiceItemRenderers = mutationChanges
    .map((mutationChange) =>
      mutationChange.extractUnHiddenYtdMenuServiceItemRendererFromSummaries()
    )
    .filter(
      (unHiddenYtdServiceMenuItemRenderer) =>
        !!unHiddenYtdServiceMenuItemRenderer
    );

  // The order of the if branches matters. The first check should always be if a svg element has been added.
  if (addedSvgElements.length === 1) {
    const saveMenuEntry = HtmlParentNavigator.startFrom(addedSvgElements[0])
      .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
      .consume();

    clickSaveToWatchLaterCheckbox(saveMenuEntry);
  } else if (unHiddenYtdMenuServiceItemRenderers.length === 1) {
    clickSaveToWatchLaterCheckbox(unHiddenYtdMenuServiceItemRenderers[0]);
  }

  halfScreenSaveObserver.disconnect();
}

function clickSaveToWatchLaterCheckbox(popupTrigger: HTMLElement): void {
  contentScriptObserversManager
    .upsertOneshotObserver(fullScreenSaveObserver)
    .observe();
  popupTrigger.click();
}

function clickSaveToWatchLaterCheckboxForHalfScreenSize(
  moreOptionsButton: HTMLElement
): void {
  contentScriptObserversManager
    .upsertOneshotObserver(halfScreenSaveObserver)
    .observe();

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
    .consume();

  moreOptionsMenuChangesSubject
    .pipe(buffer(moreOptionsMenuChangesSubject.pipe(debounceTime(4))), first())
    .subscribe((mutationChanges: MutationChange[]) => {
      processMoreOptionsMenuChanges(mutationChanges);
      popupContainer.removeAttribute("hidden");
    });

  // Hide the popup container so there is no drop-down flicker when triggering a quick action.
  popupContainer.setAttribute("hidden", "");
  moreOptionsButton.click();
}

function setupWatchLaterButton(
  moreOptionsButton: HTMLElement
): HTMLButtonElement {
  const quickActionsWatchLater = QaHtmlElements.watchLaterUnderVideoButton();
  createdElements.push(quickActionsWatchLater);
  quickActionsWatchLater.onclick = () => {
    const ytdMenuRenderer = HtmlParentNavigator.startFrom(moreOptionsButton)
      .find(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
      .consume();

    if (!ytdMenuRenderer) {
      logger.error("Could not find ytd-menu-renderer as a parent");
      return;
    }

    // On half-screen size this element is hidden in the more options button ("...").
    const saveButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
      .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
      .filter(new TagNavigationFilter(Tags.YT_ICON))
      .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_SAVE))
      .intoParentNavigator()
      .find(new TagNavigationFilter(Tags.BUTTON))
      .consume();

    if (saveButton) {
      clickSaveToWatchLaterCheckbox(saveButton);
    } else {
      clickSaveToWatchLaterCheckboxForHalfScreenSize(moreOptionsButton);
    }
  };

  return quickActionsWatchLater;
}

function initContentScript(moreOptionsButton: HTMLElement): void {
  // Remove existing buttons otherwise duplicates are present on the page.
  createdElements.forEach((element) => element.remove());

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
    .consume();

  if (!popupContainer) {
    logger.error("Could not find popup container on page");
    return;
  }

  initFullScreenSaveObserver(popupContainer);
  initHalfScreenSaveObserver(popupContainer);

  const quickActionsWatchLater = setupWatchLaterButton(moreOptionsButton);

  // For some reason the parent of the found button in the yt-button-shape is a yt-icon-button ...
  const firstMoreOptionsHtmlTag = HtmlParentNavigator.startFrom(
    moreOptionsButton
  )
    .find(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
    .consume();
  firstMoreOptionsHtmlTag.parentElement.insertBefore(
    quickActionsWatchLater,
    firstMoreOptionsHtmlTag
  );
}

function getMoreOptionsButton(): HTMLElement {
  return HtmlTreeNavigator.startFrom(document.body)
    .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
    .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
    .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
    .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
    .filter(new IdNavigationFilter(Tags.YT_BUTTON_SHAPE, Ids.BUTTON_SHAPE))
    .findFirst(
      new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_MORE_ACTIONS)
    )
    .intoParentNavigator()
    .find(new TagNavigationFilter(Tags.BUTTON))
    .consume();
}

export function runVideoScriptIfTargetElementExists(): void {
  logger.debug("Watch for the more options button under a video");
  MutationElementExistsWatcher.build()
    .queryFn(() => ({ moreOptions: getMoreOptionsButton() }))
    .observeFn((observer) =>
      contentScriptObserversManager
        .addBackgroundObserver(
          new PageObserver(() => observer, {
            targetNode: document.body,
            initOptions: {
              childList: true,
              subtree: true,
            },
          })
        )
        .observe()
    )
    .start()
    .then((elementWatcherResult) => {
      logger.debug("More options button was found!");
      const moreOptionsButton = elementWatcherResult.moreOptions as HTMLElement;
      if (moreOptionsButton) {
        initContentScript(moreOptionsButton);
      } else {
        logger.error("Could not find more options button under video");
      }
    })
    .catch((err) => logger.error(err));
}
