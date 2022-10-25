import * as Browser from "webextension-polyfill";
import {RuntimeMessage} from "../enums/runtime-message";
import {IntervalRunner} from "../interval-runner";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "../html-navigation/navigation-filter";
import {Ids, Tags, TextContent} from "../html-navigation/element-data";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {activeObserversManager} from "../active-observers-manager";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";
import {StorageAccessor} from "../storage-accessor";
import {LogHelper} from "../log-helper";
import {OneshotObserver} from "../data/oneshot-observer";
import {OneshotId} from "../enums/oneshot-id";
import {TabMessage} from "../data/tab-message";

const globalPageReadyInterval = new IntervalRunner(5);
globalPageReadyInterval.registerIterationLimitReachedCallback(() => {
    LogHelper.pageReadyIntervalLimitReached('home-page-quick-actions')
});

/*
Observer to wait for the "Save to Watch later" option to update for the relevant video.
 */
const saveToWatchLaterPopupEntryReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const target = mutation.target;
        if (target.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
            && mutation.oldValue === '') {
            const watchLaterButton = HtmlTreeNavigator.startFrom(document.body)
                .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
                .findFirst(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.SAVE_TO_WATCH_LATER));
            watchLaterButton.click();
            observer.disconnect();
        }
    }
});

/*
Home page videos are lazily loaded on scrolling, therefore, we need to observe them. Disconnect is handled
 by the ActiveObserversManager and url-change-watcher background script when switching to a different page
  on YouTube.
 */
const homePageVideosLoadingObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const target = mutation.target as HTMLElement;
        const ytdRichGridRow = HtmlParentNavigator.startFrom(target)
            .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));

        if (target.nodeName.toLowerCase() === Tags.BUTTON && !!ytdRichGridRow) {
            const menuButton = target as HTMLButtonElement;
            const divMenu = HtmlParentNavigator.startFrom(menuButton)
                .find(new IdNavigationFilter(Tags.DIV, Ids.MENU));

            const existingWatchLaterButton = HtmlTreeNavigator.startFrom(divMenu.parentElement)
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_HOME_WATCH_LATER));
            if (!existingWatchLaterButton) {
                divMenu.parentElement.insertBefore(setupWatchLaterButton(menuButton), divMenu);
            }
        }
    }
});

function setupWatchLaterButton(videoMenuButton: HTMLElement): HTMLButtonElement {
    const watchLaterButton = YtQuickActionsElements.watchLaterHomeVideoButton();
    watchLaterButton.onclick = () => {
        videoMenuButton.click();
        const popupContainer = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));

        activeObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
            RuntimeMessage.NAVIGATED_TO_HOME_PAGE,
            saveToWatchLaterPopupEntryReadyObserver
        )).observe(popupContainer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
        })
    };

    return watchLaterButton;
}

function initContentScript(homePageVideos: HTMLElement[]): void {
    const firstHomePageVideo = homePageVideos[0];
    activeObserversManager.addForPage(RuntimeMessage.NAVIGATED_TO_HOME_PAGE, homePageVideosLoadingObserver)
        .observe(firstHomePageVideo.parentElement, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['aria-label']
        })
}

Browser.runtime.onMessage.addListener((message: TabMessage) => {
    if (message.isHomePage()) {
        if (message.shouldDisconnectObservers()) {
            activeObserversManager.disconnectAll();
        }

        globalPageReadyInterval.start(1000, runningInterval => {
            const homePageVideos = HtmlTreeNavigator.startFrom(document.body)
                .logOperations('Find all videos containing grid rows', StorageAccessor.getLogMode())
                .filter(new TagNavigationFilter(Tags.YTD_APP))
                .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
                .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
                .findAll(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));
            if (homePageVideos.length > 0) {
                runningInterval.stop();
                initContentScript(homePageVideos);
            }
        });
    }
});