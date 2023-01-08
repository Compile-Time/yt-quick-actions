import {Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver} from "../../data/oneshot-observer";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";
import {LogProvider} from "../../logging/log-provider";

const createdElements: HTMLElement[] = [];
const logger = contentLogProvider.getLogger(LogProvider.PLAYLIST);

/*
If we do not wait for the popup content to update, the first entry in the playlist is deleted due to the
 HTML load performed with the first entry.
 */
const menuUpdatedObserver = new MutationObserver((mutations, observer) => {
    mutations.forEach((mutation) => {
        if (mutation.oldValue === '') {
            const tpYtPaperListBox: HTMLElement = mutation.target as HTMLElement;
            const removeMenuEntry = HtmlTreeNavigator.startFrom(tpYtPaperListBox)
                .findFirstToParentNavigator(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.TRASH_ICON))
                .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM));

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
            .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON));
        if (!!ytdPlaylistVideoRenderer && !existingRemoveButton) {
            appendRemoveButton(ytIconButton, ytdPlaylistVideoRenderer);
        }
    }
});

function setupRemoveButton(menuButton: HTMLElement): HTMLButtonElement {
    const removeButton = QaHtmlElements.removeButton();
    removeButton.onclick = () => {
        menuButton.click();
        const popupMenu = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS));

        if (!popupMenu) {
            logger.error('Could not find popup menu');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotObserverId.PLAYLIST_MENU_UPDATED_OBSERVER,
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

    // Initialize the playlist options menu. If this is not done, then the first click on any Quick Actions
    // element will only open the menu.
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

    contentScriptObserversManager.addBackgroundObserver(playlistLoadingNewEntriesObserver)
        .observe(ytdPlaylistVideoListRenderer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
        })
}

export function runPlaylistScriptIfTargetElementExists(): void {
    logger.debug('Watch for the first menu button in a playlist');
    MutationElementExistsWatcher.build()
        .queryFn(() => {
            const ytIconButton = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
                .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
            return {ytIconButton: ytIconButton};
        })
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(observer)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                })
        )
        .start()
        .then(() => {
            logger.debug('First menu button was found!');
            const menuButtons: HTMLElement[] = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
                .findAll(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));
            if (menuButtons.length > 0) {
                initContentScript(menuButtons);
            } else {
                logger.error('Could not find menu buttons of playlist items');
            }
        })
}
