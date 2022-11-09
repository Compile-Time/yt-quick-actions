import {LogProvider} from "../logging/log-provider";
import {ActiveObserversManager} from "../active-observers-manager";
import {TabMessage} from "../data/tab-message";
import {StorageAccessor} from "../storage/storage-accessor";
import * as Browser from "webextension-polyfill";
import {RuntimeMessage} from "../enums/runtime-message";
import {runHomePageScriptIfTargetElementExists} from "./home-page-quick-actions";
import {runVideoScriptIfTargetElementExists} from "./video-quick-actions";
import {runPlaylistScriptIfTargetElementExists} from "./playlist-quick-actions";
import {runWatchingPlaylistScriptIfTargetElementExists} from "./watching-playlist-quick-actions";

export const contentLogProvider = new LogProvider();
export const contentScriptObserversManager: ActiveObserversManager = new ActiveObserversManager();

async function processMessage(message: TabMessage): Promise<void> {
    const logLevel = await StorageAccessor.getLogLevel();
    contentLogProvider.setLogLevel(logLevel);

    if (message.disconnectObservers) {
        contentScriptObserversManager.disconnectAll();
    }

    switch (message.runtimeMessage) {
        case RuntimeMessage.NAVIGATED_TO_HOME_PAGE:
            runHomePageScriptIfTargetElementExists(message);
            break;

        case RuntimeMessage.NAVIGATED_TO_VIDEO:
            runVideoScriptIfTargetElementExists(message);
            break;

        case RuntimeMessage.NAVIGATED_TO_PLAYLIST:
            runPlaylistScriptIfTargetElementExists(message);
            break;

        case RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST:
            runWatchingPlaylistScriptIfTargetElementExists(message);
            break;

    }
}

Browser.runtime.onMessage.addListener(processMessage);
