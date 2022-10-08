import * as Browser from "webextension-polyfill";
import {Tags, TextContent} from "../html-navigation/element-data";
import {CommonNavigations} from "../html-navigation/common-navigations";
import {RuntimeMessages} from "../runtime-messages";
import {YtQuickActionsElements} from "../yt-quick-action-elements";
import {IntervalRunner, RunningInterval} from "../interval-runner";

const globalPageReadyInterval = new IntervalRunner();
const createdElements: HTMLElement[] = [];

function setupRemoveButton(menuButton: HTMLButtonElement): HTMLButtonElement {
    const removeButton = YtQuickActionsElements.removeButton();
    removeButton.onclick = () => {
        menuButton.click();
        const popupMenu = CommonNavigations.getPopupMenu();

        // If we do not wait for the popup content to update, the first entry in the playlist is deleted due
        // to the HTML load performed with the first entry.
        const menuUpdateObserver = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                const ytFormattedText = mutation.target;
                if (ytFormattedText.nodeName.toLowerCase() === Tags.SPAN
                    && ytFormattedText.textContent === TextContent.REMOVE_FROM) {
                    const deleteItemEntrySpan = CommonNavigations.getPopupDeleteEntry(popupMenu);
                    deleteItemEntrySpan.click();
                    observer.disconnect();
                }
            })
        })

        menuUpdateObserver.observe(popupMenu, {
            subtree: true, attributes: true, attributeFilter: ['class']
        })
    };

    return removeButton;
}

function main(): void {
    // Remove all previously created remove buttons.
    createdElements.forEach(element => element.remove());
    const menuButtons: HTMLElement[] = CommonNavigations.getPlaylistItemsMenuButtons();

    // This cause the popup HTML to be loaded, otherwise we can not find it by navigating the HTML tree.
    const firstMenuButton = menuButtons[0] as HTMLButtonElement;
    firstMenuButton.click();
    firstMenuButton.click();

    for (const menuButton of menuButtons) {
        const ytdPlaylistVideoRenderer = menuButton.parentElement.parentElement.parentElement;
        const removeButton = setupRemoveButton(menuButton as HTMLButtonElement);
        createdElements.push(removeButton);
        ytdPlaylistVideoRenderer.append(removeButton);
    }
}

Browser.runtime.onMessage.addListener((message) => {
    if (message === RuntimeMessages.NAVIGATED_TO_PLAYLIST) {
        globalPageReadyInterval.start(1000, (runningInterval: RunningInterval) => {
            const lastMenuButton: HTMLElement = CommonNavigations.getLastPlaylistItemMenuButton();
            if (!!lastMenuButton) {
                runningInterval.stop();
                main();
            }
        })
    }
})
