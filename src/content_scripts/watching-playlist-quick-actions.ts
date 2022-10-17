import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {CommonNavigations} from "../html-navigation/common-navigations";
import {IntervalRunner} from "../interval-runner";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {IdNavigationFilter, TextContentNavigationFilter} from "../html-navigation/navigation-filter";
import {AttributeNames, Ids, Tags, TextContent} from "../html-navigation/element-data";
import {HtmlTreeDirectNavigator} from "../html-navigation/html-tree-direct-navigator";

const globalPageReadyInterval = new IntervalRunner(5);

function setupRemoveButton(element: HTMLElement): HTMLButtonElement {
    const button = YtQuickActionsElements.removeButton();
    button.onclick = () => {
        element.click();
        const popupMenu = CommonNavigations.getPopupMenu();
        const popupReadyObserver = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                const removeOption: HTMLElement = HtmlTreeDirectNavigator.startFrom(mutation.target as HTMLElement)
                    .filter(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.REMOVE_FROM_PLAYLIST))
                    .findFirst()
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

function main(playlistPanelVideoRendererItems: HTMLElement[]): void {
    const ytMenuIconButtons = playlistPanelVideoRendererItems
        .map(element => HtmlTreeDirectNavigator.startFrom(element)
            .filter(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
            .findFirst()
        );
    for (const ytMenuIconButton of ytMenuIconButtons) {
        const removeButton = setupRemoveButton(ytMenuIconButton);

        const playlistItem = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS));
        const divMenu = HtmlParentNavigator.startFrom(ytMenuIconButton)
            .find(new IdNavigationFilter(Tags.DIV, Ids.MENU));

        const existingRemoveButton = HtmlTreeDirectNavigator.startFrom(playlistItem)
            .filter(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON))
            .findFirst();
        if (!existingRemoveButton) {
            playlistItem.insertBefore(removeButton, divMenu);
        }
    }
}

Browser.runtime.onMessage.addListener(message => {
    if (message === RuntimeMessages.NAVIGATED_TO_VIDEO_IN_PLAYLIST) {
        globalPageReadyInterval.start(1000, runningInterval => {
            const playlistPanelVideoRendererItems = HtmlTreeDirectNavigator.startFrom(document.body)
                .filter(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))
                .find();

            if (!!playlistPanelVideoRendererItems) {
                runningInterval.stop();
                main(playlistPanelVideoRendererItems);
            } else {
                console.error('Could not find required HTML elements for page manipulation!');
            }
        });
    }
});