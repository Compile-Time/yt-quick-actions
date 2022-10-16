import {CommonNavigations} from "../html-navigation/common-navigations";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {IntervalRunner} from "../interval-runner";
import {Tags, TextContent} from "../html-navigation/element-data";

const globalPageReadyInterval = new IntervalRunner(5);
const createdElements: HTMLElement[] = [];

function main(flexibleItemButtons: HTMLElement): void {
    // Remove existing buttons otherwise duplicates are present on the page.
    createdElements.forEach(element => element.remove());

    const quickActionsWatchLater = YtQuickActionsElements.watchLaterUnderVideoButton();
    createdElements.push(quickActionsWatchLater);
    quickActionsWatchLater.onclick = () => {
        const popupTrigger = CommonNavigations.getPlaylistAddPopupContainerTrigger();
        popupTrigger.click();

        const popupReadyObserver = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                const target = mutation.target;
                if (target.nodeName.toLowerCase() === Tags.YT_FORMATTED_STRING
                    && target.textContent === TextContent.WATCH_LATER
                    && (mutation.oldValue === '' || mutation.oldValue === TextContent.WATCH_LATER)) {

                    const popupWatchLaterEntry = CommonNavigations.getPlaylistAddWatchLaterEntry()
                    popupWatchLaterEntry.click();
                    popupTrigger.click();

                    observer.disconnect();
                }
            }
        });

        const popupContainer = CommonNavigations.getPopupContainer();
        popupReadyObserver.observe(popupContainer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
        });
    };

    flexibleItemButtons.parentElement.insertBefore(quickActionsWatchLater, flexibleItemButtons);
}

Browser.runtime.onMessage.addListener((message) => {
    if (message === RuntimeMessages.NAVIGATED_TO_VIDEO) {
        globalPageReadyInterval.start(1000, runningInterval => {
            const flexibleItemButtons = CommonNavigations.getVideoFlexibleItemButtons();
            if (flexibleItemButtons) {
                runningInterval.stop();
                main(flexibleItemButtons);
            }
        })
    }
});
