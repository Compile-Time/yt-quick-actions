import * as Browser from "webextension-polyfill";
import {RuntimeMessage} from "../enums/runtime-message";
import {IntervalRunner} from "../interval-runner";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {IdNavigationFilter, TextContentNavigationFilter} from "../html-navigation/navigation-filter";
import {AttributeNames, Ids, Tags, TextContent} from "../html-navigation/element-data";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";
import {StorageAccessor} from "../storage-accessor";
import {LogHelper} from "../log-helper";
import {activeObserversManager} from "../active-observers-manager";
import {OneshotObserver} from "../data/oneshot-observer";
import {OneshotId} from "../enums/oneshot-id";
import {TabMessage} from "../data/tab-message";

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    LogHelper.pageReadyIntervalLimitReached('watching-playlist-quick-actions');
});

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
    const button = YtQuickActionsElements.removeButton();
    button.onclick = () => {
        element.click();
        const popupMenu = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS));

        activeObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotId.REMOVE_POPUP_ENTRY_READY,
            RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST,
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
            .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON));
        if (!existingRemoveButton) {
            playlistItem.insertBefore(removeButton, divMenu);
        }
    }
}

Browser.runtime.onMessage.addListener((message: TabMessage) => {
    if (message.runtimeMessage === RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST) {
        if (message.disconnectObservers) {
            activeObserversManager.disconnectAll();
        }

        globalPageReadyInterval.start(1000, runningInterval => {
            const playlistPanelVideoRendererItems = HtmlTreeNavigator.startFrom(document.body)
                .logOperations('Find all playlist items', StorageAccessor.getLogMode())
                .findAll(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS));

            if (!!playlistPanelVideoRendererItems) {
                runningInterval.stop();
                initContentScript(playlistPanelVideoRendererItems);
            }
        });
    }
});