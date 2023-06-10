import * as Browser from "webextension-polyfill";
import { Tabs } from "webextension-polyfill";
import { PageEvent } from "../enums/page-event";
import { TabMessage } from "../messaging/tab-message";
import { StorageAccessor } from "../storage/storage-accessor";
import { LogProvider } from "../logging/log-provider";
import { PromiseUtil } from "../util/promise-util";
import Tab = Tabs.Tab;
import OnUpdatedChangeInfoType = Tabs.OnUpdatedChangeInfoType;

const backgroundLogProvider = new LogProvider();
const logger = backgroundLogProvider.getLogger(LogProvider.URL_CHANGE_WATCHER);

/**
 * Send a tab URL change to a content script.
 *
 * Sometimes when loading YouTube from a new tab the background script reports an error that the receiver does not
 * exist. This is possible because the background script is initialized on browser start while the content script
 * only on matching URLs. Therefore, the background script could send a message before any handlers exist in the
 * content script.
 *
 * FIXME: Use a connection instead of a one-off message.
 *
 * @param tabId - The tab to which the message should be sent
 * @param tab - The current tab
 * @param message - The message to send to a receiving content script
 */
function sendMessage(tabId: number, tab: Tab, message: TabMessage): void {
  logger.debug(`Sending following message from tab "${tab.title}"`, message);
  Browser.tabs
    .sendMessage(tabId, message)
    .then()
    .catch(() => {
      return PromiseUtil.retry(
        () => Browser.tabs.sendMessage(tabId, message),
        3,
        1000
      );
    })
    .catch((reason) => {
      logger.error(
        `Could not send navigate message in tab "${tab.title}"`,
        reason
      );
    });
}

async function processYoutubeTabUpdate(
  tabId: number,
  changeInfo: OnUpdatedChangeInfoType,
  tab: Tab
): Promise<void> {
  const level = await StorageAccessor.getLogLevel();
  logger.setLevel(level);

  if (changeInfo.status) {
    if (
      tab.url.includes("watch") &&
      tab.url.includes("list") &&
      tab.status === "complete"
    ) {
      const messages = [
        new TabMessage(PageEvent.NAVIGATED_TO_VIDEO_IN_PLAYLIST, true),
        new TabMessage(PageEvent.NAVIGATED_TO_VIDEO, false),
      ];
      messages.forEach((message) => sendMessage(tabId, tab, message));
    } else if (tab.url.includes("watch") && tab.status === "complete") {
      const message = new TabMessage(PageEvent.NAVIGATED_TO_VIDEO, true);
      sendMessage(tabId, tab, message);
    } else if (tab.url.includes("playlist") && tab.status === "complete") {
      const message = new TabMessage(PageEvent.NAVIGATED_TO_PLAYLIST, true);
      sendMessage(tabId, tab, message);
    } else if (
      tab.url === "https://www.youtube.com/" &&
      tab.status === "complete"
    ) {
      const message = new TabMessage(PageEvent.NAVIGATED_TO_HOME_PAGE, true);
      sendMessage(tabId, tab, message);
    }
  }
}

Browser.tabs.onUpdated.addListener(processYoutubeTabUpdate);
