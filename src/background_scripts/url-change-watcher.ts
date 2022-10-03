import * as Browser from "webextension-polyfill";

Browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log(changeInfo);
    if (!!changeInfo.url && tab.url.includes('playlist')) {
        console.log('tab url', tab.url);
        Browser.tabs.sendMessage(tabId, 'on-playlist')
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

Browser.tabs.onReplaced.addListener(activeInfo => {
    console.log('activeInfo', activeInfo);
});
