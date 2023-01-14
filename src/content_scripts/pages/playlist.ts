import {Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver, PageObserver} from "../../observation/observer-types";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";
import {LogProvider} from "../../logging/log-provider";
import {MutationSummary} from "mutation-summary";

const logger = contentLogProvider.getLogger(LogProvider.PLAYLIST);

let playlistMutationSummary: MutationSummary;
let moreOptionsMenuMutationSummary: MutationSummary;

/*
If we do not wait for the popup content to update, the first entry in the playlist is deleted due to the
 HTML load performed with the first entry.
 */
const menuUpdatedObserver = new MutationObserver((mutations, observer) => {
    mutations.forEach((mutation) => {
        if (mutation.oldValue === '') {
            const tpYtPaperListBox: HTMLElement = mutation.target as HTMLElement;
            const removeMenuEntry = HtmlTreeNavigator.startFrom(tpYtPaperListBox)
                .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.TRASH_ICON))
                .intoParentNavigator()
                .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
                .consume();

            if (removeMenuEntry) {
                removeMenuEntry.click();
            }
            observer.disconnect();
        }
    })
});

/*
Register an observer to add the remove button to new playlist items loaded afterwards. This only
 occurs in long playlists.
 */
const playlistLoadingNewEntriesObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(mutation.target as HTMLElement)
            .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
            .consume();

        if (!ytdPlaylistVideoRenderer) {
            logger.error('Could not find ytd-playlist-video-renderer from mutation target');
            return;
        }

        const moreOptionsButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
            .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
            .consume();

        if (!moreOptionsButton) {
            logger.error('Could not find yt-icon-button (more options) in ytd-playlist-video-renderer');
            return;
        }

        setupRemoveButtonIfNotPresent(moreOptionsButton, ytdPlaylistVideoRenderer);
    }
});

function setupRemoveButton(moreOptionsMenu: HTMLElement, ytdPlaylistVideoRenderer: HTMLElement): void {
    const removeButton = QaHtmlElements.removeButton();
    removeButton.onclick = () => {
        moreOptionsMenu.click();
        const popupMenu = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
            .consume();

        if (!popupMenu) {
            logger.error('Could not find popup menu');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotObserverId.PLAYLIST_MENU_UPDATED_OBSERVER,
            moreOptionsMenuMutationSummary
        )).observe();
    };
    ytdPlaylistVideoRenderer.append(removeButton);
}

function setupRemoveButtonIfNotPresent(moreOptionsButton: HTMLElement, ytdPlaylistVideoRenderer: HTMLElement): void {
    const existingRemoveButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
        .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON));
    if (!!ytdPlaylistVideoRenderer && !existingRemoveButton) {
        setupRemoveButton(moreOptionsButton, ytdPlaylistVideoRenderer);
    }
}

function initMoreOptionsMenuMutationSummary(ytdPopupContainer: Node): void {
    moreOptionsMenuMutationSummary = new MutationSummary({
        callback: summaries => {
            logger.debug('more options summary', summaries);
        },
        rootNode: ytdPopupContainer,
        queries: [
            {all: true}
        ]
    });
    moreOptionsMenuMutationSummary.disconnect();
}

function clickRemoveOptionInMoreOptionsMenu(moreOptionsMenu: HTMLElement): void {
    moreOptionsMenuMutationSummary.reconnect();
    moreOptionsMenu.click();
}

function initContentScript(moreOptionsButtons: HTMLElement[]): void {
    for (const moreOptionsButton of moreOptionsButtons) {
        const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(moreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
            .consume();
        setupRemoveButtonIfNotPresent(moreOptionsButton, ytdPlaylistVideoRenderer)
    }

    const firstMenuButton = moreOptionsButtons[0] as HTMLButtonElement;
    const ytdPlaylistVideoListRenderer = HtmlParentNavigator.startFrom(firstMenuButton)
        .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
        .consume();

    if (!ytdPlaylistVideoListRenderer) {
        logger.error('Could not find ytd-playlist-video-list-renderer to setup quick actions for future' +
            ' playlist items');
        return;
    }

    const popupMenu = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
        .consume();
    initMoreOptionsMenuMutationSummary(popupMenu);

    contentScriptObserversManager.addBackgroundObserver(new PageObserver(playlistLoadingNewEntriesObserver, {
        targetNode: ytdPlaylistVideoListRenderer,
        initOptions: {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
        }
    })).observe();
}

export function runPlaylistScriptIfTargetElementExists(): void {
    logger.debug('Watch for the first menu button in a playlist item');
    MutationElementExistsWatcher.build()
        .queryFn(() => {
            const ytIconButtons = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
                .findAll(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
                .map(result => result.consume());
            return {ytIconButtons: ytIconButtons};
        })
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(new PageObserver(observer, {
                targetNode: document.body,
                initOptions: {
                    childList: true, subtree: true
                }
            })).observe()
        )
        .start()
        .then(elementWatchResult => {
            logger.debug('First menu button in playlist item was found!');
            const moreOptionsButtons = elementWatchResult.ytIconButtons as HTMLElement[];
            if (moreOptionsButtons.length > 0) {
                initContentScript(moreOptionsButtons);
            } else {
                logger.error('Could not find menu buttons of playlist items');
            }
        })
        .catch(err => logger.error(err));
}
