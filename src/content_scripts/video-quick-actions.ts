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

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    console.error('Could not determine if page is ready for operation. Please enable debug mode and check' +
        ' the logs.')
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
            const target = mutation.target;
            if (target.nodeName.toLowerCase() === Tags.YT_FORMATTED_STRING
                && target.textContent === TextContent.WATCH_LATER
                && (mutation.oldValue === '' || mutation.oldValue === TextContent.WATCH_LATER)) {

                // FIXME: Why not just cast `target` to a HTMLElement and perform a click on it?
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
        } else if (!popupTrigger) {
            const moreOptionsButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
                .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));
            clickSaveToWatchLaterOptionForHalfScreenSize(moreOptionsButton);
        } else {
            console.error('Could not HTML element for "Save to" action');
        }
    };

    return quickActionsWatchLater;
}

function main(moreOptionsButton: HTMLElement): void {
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
                main(moreOptionsButton);
            }

            if (!!existingQuickActionsWatchLaterButton) {
                runningInterval.stop();
            }
        })
    }
});
