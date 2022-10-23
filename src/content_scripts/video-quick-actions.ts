import {YtQuickActionsElements} from "../yt-quick-action-elements";
import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {IntervalRunner} from "../interval-runner";
import {Ids, Tags, TextContent} from "../html-navigation/element-data";
import {
    IdAndTextContentNavigationFilter,
    IdNavigationFilter,
    TagNavigationFilter
} from "../html-navigation/navigation-filter";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";
import {StorageAccessor} from "../storage-accessor";

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    console.error('Could not determine if page is ready for operation. Please enable debug mode and check' +
        ' the logs.')
});
const createdElements: HTMLElement[] = [];

function setupWatchLaterButton(): HTMLButtonElement {
    const quickActionsWatchLater = YtQuickActionsElements.watchLaterUnderVideoButton();
    createdElements.push(quickActionsWatchLater);
    quickActionsWatchLater.onclick = () => {
        const popupTrigger = HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.TEXT, TextContent.SAVE));
        popupTrigger.click();

        // Wait for the playlist save popup to be ready.
        const popupReadyObserver = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                const target = mutation.target;
                if (target.nodeName.toLowerCase() === Tags.YT_FORMATTED_STRING
                    && target.textContent === TextContent.WATCH_LATER
                    && (mutation.oldValue === '' || mutation.oldValue === TextContent.WATCH_LATER)) {

                    const popupWatchLaterEntry = HtmlTreeNavigator.startFrom(document.body)
                        .filter(new TagNavigationFilter(Tags.YTD_ADD_TO_PLAYLIST_RENDERER))
                        .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER))
                        .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_CHECKBOX, Ids.CHECKBOX))
                        .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.LABEL, TextContent.WATCH_LATER));
                    popupWatchLaterEntry.click();
                    // Close the playlist popup.
                    popupTrigger.click();

                    observer.disconnect();
                }
            }
        });

        const popupContainer = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));
        popupReadyObserver.observe(popupContainer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
        });
    };

    return quickActionsWatchLater;
}

function main(videoActions: HTMLElement): void {
    // Remove existing buttons otherwise duplicates are present on the page.
    createdElements.forEach(element => element.remove());
    const quickActionsWatchLater = setupWatchLaterButton();

    const actionsObserver = new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            const target = mutation.target as HTMLElement;
            if (target.nodeName.toLowerCase() === Tags.DIV && target.id === 'actions-inner') {
                const moreOptionsButton = HtmlTreeNavigator.startFrom(target)
                    .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));
                moreOptionsButton.parentElement.insertBefore(quickActionsWatchLater, moreOptionsButton);
                observer.disconnect();
            }
        }
    });

    actionsObserver.observe(videoActions, {
        subtree: true, childList: true
    });
}

Browser.runtime.onMessage.addListener((message) => {
    if (message === RuntimeMessages.NAVIGATED_TO_VIDEO) {
        globalPageReadyInterval.start(1000, runningInterval => {
            const videoActions = HtmlTreeNavigator.startFrom(document.body)
                .logOperations('Find first container for video actions', StorageAccessor.getLogMode())
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
                .findFirst(new IdNavigationFilter(Tags.DIV, 'actions'));
            if (videoActions) {
                runningInterval.stop();
                main(videoActions);
            }
        })
    }
});
