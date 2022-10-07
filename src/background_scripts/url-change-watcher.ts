import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../runtime-messages";

Browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        Browser.tabs.sendMessage(tabId, RuntimeMessages.NAVIGATED_TO_PLAYLIST)
            .then()
            .catch(reason => {
                console.error(`Could not send navigate message in tab ${tab.title}`, reason);
            });
    }

    if (!!changeInfo.status && tab.url.includes('watch') && tab.status === 'complete') {
        Browser.tabs.sendMessage(tabId, RuntimeMessages.NAVIGATED_TO_VIDEO)
            .then()
            .catch(reason => {
                console.error(`Could not send navigate message in tab ${tab.title}`, reason);
            });
    }
}, {
    urls: ['*://*.youtube.com/*']
})
