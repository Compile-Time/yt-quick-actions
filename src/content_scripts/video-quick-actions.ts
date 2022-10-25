import {YtQuickActionsElements} from "../yt-quick-action-elements";
import * as Browser from "webextension-polyfill";
import {RuntimeMessage} from "../enums/runtime-message";
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
import {activeObserversManager} from "../active-observers-manager";
import {OneshotObserver} from "../data/oneshot-observer";
import {OneshotId} from "../enums/oneshot-id";
import {TabMessage} from "../data/tab-message";

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    LogHelper.pageReadyIntervalLimitReached('video-quick-actions');
});
const createdElements: HTMLElement[] = [];

/*
Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 */
const saveToFullScreenPopupReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const popupWatchLaterEntry = mutation.target as HTMLElement;
        if (popupWatchLaterEntry.nodeName.toLowerCase() === Tags.YT_FORMATTED_STRING
            && popupWatchLaterEntry.textContent === TextContent.WATCH_LATER
            && popupWatchLaterEntry.id === Ids.LABEL
            && (mutation.oldValue === '' || mutation.oldValue === TextContent.WATCH_LATER)) {

            popupWatchLaterEntry.click();

            // Close the playlist popup.
            const saveButton = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
                .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
                .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
                .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
                .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
                .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.TEXT, TextContent.SAVE));
            saveButton.click();

            observer.disconnect();
        }
    }
});

const saveToHalfScreenObserver = new MutationObserver((mutations, observer) => {
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

/**
 * Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 *
 * @param popupTrigger - The html element which triggers the "Save to" pop up
 */
function clickSaveToWatchLaterOption(popupTrigger: HTMLElement): void {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));

    activeObserversManager.upsertOneshotObserver(new OneshotObserver(
        OneshotId.SAVE_TO_FULL_SCREEN_POPUP_READY,
        RuntimeMessage.NAVIGATED_TO_VIDEO,
        saveToFullScreenPopupReadyObserver
    )).observe(popupContainer, {
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
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))

    activeObserversManager.upsertOneshotObserver(new OneshotObserver(
        OneshotId.SAVE_TO_HALF_SCREEN_POPUP_READY,
        RuntimeMessage.NAVIGATED_TO_VIDEO,
        saveToHalfScreenObserver
    )).observe(popupContainer, {
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

        const saveButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.TEXT, TextContent.SAVE));

        if (!!saveButton) {
            clickSaveToWatchLaterOption(saveButton);
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

Browser.runtime.onMessage.addListener((message: TabMessage) => {
    if (message.isVideoPage()) {
        if (message.shouldDisconnectObservers()) {
            activeObserversManager.disconnectAll();
        }

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

            // On half-window sizes our custom HTMl gets inserted but is them removed due to updates
            // performed on the YouTube page. To fix this we stop the interval only when we know that our
            // custom element exists.
            if (!!existingQuickActionsWatchLaterButton) {
                runningInterval.stop();
            }
        })
    }
});
