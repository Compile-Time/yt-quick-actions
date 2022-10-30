import * as Browser from "webextension-polyfill";
import {Tabs} from "webextension-polyfill";
import {RuntimeMessage} from "../enums/runtime-message";
import {TabMessage} from "../data/tab-message";
import {StorageAccessor} from "../storage/storage-accessor";
import {LogProvider} from "../logging/log-provider";
import Tab = Tabs.Tab;

const backgroundLogProvider = new LogProvider();
const logger = backgroundLogProvider.getUrlChangeWatcherLogger();

function sendMessage(tabId: number, tab: Tab, message: TabMessage): void {
    logger.debug(`Sending following message from tab ${tab.title}`, message);
    Browser.tabs.sendMessage(tabId, message)
        .then()
        .catch(reason => {
            logger.error(`Could not send navigate message in tab ${tab.title}`, reason);
        });
}

async function processYoutubeTabUpdate(tabId, changeInfo, tab): Promise<void> {
    const level = await StorageAccessor.getLogLevel();
    logger.setLevel(level);

    if (!!changeInfo.status && tab.url.includes('watch') && tab.url.includes('list') && tab.status === 'complete') {
        const runtimeMessages = [
            new TabMessage(RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST, true),
            new TabMessage(RuntimeMessage.NAVIGATED_TO_VIDEO, false)
        ];
        runtimeMessages.forEach(message => sendMessage(tabId, tab, message));
    } else if (!!changeInfo.status && tab.url.includes('watch') && tab.status === 'complete') {
        const message = new TabMessage(RuntimeMessage.NAVIGATED_TO_VIDEO, true);
        sendMessage(tabId, tab, message);
    } else if (!!changeInfo.status && tab.url.includes('playlist') && tab.status === 'complete') {
        const message = new TabMessage(RuntimeMessage.NAVIGATED_TO_PLAYLIST, true);
        sendMessage(tabId, tab, message);
    } else if (!!changeInfo.status && tab.url === 'https://www.youtube.com/' && tab.status === 'complete') {
        const message = new TabMessage(RuntimeMessage.NAVIGATED_TO_HOME_PAGE, true);
        sendMessage(tabId, tab, message);
    }
}

Browser.tabs.onUpdated.addListener(processYoutubeTabUpdate, {urls: ['*://*.youtube.com/*']});
