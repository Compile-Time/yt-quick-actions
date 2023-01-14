import {TabMessage} from "../messaging/tab-message";
import * as Browser from "webextension-polyfill";
import {StorageAccessor} from "../storage/storage-accessor";
import {PageEvent} from "../enums/page-event";
import {runPlaylistScriptIfTargetElementExists} from "./pages/playlist";
import {contentLogProvider, contentScriptObserversManager} from "./init-globals";
import {runHomePageScriptIfTargetElementExists} from "./pages/home-page";
import {runVideoScriptIfTargetElementExists} from "./pages/video";
import {runWatchingPlaylistScriptIfTargetElementExists} from "./pages/watching-playlist";

async function processMessage(message: TabMessage): Promise<void> {
    const logLevel = await StorageAccessor.getLogLevel();
    contentLogProvider.setContentScriptLoggersLevel(logLevel);

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
