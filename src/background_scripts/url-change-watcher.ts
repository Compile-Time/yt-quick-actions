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
    if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_PLAYLIST);
    } else if (!!changeInfo.status && tab.url.includes('watch') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_VIDEO);
    } else if (!!changeInfo.status && tab.url.includes('youtube.com') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_HOME_PAGE);
    }

}, {
    urls: ['*://*.youtube.com/*']
})
