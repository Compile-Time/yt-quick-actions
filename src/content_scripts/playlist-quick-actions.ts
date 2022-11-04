import * as Browser from "webextension-polyfill";
import {Ids, Tags, TextContent} from "../html-element-processing/element-data";
import {RuntimeMessage} from "../enums/runtime-message";
import {YtQuickActionsElements} from "../html-element-processing/yt-quick-action-elements";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentContainsNavigationFilter
} from "../html-navigation/navigation-filter";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";
import {OneshotObserver} from "../data/oneshot-observer";
import {OneshotId} from "../enums/oneshot-id";
import {TabMessage} from "../data/tab-message";
import {ElementExistsWatcher} from "../html-element-processing/element-exists-watcher";
import {StorageAccessor} from "../storage/storage-accessor";
import {contentLogProvider, contentScriptObserversManager} from "./init-globals";

const createdElements: HTMLElement[] = [];
const logger = contentLogProvider.getPlaylistQuickActionsLogger();

/*
If we do not wait for the popup content to update, the first entry in the playlist is deleted due to the
 HTML load performed with the first entry.
 */
const menuUpdatedObserver = new MutationObserver((mutations, observer) => {
    mutations.forEach((mutation) => {
        if (mutation.oldValue === '') {
            const ytFormattedText = HtmlTreeNavigator.startFrom(mutation.target as HTMLElement)
                .findFirst(new TextContentContainsNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.REMOVE_FROM_LOWERCASE));
            if (!!ytFormattedText) {
                ytFormattedText.click();
            } else {
                logger.error('Could not find remove option in popup');
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
            .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER));

        if (!ytdPlaylistVideoRenderer) {
            logger.error('Could not find ytd-playlist-video-renderer from mutation target');
            return;
        }

        const ytIconButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
            .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));

        if (!ytIconButton) {
            logger.error('Could not find yt-icon-button (more options) in ytd-playlist-video-renderer');
            return;
        }

        const existingRemoveButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
            .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON));
        if (!!ytdPlaylistVideoRenderer && !existingRemoveButton) {
            appendRemoveButton(ytIconButton, ytdPlaylistVideoRenderer);
        }
    }
});

function setupRemoveButton(menuButton: HTMLElement): HTMLButtonElement {
    const removeButton = YtQuickActionsElements.removeButton();
    removeButton.onclick = () => {
        menuButton.click();
        const popupMenu = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS));

        if (!popupMenu) {
            logger.error('Could not find popup menu');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotId.MENU_UPDATED_OBSERVER,
            RuntimeMessage.NAVIGATED_TO_PLAYLIST,
            menuUpdatedObserver
        )).observe(popupMenu, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
        })
    };

    return removeButton;
}

function appendRemoveButton(ytIconButton: HTMLElement, ytdPlaylistVideoRenderer: HTMLElement): void {
    const removeButton = setupRemoveButton(ytIconButton as HTMLButtonElement);
    createdElements.push(removeButton);
    ytdPlaylistVideoRenderer.append(removeButton);
}

function initContentScript(menuButtons: HTMLElement[]): void {
    // Remove all previously created remove buttons.
    createdElements.forEach(element => element.remove());

    // This causes the YouTube icon button menu HTML to be loaded, otherwise we can not find it by
    // navigating the HTML tree.
    const firstMenuButton = menuButtons[0] as HTMLButtonElement;
    firstMenuButton.click();
    firstMenuButton.click();

    for (const menuButton of menuButtons) {
        const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(menuButton)
            .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER));
        appendRemoveButton(menuButton, ytdPlaylistVideoRenderer);
    }

    const ytdPlaylistVideoListRenderer = HtmlParentNavigator.startFrom(firstMenuButton)
        .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER));

    if (!ytdPlaylistVideoListRenderer) {
        logger.error('Could not find ytd-playlist-video-list-renderer to setup quick actions for future' +
            ' playlist items');
        return;
    }

    contentScriptObserversManager.addForPage(RuntimeMessage.NAVIGATED_TO_PLAYLIST, playlistLoadingNewEntriesObserver)
        .observe(ytdPlaylistVideoListRenderer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
        })
}

async function processRuntimeMessage(message: TabMessage): Promise<void> {
    const level = await StorageAccessor.getLogLevel();
    logger.setLevel(level);

    if (message.runtimeMessage === RuntimeMessage.NAVIGATED_TO_PLAYLIST) {
        if (message.disconnectObservers) {
            contentScriptObserversManager.disconnectAll();
        }

        logger.debug('Watch for the first menu button in a playlist');
        ElementExistsWatcher.watch(message.runtimeMessage, logger, () => HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
            .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
        ).then(() => {
            const menuButtons: HTMLElement[] = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
                .findAll(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));
            if (menuButtons.length > 0) {
                initContentScript(menuButtons);
            } else {
                logger.error('Could not find menu buttons of playlist items');
            }
        });
    }
}

Browser.runtime.onMessage.addListener(processRuntimeMessage);
