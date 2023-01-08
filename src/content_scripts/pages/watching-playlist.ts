import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {AttributeNames, Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver} from "../../data/oneshot-observer";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {LogProvider} from "../../logging/log-provider";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";

const logger = contentLogProvider.getLogger(LogProvider.WATCHING_PLAYLIST);

/*
Wait for the menu popup to update so the correct video is removed.
*/
const removePopupEntryReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const ytdMenuServiceItemRenderer = mutation.target as HTMLElement;
        const removeMenuEntry: HTMLElement = HtmlTreeNavigator.startFrom(ytdMenuServiceItemRenderer)
            .filter(new TagNavigationFilter(Tags.YT_ICON))
            .findFirstToParentNavigator(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.TRASH_ICON))
            .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM));

        if (!!removeMenuEntry && mutation.oldValue === '') {
            removeMenuEntry.click();
            observer.disconnect();
        }
    }
});

function setupRemoveButton(element: HTMLElement): HTMLButtonElement {
    const button = QaHtmlElements.removeButtonInWatchingPlaylist();
    button.onclick = () => {
        element.click();
        const popupMenu = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS));

        if (!popupMenu) {
            logger.error('Could not find popup menu trigger');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotObserverId.REMOVE_POPUP_ENTRY_READY,
            removePopupEntryReadyObserver
        )).observe(popupMenu, {
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: [AttributeNames.HIDDEN]
        });
    };
    return button;
}

function initContentScript(playlistPanelVideoRendererItems: HTMLElement[]): void {
    const ytMenuIconButtons = playlistPanelVideoRendererItems
        .map(element => HtmlTreeNavigator.startFrom(element)
            .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
        );

    // Initialize the menu popup to prevent the first click on any Quick Action element to only show the popup.
    const firstYtMenuIconButtons = ytMenuIconButtons[0];
    firstYtMenuIconButtons.click();
    firstYtMenuIconButtons.click();

    for (const ytMenuIconButton of ytMenuIconButtons) {
        const removeButton = setupRemoveButton(ytMenuIconButton);

        const playlistItem = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS));

        const existingRemoveButton = HtmlTreeNavigator.startFrom(playlistItem)
            .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON));
        if (!existingRemoveButton) {
            playlistItem.append(removeButton);
        }
    }
}

export function runWatchingPlaylistScriptIfTargetElementExists(): void {
    logger.debug('Watch for first playlist item under or next to a video');
    MutationElementExistsWatcher.build()
        .queryFn(() => {
                const playlistItems = HtmlTreeNavigator.startFrom(document.body)
                    .findFirst(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))

                return {playlistItems: playlistItems};
            }
        )
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(observer)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                })
        )
        .start()
        .then(() => {
            logger.debug('First playlist item was found!');
            const playlistPanelVideoRendererItems = HtmlTreeNavigator.startFrom(document.body)
                .findAll(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS));
            if (playlistPanelVideoRendererItems) {
                initContentScript(playlistPanelVideoRendererItems);
            } else {
                logger.error('Could not find ytd-playlist-panel-video-renderer elements');
            }
        })
}