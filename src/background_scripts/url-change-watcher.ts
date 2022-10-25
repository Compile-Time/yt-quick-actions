import * as Browser from "webextension-polyfill";
import {Tabs} from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";
import {LogHelper} from "../log-helper";
import Tab = Tabs.Tab;

function sendMessage(tabId: number, tab: Tab, message: string): void {
    Browser.tabs.sendMessage(tabId, message)
        .then()
        .catch(reason => {
            LogHelper.errorWithData(`Could not send navigate message in tab ${tab.title}`, reason);
        });
}

Browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!!changeInfo.status && tab.url.includes('watch') && tab.url.includes('list') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_VIDEO_IN_PLAYLIST);
    }
    if (!!changeInfo.status && tab.url.includes('watch') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_VIDEO);
    }
    if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_PLAYLIST)
    }
    if (!!changeInfo.status && tab.url === 'https://www.youtube.com/' && tab.status === 'complete') {
        sendMessage(tabId, tab, RuntimeMessages.NAVIGATED_TO_HOME_PAGE);
    }
}, {
    urls: ['*://*.youtube.com/*']
})
