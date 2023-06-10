import {
  Ids,
  SVG_DRAW_PATH,
  Tags,
} from "../../html-element-processing/element-data";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import {
  OneshotObserver,
  PageObserver,
} from "../../observation/observer-types";
import { OneshotObserverId } from "../../enums/oneshot-observer-id";
import { MutationElementExistsWatcher } from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {
  contentLogProvider,
  contentScriptObserversManager,
} from "../init-globals";
import { LogProvider } from "../../logging/log-provider";
import { MutationSummary } from "mutation-summary";

const logger = contentLogProvider.getLogger(LogProvider.PLAYLIST);

let playlistObserver: PageObserver;
let moreOptionsMenuObserver: OneshotObserver;

function setupRemoveButton(
  moreOptionsMenu: HTMLElement,
  ytdPlaylistVideoRenderer: HTMLElement
): void {
  const removeButton = QaHtmlElements.removeButton();
  removeButton.onclick = () => {
    clickRemoveMenuEntryInMoreOptionsMenu(moreOptionsMenu);
  };
  ytdPlaylistVideoRenderer.append(removeButton);
}

function setupRemoveButtonIfNotPresent(moreOptionsButton: HTMLElement): void {
  const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(
    moreOptionsButton
  )
    .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
    .consume();

  if (
    HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
      .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON))
      .notExists()
  ) {
    setupRemoveButton(moreOptionsButton, ytdPlaylistVideoRenderer);
  }
}

/**
 * Initialize a {@link OneshotObserver} with a {@link MutationSummary} for YouTube's more options button ("...") and
 * immediately disconnect from it.
 *
 * The created {@link MutationSummary} will observe changes to YouTube's more options button drop-down content and
 * click the remove entry as soon as it is available.
 *
 * One important implementation detail is that the drop-down content will initialize all its HTML on the first
 * appearance and only removes/adds tags or changes tag attributes on subsequent appearances.
 *
 * @param ytdPopupContainer - A YouTube ytd-popup-container HTML element that should be watched for changes
 */
function initMoreOptionsMenuObserver(ytdPopupContainer: Node): void {
  moreOptionsMenuObserver = new OneshotObserver(
    OneshotObserverId.PLAYLIST_MENU_UPDATED_OBSERVER,
    (disconnectFn) => {
      const summary = new MutationSummary({
        callback: (summaries) => {
          summaries[0].removed
            .map((ytdMenuServiceItem) => ytdMenuServiceItem as HTMLElement)
            .filter((ytdMenuServiceItem) =>
              HtmlTreeNavigator.startFrom(ytdMenuServiceItem)
                .findFirst(
                  new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.TRASH_ICON)
                )
                .exists()
            )
            // Only a single element should match the above filter.
            .forEach((removeMenuEntry) => {
              disconnectFn();
              removeMenuEntry.click();
            });
        },
        rootNode: ytdPopupContainer,
        queries: [{ attribute: "hidden" }],
      });
      summary.disconnect();
      return summary;
    }
  );
}

/**
 * Initialize a {@link PageObserver} with a {@link MutationSummary} for long playlists where items are loaded in
 * afterwards and immediately disconnect from it.
 *
 * The created {@link MutationSummary} will observe changes to the playlist container and set up the Quick Actions
 * remove button for new videos added to the playlist container. A playlist always loads videos in batches of 100.
 * If the end of the playlist is reached then the next 100 videos will be loaded.
 *
 * @param ytdPlaylistVideoListRenderer - A YouTube ytd-playlist-video-list-renderer HTML element to watch for changes.
 */
function initPlaylistObserver(ytdPlaylistVideoListRenderer: Node): void {
  playlistObserver = new PageObserver(() => {
    const summary = new MutationSummary({
      callback: (summaries) => {
        summaries[0].added
          .map((ytIconButton) => ytIconButton as HTMLElement)
          .forEach((moreOptionsButton) =>
            setupRemoveButtonIfNotPresent(moreOptionsButton)
          );
      },
      rootNode: ytdPlaylistVideoListRenderer,
      queries: [{ element: "yt-icon-button#button" }],
    });
    summary.disconnect();
    return summary;
  });
}

function clickRemoveMenuEntryInMoreOptionsMenu(
  moreOptionsMenu: HTMLElement
): void {
  contentScriptObserversManager
    .upsertOneshotObserver(moreOptionsMenuObserver)
    .observe();
  moreOptionsMenu.click();
}

function initContentScript(moreOptionsButtons: HTMLElement[]): void {
  moreOptionsButtons.forEach((moreOptionsButton) =>
    setupRemoveButtonIfNotPresent(moreOptionsButton)
  );

  const firstMenuButton = moreOptionsButtons[0] as HTMLButtonElement;

  // Initialize menu popup content.
  firstMenuButton.click();
  firstMenuButton.click();

  const ytdPlaylistVideoListRenderer = HtmlParentNavigator.startFrom(
    firstMenuButton
  )
    .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
    .consume();
  const popupMenu = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
    .consume();

  initMoreOptionsMenuObserver(popupMenu);
  initPlaylistObserver(ytdPlaylistVideoListRenderer);

  contentScriptObserversManager
    .addBackgroundObserver(playlistObserver)
    .observe();
}

export function runPlaylistScriptIfTargetElementExists(): void {
  logger.debug("Watch for the first menu button in a playlist item");
  MutationElementExistsWatcher.build()
    .queryFn(() => {
      const ytIconButtons = HtmlTreeNavigator.startFrom(document.body)
        .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
        .findAll(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
        .map((result) => result.consume());
      return { ytIconButtons: ytIconButtons };
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
    .then((elementWatchResult) => {
      logger.debug("First menu button in playlist item was found!");
      const moreOptionsButtons =
        elementWatchResult.ytIconButtons as HTMLElement[];
      if (moreOptionsButtons.length > 0) {
        initContentScript(moreOptionsButtons);
      } else {
        logger.error("Could not find menu buttons of playlist items");
      }
    })
    .catch((err) => logger.error(err));
}
