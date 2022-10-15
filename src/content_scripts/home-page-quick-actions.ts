import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {IntervalRunner} from "../interval-runner";
import {CommonNavigations} from "../html-navigation/common-navigations";
import {HtmlParentNavigator} from "../html-navigation/html-parent-navigator";
import {IdNavigationFilter, TagNavigationFilter} from "../html-navigation/navigation-filter";
import {Ids, Tags} from "../html-navigation/element-data";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {HtmlTreeNavigator} from "../html-navigation/html-tree-navigator";

const globalPageReadyInterval = new IntervalRunner();
const createdElements: HTMLElement[] = [];

function setupWatchLaterButton(videoMenuButton: HTMLElement): HTMLButtonElement {
    const watchLaterButton = YtQuickActionsElements.watchLaterHomeVideoButton();
    watchLaterButton.onclick = () => {
        videoMenuButton.click();

        const popupReadyObserver = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                const target = mutation.target;
                if (target.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
                    && mutation.oldValue === '') {
                    const watchLaterButton = CommonNavigations.getHomePageVideoWatchLaterMenuEntry()
                    watchLaterButton.click();
                    observer.disconnect();
                }
            }
        });

        const popupContainer = CommonNavigations.getPopupContainer();
        popupReadyObserver.observe(popupContainer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
        })
    };

    return watchLaterButton;
}

function main(): void {
    const homePageVideos = CommonNavigations.getHomePageVideoRow();

    const observer = new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            const target = mutation.target as HTMLElement;
            const ytdRichGridRow = HtmlParentNavigator.startFrom(target)
                .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));

            if (target.nodeName.toLowerCase() === Tags.BUTTON && !!ytdRichGridRow) {
                const menuButton = target as HTMLButtonElement;
                const divMenu = HtmlParentNavigator.startFrom(menuButton)
                    .find(new IdNavigationFilter(Tags.DIV, Ids.MENU));

                const existingWatchLaterButton = HtmlTreeNavigator.startFrom(divMenu.parentElement)
                    .filter(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_HOME_WATCH_LATER))
                    .findFirst();
                if (!existingWatchLaterButton) {
                    divMenu.parentElement.insertBefore(setupWatchLaterButton(menuButton), divMenu);
                }
            }
        }
    });

    const firstHomePageVideo = homePageVideos[0];
    observer.observe(firstHomePageVideo.parentElement, {
        subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['aria-label']
    })
}

Browser.runtime.onMessage.addListener(message => {
    if (message === RuntimeMessages.NAVIGATED_TO_HOME_PAGE) {
        globalPageReadyInterval.start(1000, runningInterval => {
            runningInterval.stop();
            main();
        });
    }
});