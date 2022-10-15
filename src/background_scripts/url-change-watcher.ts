import * as Browser from "webextension-polyfill";
import {Tabs} from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import Tab = Tabs.Tab;

function sendMessage(tabId: number, tab: Tab, message: string): void {
    Browser.tabs.sendMessage(tabId, message)
        .then()
        .catch(reason => {
            console.error(`Could not send navigate message in tab ${tab.title}`, reason);
        });
}

Browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // FIXME: When watching playlists the watch later button does not appear below the video due to this
    //  else if construct. To fix this the single else if construct needs to be replaced with multiple
    //  simple if statements.
    if (!!changeInfo.status && tab.url.includes('watch') && tab.url.includes('list') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_VIDEO_IN_PLAYLIST);
    } else if (!!changeInfo.status && tab.url.includes('watch') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_VIDEO);
    } else if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_PLAYLIST)
    } else if (!!changeInfo.status && tab.url.includes('youtube.com') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_HOME_PAGE);
    }

}, {
    urls: ['*://*.youtube.com/*']
})
