import {LogProvider} from "../logging/log-provider";
import {ActiveObserversManager} from "../active-observers-manager";
import {TabMessage} from "../data/tab-message";
import * as Browser from "webextension-polyfill";
import {PageEvent} from "../enums/page-event";
import {runHomePageScriptIfTargetElementExists} from "./pages/home-page";
import {runVideoScriptIfTargetElementExists} from "./pages/video";
import {runPlaylistScriptIfTargetElementExists} from "./pages/playlist";
import {runWatchingPlaylistScriptIfTargetElementExists} from "./pages/watching-playlist";
import {StorageAccessor} from "../storage/storage-accessor";

export const contentLogProvider = new LogProvider();
export const contentScriptObserversManager: ActiveObserversManager = new ActiveObserversManager();

async function processMessage(message: TabMessage): Promise<void> {
    const logLevel = await StorageAccessor.getLogLevel();
    contentLogProvider.setLogLevel(logLevel);

    if (message.disconnectObservers) {
        contentScriptObserversManager.disconnectAll();
    }

    switch (message.pageEvent) {
        case PageEvent.NAVIGATED_TO_HOME_PAGE:
            runHomePageScriptIfTargetElementExists();
            break;

        case PageEvent.NAVIGATED_TO_VIDEO:
            runVideoScriptIfTargetElementExists();
            break;

        case PageEvent.NAVIGATED_TO_PLAYLIST:
            runPlaylistScriptIfTargetElementExists();
            break;

        case PageEvent.NAVIGATED_TO_VIDEO_IN_PLAYLIST:
            runWatchingPlaylistScriptIfTargetElementExists();
            break;

    }
}

Browser.runtime.onMessage.addListener(processMessage);
