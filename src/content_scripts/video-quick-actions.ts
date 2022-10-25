import {YtQuickActionsElements} from "../yt-quick-action-elements";
import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {IntervalRunner} from "../interval-runner";
import {Ids, Tags, TextContent} from "../html-navigation/element-data";
import {
    IdAndTextContentNavigationFilter,
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentContainsNavigationFilter
} from "../html-navigation/navigation-filter";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";
import {StorageAccessor} from "../storage-accessor";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {LogHelper} from "../log-helper";

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    LogHelper.pageReadyIntervalLimitReached('video-quick-actions');
});
const createdElements: HTMLElement[] = [];

/**
 * Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 *
 * @param popupTrigger - The html element which triggers the "Save to" pop up
 */
function clickSaveToWatchLaterOption(popupTrigger: HTMLElement): void {
    const popupReadyObserver = new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            const popupWatchLaterEntry = mutation.target as HTMLElement;
            if (popupWatchLaterEntry.nodeName.toLowerCase() === Tags.YT_FORMATTED_STRING
                && popupWatchLaterEntry.textContent === TextContent.WATCH_LATER
                && popupWatchLaterEntry.id === Ids.LABEL
                && (mutation.oldValue === '' || mutation.oldValue === TextContent.WATCH_LATER)) {

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

    popupTrigger.click();
}

/**
 * Wait for the more options popup ("...") to be ready and click the "Save" entry then delegate to
 * {@link clickSaveToWatchLaterOption}.
 *
 * @param moreOptionsButton - The HTML element which represents the more options menu ("...")
 */
function clickSaveToWatchLaterOptionForHalfScreenSize(moreOptionsButton: HTMLElement): void {
    const saveToOptionObserver = new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            const target = mutation.target as HTMLElement;
            const popupTrigger = HtmlTreeNavigator.startFrom(target)
                .findFirst(new TextContentContainsNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.SAVE))
            if (mutation.oldValue === ''
                && target.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
                && !!popupTrigger) {
                clickSaveToWatchLaterOption(popupTrigger);
                observer.disconnect();
            }
        }
    });

    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
    saveToOptionObserver.observe(popupContainer, {
        subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
    })

    moreOptionsButton.click();
}

function setupWatchLaterButton(moreOptionsButton: HTMLElement): HTMLButtonElement {
    const quickActionsWatchLater = YtQuickActionsElements.watchLaterUnderVideoButton();
    createdElements.push(quickActionsWatchLater);
    quickActionsWatchLater.onclick = () => {
        const ytdMenuRenderer = HtmlParentNavigator.startFrom(moreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_MENU_RENDERER));

        const popupTrigger = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.TEXT, TextContent.SAVE));

        if (!!popupTrigger) {
            clickSaveToWatchLaterOption(popupTrigger);
        } else {
            const moreOptionsButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
                .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));

            if (!!moreOptionsButton) {
                clickSaveToWatchLaterOptionForHalfScreenSize(moreOptionsButton);
            } else {
                LogHelper.error('Could not find HTML elements for action "Save to" or "... > Save"');
            }
        }
    };

    return quickActionsWatchLater;
}

function initContentScript(moreOptionsButton: HTMLElement): void {
    // Remove existing buttons otherwise duplicates are present on the page.
    createdElements.forEach(element => element.remove());
    const quickActionsWatchLater = setupWatchLaterButton(moreOptionsButton);
    moreOptionsButton.parentElement.insertBefore(quickActionsWatchLater, moreOptionsButton);
}

Browser.runtime.onMessage.addListener((message) => {
    if (message === RuntimeMessages.NAVIGATED_TO_VIDEO) {
        globalPageReadyInterval.start(1000, runningInterval => {
            const moreOptionsButton = HtmlTreeNavigator.startFrom(document.body)
                .logOperations('Find more options button ("...")', StorageAccessor.getLogMode())
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
                .filter(new IdNavigationFilter(Tags.DIV, 'actions'))
                .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
                .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));

            const existingQuickActionsWatchLaterButton = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
                .filter(new IdNavigationFilter(Tags.DIV, 'actions'))
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_VIDEO_WATCH_LATER));

            if (!!moreOptionsButton && !existingQuickActionsWatchLaterButton) {
                initContentScript(moreOptionsButton);
            }

            if (!!existingQuickActionsWatchLaterButton) {
                runningInterval.stop();
            }
        })
    }
});
