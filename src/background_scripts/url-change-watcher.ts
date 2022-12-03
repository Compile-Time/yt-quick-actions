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

/**
 * Retry a promise for X {@link times} and with X {@link delayMilliseconds}.
 *
 * This function primarily serves as a fix (workaround?) for Firefox. Sometimes when loading YouTube from a new tab
 * the background script reports an error that the receiver does not exist. This method fixes this by
 * retrying the send operation to the receiving end.
 *
 * @param fn - The function to run on each retry cycle
 * @param times - The amount of times a retry should be performed before finally reporting an error
 * @param delayMilliseconds - The amount of milliseconds to wait in each retry cycle
 */
function retry<T>(fn: () => Promise<T>, times: number, delayMilliseconds: number) {
    return new Promise(function (resolve, reject) {
        let finalError: Error;
        const attempt = () => {
            if (times === 0) {
                reject(finalError);
            } else {
                fn().then(resolve)
                    .catch((error) => {
                        times--;
                        finalError = error;
                        setTimeout(() => {
                            attempt()
                        }, delayMilliseconds);
                    });
            }
        };
        attempt();
    });
}

function sendMessage(tabId: number, tab: Tab, message: TabMessage): void {
    logger.debug(`Sending following message from tab "${tab.title}"`, message);
    Browser.tabs.sendMessage(tabId, message)
        .then()
        .catch(() => {
            return retry(() => Browser.tabs.sendMessage(tabId, message), 3, 1000)
        })
        .catch(reason => {
            logger.error(`Could not send navigate message in tab "${tab.title}"`, reason);
        });
}

async function processYoutubeTabUpdate(tabId: number, changeInfo: OnUpdatedChangeInfoType, tab: Tab): Promise<void> {
    const level = await StorageAccessor.getLogLevel();
    logger.setLevel(level);

    if (changeInfo.status) {
        if (tab.url.includes('watch') && tab.url.includes('list') && tab.status === 'complete') {
            const messages = [
                new TabMessage(PageEvent.NAVIGATED_TO_VIDEO_IN_PLAYLIST, true),
                new TabMessage(PageEvent.NAVIGATED_TO_VIDEO, false)
            ];
            messages.forEach(message => sendMessage(tabId, tab, message));
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

Browser.tabs.onUpdated.addListener(processYoutubeTabUpdate);
