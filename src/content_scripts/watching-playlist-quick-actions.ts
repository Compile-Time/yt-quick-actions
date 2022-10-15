import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {CommonNavigations} from "../html-navigation/common-navigations";
import {IntervalRunner} from "../interval-runner";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {IdNavigationFilter, TextContentNavigationFilter} from "../html-navigation/navigation-filter";
import {AttributeNames, Ids, Tags, TextContent} from "../html-navigation/element-data";
import {HtmlTreeDirectNavigator} from "../html-navigation/html-tree-direct-navigator";

const globalPageReadyInterval = new IntervalRunner();

function setupRemoveButton(element: HTMLElement): HTMLButtonElement {
    const button = YtQuickActionsElements.removeButton();
    button.onclick = () => {
        element.click();
        const popupMenu = CommonNavigations.getPopupMenu();
        const popupReadyObserver = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                const removeOption: HTMLElement = HtmlTreeDirectNavigator.startFrom(mutation.target as HTMLElement)
                    .findFirst(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.REMOVE_FROM_PLAYLIST))
                if (!!removeOption && mutation.oldValue === '') {
                    removeOption.click();
                    observer.disconnect();
                }
            }
        });
        popupReadyObserver.observe(popupMenu, {
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: [AttributeNames.HIDDEN]
        });
    };
    return button;
}

function main(): void {
    const ytMenuIconButtons = CommonNavigations.getWatchingPlaylistItemsMenuButtons();
    for (const ytMenuIconButton of ytMenuIconButtons) {
        const removeButton = setupRemoveButton(ytMenuIconButton);

        const playlistItem = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS));
        const divMenu = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.DIV, Ids.MENU));

        playlistItem.insertBefore(removeButton, divMenu);
    }
}

Browser.runtime.onMessage.addListener(message => {
    if (message === RuntimeMessages.NAVIGATED_TO_VIDEO_IN_PLAYLIST) {
        globalPageReadyInterval.start(1000, runningInterval => {
            const watchingPlaylistItemsContainer = CommonNavigations.getWatchingPlaylistItemsContainer();
            if (!!watchingPlaylistItemsContainer) {
                runningInterval.stop();
                main();
            }
        });
    }
});