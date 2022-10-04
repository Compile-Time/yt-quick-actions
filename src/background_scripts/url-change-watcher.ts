import * as Browser from "webextension-polyfill";
import {RuntimeMessages} from "../messaging/runtime-messages";

Browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo);
    console.log(tab);
    if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        console.log('tab url', tab.url);
        Browser.tabs.sendMessage(tabId, RuntimeMessages.NAVIGATED_TO_PLAYLIST)
            .then(value => {
                    console.log('Promise value', value);
                },
                reason => {
                    console.error('Promise rejected', reason);
                }).catch(reason => {
            console.error('Promise error catched', reason);
        });
    }
}, {
    urls: ['*://*.youtube.com/*']
})
