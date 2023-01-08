import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {IdNavigationFilter, TextContentNavigationFilter} from "../../html-navigation/navigation-filter";
import {AttributeNames, Ids, Tags, TextContent} from "../../html-element-processing/element-data";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver} from "../../data/oneshot-observer";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {ElementExistsWatcher} from "../../html-element-processing/element-exists-watcher";
import {LogProvider} from "../../logging/log-provider";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";

const logger = contentLogProvider.getLogger(LogProvider.WATCHING_PLAYLIST);

/*
Wait for the menu popup to update so the correct video is removed.
*/
const removePopupEntryReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const removeOption: HTMLElement = HtmlTreeNavigator.startFrom(mutation.target as HTMLElement)
            .findFirst(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.REMOVE_FROM_PLAYLIST));
        if (!!removeOption && mutation.oldValue === '') {
            removeOption.click();
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
    for (const ytMenuIconButton of ytMenuIconButtons) {
        const removeButton = setupRemoveButton(ytMenuIconButton);

        const playlistItem = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS));
        const divMenu = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.DIV, Ids.MENU));

        const existingRemoveButton = HtmlTreeNavigator.startFrom(playlistItem)
            .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON));
        if (!existingRemoveButton) {
            playlistItem.insertBefore(removeButton, divMenu);
        }
    }
}

export function runWatchingPlaylistScriptIfTargetElementExists(): void {
    logger.debug('Watch for first playlist item under or next to a video');
    ElementExistsWatcher.build()
        .queryFn(() => HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))
        )
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(observer)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                })
        )
        .run()
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