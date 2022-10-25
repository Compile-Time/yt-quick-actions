import * as Browser from "webextension-polyfill";
import {Tabs} from "webextension-polyfill";
import {RuntimeMessage} from "../enums/runtime-message";
import {LogHelper} from "../log-helper";
import {TabMessage} from "../data/tab-message";
import Tab = Tabs.Tab;

function sendMessage(tabId: number, tab: Tab, message: TabMessage): void {
    Browser.tabs.sendMessage(tabId, message)
        .then()
        .catch(reason => {
            LogHelper.error(`Could not send navigate message in tab ${tab.title}`, reason);
        });
}

Browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!!changeInfo.status && tab.url.includes('watch') && tab.url.includes('list') && tab.status === 'complete') {
        const runtimeMessages = [
            new TabMessage(RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST, true),
            new TabMessage(RuntimeMessage.NAVIGATED_TO_VIDEO, false)
        ];
        runtimeMessages.forEach(message => sendMessage(tabId, tab, message));
    }
    if (!!changeInfo.status && tab.url.includes('watch') && tab.status === 'complete') {
        const message = new TabMessage(RuntimeMessage.NAVIGATED_TO_VIDEO, true);
        sendMessage(tabId, tab, message);
    }
    if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        const message = new TabMessage(RuntimeMessage.NAVIGATED_TO_PLAYLIST, true);
        sendMessage(tabId, tab, message);
    }
    if (!!changeInfo.status && tab.url === 'https://www.youtube.com/' && tab.status === 'complete') {
        const message = new TabMessage(RuntimeMessage.NAVIGATED_TO_HOME_PAGE, true);
        sendMessage(tabId, tab, message);
    }
}, {
    urls: ['*://*.youtube.com/*']
})
