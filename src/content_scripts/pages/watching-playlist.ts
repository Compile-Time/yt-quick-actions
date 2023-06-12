import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import { IdNavigationFilter, SvgDrawPathNavigationFilter, TagNavigationFilter } from "../../html-navigation/filter/navigation-filter";
import { Ids, SvgDrawPath, Tags } from "../../html-element-processing/element-data";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { OneshotObserver, PageObserver } from "../../observation/observer-types";
import { OneshotObserverId } from "../../enums/oneshot-observer-id";
import { MutationElementExistsWatcher } from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import { LogProvider } from "../../logging/log-provider";
import { contentLogProvider, contentScriptObserversManager } from "../init-globals";
import { MutationSummary } from "mutation-summary";

const logger = contentLogProvider.getLogger(LogProvider.WATCHING_PLAYLIST);

let moreOptionsMenuObserver: OneshotObserver;

function setupRemoveButton(ytIconButton: HTMLElement): HTMLButtonElement {
  const button = QaHtmlElements.removeButtonInWatchingPlaylist();
  button.onclick = () => {
    ytIconButton.click();
    const popupMenu = HtmlTreeNavigator.startFrom(document.body).findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS)).consume();

    if (!popupMenu) {
      logger.error("Could not find popup menu trigger");
      return;
    }

    contentScriptObserversManager.upsertOneshotObserver(moreOptionsMenuObserver).observe();
  };
  return button;
}

/**
 * Initialize a {@link OneshotObserver} with a {@link MutationSummary} that watches the more options popup of active
 * playlist entry.
 *
 * The created {@link MutationSummary} watches for changes in YouTube's popup container and clicks the "Remove from
 * playlist" entry when it appears. The {@link MutationSummary} both works for an active playlist displayed to the
 * right of a video or below a video.
 *
 * @param ytdPopupContainer - A YouTube ytd-popup-container HTML element that should be watched for changes
 */
function initMoreOptionsMenuObserver(ytdPopupContainer: Node): void {
  moreOptionsMenuObserver = new OneshotObserver(OneshotObserverId.REMOVE_POPUP_ENTRY_READY, (disconnectFn) => {
    const summary = new MutationSummary({
      callback: (summaries) => {
        summaries[0].removed
          .map((ytdMenuServiceItem) => ytdMenuServiceItem as HTMLElement)
          .filter((ytdMenuServiceItem) =>
            HtmlTreeNavigator.startFrom(ytdMenuServiceItem)
              .filter(new TagNavigationFilter(Tags.YT_ICON))
              .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.TRASH_ICON))
              .exists()
          )
          // Only a single entry should remain after the filter.
          .forEach((potentialRemoveServiceMenuEntry) => {
            disconnectFn();
            potentialRemoveServiceMenuEntry.click();
          });
      },
      rootNode: ytdPopupContainer,
      queries: [{ attribute: "hidden" }],
    });
    summary.disconnect();
    return summary;
  });
}

function initContentScript(ytMenuIconButtons: HTMLElement[]): void {
  const ytdPopupContainer = HtmlTreeNavigator.startFrom(document.body).findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER)).consume();

  initMoreOptionsMenuObserver(ytdPopupContainer);

  // Initialize menu popup content.
  ytMenuIconButtons[0].click();
  ytMenuIconButtons[0].click();

  ytMenuIconButtons.forEach((ytMenuIconButton) => {
    const removeButton = setupRemoveButton(ytMenuIconButton);

    const playlistItem = HtmlParentNavigator.startFrom(ytMenuIconButton)
      .find(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))
      .consume();

    const existingRemoveButton = HtmlTreeNavigator.startFrom(playlistItem)
      .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON))
      .consume();
    if (!existingRemoveButton) {
      playlistItem.append(removeButton);
    }
  });
}

export function initWatchingPlaylistObservers(): void {
  logger.debug("Watch for first playlist item under or next to a video");
  MutationElementExistsWatcher.build()
    .queryFn(() => {
      const ytMenuIconButtons = HtmlTreeNavigator.startFrom(document.body)
        .filter(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))
        .findAll(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
        .map((result) => result.consume());

      return { ytMenuIconButtons: ytMenuIconButtons };
    })
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
      logger.debug("First playlist item was found!");
      const ytMenuIconButtons = elementWatcherResult.ytMenuIconButtons as HTMLElement[];
      if (ytMenuIconButtons) {
        initContentScript(ytMenuIconButtons);
      } else {
        logger.error("Could not find ytd-playlist-panel-video-renderer elements");
      }
    })
    .catch((err) => logger.error(err));
}
