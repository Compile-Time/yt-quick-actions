import * as logLevel from "loglevel";
import {Logger} from "loglevel";
import * as prefix from "loglevel-plugin-prefix";
import {LogLevel} from "../enums/log-level";

export class LogProvider {
    private static HOME_PAGE_LOGGER = 'home-page-quick-actions';
    private static PLAYLIST_LOGGER = 'playlist-quick-actions';
    private static VIDEO_LOGGER = 'video-quick-actions';
    private static WATCHING_PLAYLIST_LOGGER = 'watching-playlist-quick-actions';
    private static SETTINGS_PAGE_LOGGER = 'settings';
    private static URL_CHANGE_WATCHER_LOGGER = 'url-change-watcher';

    constructor() {
        prefix.reg(logLevel);
        prefix.apply(logLevel, {
            template: '[%t] [%l] [%n] -',
            levelFormatter: function (level) {
                return level.toUpperCase();
            },
            nameFormatter: function (name) {
                return 'yt-quick-actions:' + name || 'root';
            },
            timestampFormatter: function (date) {
                return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
            },
            format: undefined
        });
        logLevel.setDefaultLevel(LogLevel.WARN);
    }

    setLogLevel(level: LogLevel): void {
        logLevel.setLevel(level);
    }

    getHomePageLogger(): Logger {
        return logLevel.getLogger(LogProvider.HOME_PAGE_LOGGER);
    }

    getPlaylistQuickActionsLogger(): Logger {
        return logLevel.getLogger(LogProvider.PLAYLIST_LOGGER);
    }

    getVideoQuickActionsLogger(): Logger {
        return logLevel.getLogger(LogProvider.VIDEO_LOGGER);
    }

    getWatchingPlaylistLogger(): Logger {
        return logLevel.getLogger(LogProvider.WATCHING_PLAYLIST_LOGGER);
    }

    getSettingsPageLogger(): Logger {
        return logLevel.getLogger(LogProvider.SETTINGS_PAGE_LOGGER);
    }

    getUrlChangeWatcherLogger(): Logger {
        return logLevel.getLogger(LogProvider.URL_CHANGE_WATCHER_LOGGER);
    }
}