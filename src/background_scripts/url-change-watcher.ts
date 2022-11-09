import * as Browser from "webextension-polyfill";
import {Tabs} from "webextension-polyfill";
import {PageEvent} from "../enums/page-event";
import {TabMessage} from "../data/tab-message";
import {StorageAccessor} from "../storage/storage-accessor";
import {LogProvider} from "../logging/log-provider";
import Tab = Tabs.Tab;
import OnUpdatedChangeInfoType = Tabs.OnUpdatedChangeInfoType;

const backgroundLogProvider = new LogProvider();
const logger = backgroundLogProvider.getLogger(LogProvider.URL_CHANGE_WATCHER);

function sendMessage(tabId: number, tab: Tab, message: TabMessage): void {
    logger.debug(`Sending following message from tab ${tab.title}`, message);
    Browser.tabs.sendMessage(tabId, message)
        .then()
        .catch(reason => {
            logger.error(`Could not send navigate message in tab ${tab.title}`, reason);
        });
}

async function processYoutubeTabUpdate(tabId: number, changeInfo: OnUpdatedChangeInfoType, tab: Tab): Promise<void> {
    const level = await StorageAccessor.getLogLevel();
    logger.setLevel(level);

    if (changeInfo.status) {
        if (tab.url.includes('watch') && tab.url.includes('list') && tab.status === 'complete') {
            const runtimeMessages = [
                new TabMessage(PageEvent.NAVIGATED_TO_VIDEO_IN_PLAYLIST, true),
                new TabMessage(PageEvent.NAVIGATED_TO_VIDEO, false)
            ];
            runtimeMessages.forEach(message => sendMessage(tabId, tab, message));
        } else if (tab.url.includes('watch') && tab.status === 'complete') {
            const message = new TabMessage(PageEvent.NAVIGATED_TO_VIDEO, true);
            sendMessage(tabId, tab, message);
        } else if (tab.url.includes('playlist') && tab.status === 'complete') {
            const message = new TabMessage(PageEvent.NAVIGATED_TO_PLAYLIST, true);
            sendMessage(tabId, tab, message);
        } else if (tab.url === 'https://www.youtube.com/' && tab.status === 'complete') {
            const message = new TabMessage(PageEvent.NAVIGATED_TO_HOME_PAGE, true);
            sendMessage(tabId, tab, message);
        }
    }

}

Browser.tabs.onUpdated.addListener(processYoutubeTabUpdate, {urls: ['*://*.youtube.com/*']});
