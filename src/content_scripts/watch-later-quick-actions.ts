import * as Browser from "webextension-polyfill";
import {Ids, Tags, TextContent} from "../html-navigation/element-data";
import {CommonNavigations} from "../html-navigation/common-navigations";
import {RuntimeMessages} from "../runtime-messages";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {IntervalRunner, RunningInterval} from "../interval-runner";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentContainsNavigationFilter
} from "../html-navigation/navigation-filter";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";
import {activePageObserverManager} from "../active-page-observer-manager";

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    console.error('Could not determine if page is ready for operation. Please enable debug mode and check' +
        ' the logs.')
});
const createdElements: HTMLElement[] = [];

function setupRemoveButton(menuButton: HTMLElement): HTMLButtonElement {
    const removeButton = YtQuickActionsElements.removeButton();
    removeButton.onclick = () => {
        menuButton.click();
        const popupMenu = CommonNavigations.getPopupMenu();

        // If we do not wait for the popup content to update, the first entry in the playlist is deleted due
        // to the HTML load performed with the first entry.
        const menuUpdateObserver = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                if (mutation.oldValue === '') {
                    const ytFormattedText = HtmlTreeNavigator.startFrom(mutation.target as HTMLElement)
                        .findFirst(new TextContentContainsNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.REMOVE_FROM_LOWERCASE));
                    if (!!ytFormattedText) {
                        ytFormattedText.click();
                    }
                    observer.disconnect();
                }
            })
        })

        menuUpdateObserver.observe(popupMenu, {
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

function main(menuButtons: HTMLElement[]): void {
    // Remove all previously created remove buttons.
    createdElements.forEach(element => element.remove());

    // This cause the YouTube icon button menu HTML to be loaded, otherwise we can not find it by
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
    // Register an observer to add the remove button to new playlist items loaded afterwards. This only
    // occurs in long playlists. Sadly, an observer can not be used on initial page load to detect the
    // playlist items, therefore, we need both an interval and an observer.
    const loadingNewEntriesObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(mutation.target as HTMLElement)
                .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER));
            const ytIconButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
                .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));

            const existingRemoveButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON));
            if (!!ytdPlaylistVideoRenderer && !existingRemoveButton) {
                appendRemoveButton(ytIconButton, ytdPlaylistVideoRenderer);
            }
        }
    });

    activePageObserverManager.switchObserver(loadingNewEntriesObserver);
    loadingNewEntriesObserver.observe(ytdPlaylistVideoListRenderer, {
        subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
    })
}

Browser.runtime.onMessage.addListener((message) => {
    if (message === RuntimeMessages.NAVIGATED_TO_PLAYLIST) {
        globalPageReadyInterval.start(1000, (runningInterval: RunningInterval) => {
            const menuButtons: HTMLElement[] = CommonNavigations.getPlaylistMenuButtons();
            if (!!menuButtons) {
                runningInterval.stop();
                main(menuButtons);
            }
        })
    }
})
