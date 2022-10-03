import {HtmlTreeNavigator} from "../html-tree-navigation/html-tree-navigator";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "../html-tree-navigation/navigation-filter";
import * as Browser from "webextension-polyfill";
import {RELEVANT_IDS} from "../html-tree-navigation/relevant-elements";
import {getRemoveButtons} from "../html-tree-navigation/common-navigations";

let globalPageReadyInterval;

const YT_PL_QA_REMOVE_BUTTON = 'yt-pl-qa-remove-button';

function createRemoveButton(menuButton: HTMLButtonElement): Element {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.id = RELEVANT_IDS.YT_PL_QA_REMOVE_BUTTON;
    removeButton.onclick = () => {
        menuButton.click();
        const popupMenu = HtmlTreeNavigator.navigate(document.body)
            .filter(new TagNavigationFilter('ytd-app'))
            .filter(new TagNavigationFilter('ytd-popup-container'))
            .filter(new TagNavigationFilter('tp-yt-iron-dropdown'))
            .filter(new IdNavigationFilter('div', 'contentWrapper'))
            .filter(new TagNavigationFilter('ytd-menu-popup-renderer'))
            .filter(new IdNavigationFilter('tp-yt-paper-listbox', 'items'))
            .findFirst();
        console.log(popupMenu);

        // If we do not wait for the popup content to update, the first entry in the playlist is deleted due
        // to the HTML load performed with the first entry.
        const menuUpdateObserver = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                console.log(mutation);
                const ytFormattedText = mutation.target;
                if (ytFormattedText.nodeName.toLowerCase() === 'span'
                    && ytFormattedText.textContent === 'Remove from ') {
                    const deleteItemEntrySpan = HtmlTreeNavigator.navigate(popupMenu)
                        .filter(new TagNavigationFilter('ytd-menu-service-item-renderer'))
                        .filter(new TagNavigationFilter('tp-yt-paper-item'))
                        .filter(new TagNavigationFilter('yt-formatted-string'))
                        .filter(new TextContentNavigationFilter('span', 'Remove from '))
                        .findFirst();
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
    getRemoveButtons().forEach(button => button.remove());

    const menuButtons: HTMLElement[] = HtmlTreeNavigator.navigate(document.body)
        .filter(new TagNavigationFilter('ytd-app'))
        .filter(new IdNavigationFilter('div', 'content'))
        .filter(new IdNavigationFilter('ytd-page-manager', 'page-manager'))
        .filter(new TagNavigationFilter('ytd-browse'))
        .filter(new TagNavigationFilter('ytd-two-column-browse-results-renderer'))
        .filter(new IdNavigationFilter('div', 'primary'))
        .filter(new TagNavigationFilter('ytd-section-list-renderer'))
        .filter(new IdNavigationFilter('div', 'contents'))
        .filter(new TagNavigationFilter('ytd-item-section-renderer'))
        .filter(new IdNavigationFilter('div', 'contents'))
        .filter(new TagNavigationFilter('ytd-playlist-video-list-renderer'))
        .filter(new IdNavigationFilter('div', 'contents'))
        .filter(new TagNavigationFilter('ytd-playlist-video-renderer'))
        .filter(new IdNavigationFilter('div', 'menu'))
        .filter(new TagNavigationFilter('ytd-menu-renderer'))
        .filter(new IdNavigationFilter('yt-icon-button', 'button'))
        .find();

    // This cause the popup HTML to be loaded.
    const firstMenuButton = menuButtons[0] as HTMLButtonElement;
    firstMenuButton.click();
    firstMenuButton.click();

    for (const menuButton of menuButtons) {
        const ytdPlaylistVideoRenderer = menuButton.parentElement.parentElement.parentElement;
        const divMenu = menuButton.parentElement.parentElement;

        const customButton = createRemoveButton(menuButton as HTMLButtonElement);
        ytdPlaylistVideoRenderer.insertBefore(customButton, divMenu);
    }
}

Browser.runtime.onMessage.addListener((message, sender) => {
    console.log('runtime', message);
    if (message === 'on-playlist') {
        if (!globalPageReadyInterval) {
            globalPageReadyInterval = setInterval(() => {
                const firstMenuButton: HTMLElement = HtmlTreeNavigator.navigate(document.body)
                    .filter(new TagNavigationFilter('ytd-app'))
                    .filter(new IdNavigationFilter('div', 'content'))
                    .filter(new IdNavigationFilter('ytd-page-manager', 'page-manager'))
                    .filter(new TagNavigationFilter('ytd-browse'))
                    .filter(new TagNavigationFilter('ytd-two-column-browse-results-renderer'))
                    .filter(new IdNavigationFilter('div', 'primary'))
                    .filter(new TagNavigationFilter('ytd-section-list-renderer'))
                    .filter(new IdNavigationFilter('div', 'contents'))
                    .filter(new TagNavigationFilter('ytd-item-section-renderer'))
                    .filter(new IdNavigationFilter('div', 'contents'))
                    .filter(new TagNavigationFilter('ytd-playlist-video-list-renderer'))
                    .filter(new IdNavigationFilter('div', 'contents'))
                    .filter(new TagNavigationFilter('ytd-playlist-video-renderer'))
                    .filter(new IdNavigationFilter('div', 'menu'))
                    .filter(new TagNavigationFilter('ytd-menu-renderer'))
                    .filter(new IdNavigationFilter('yt-icon-button', 'button'))
                    .findLast();

                if (!!firstMenuButton) {
                    console.log('found', firstMenuButton);
                    clearInterval(globalPageReadyInterval);
                    globalPageReadyInterval = null;

                    main();
                }
            })
        }
    }
})

