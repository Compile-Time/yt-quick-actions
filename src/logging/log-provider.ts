import * as logLevel from "loglevel";
import {Logger} from "loglevel";
import * as prefix from "loglevel-plugin-prefix";
import {LogLevel} from "../enums/log-level";

export class LogProvider {
    public static HOME_PAGE = 'home-page';
    public static PLAYLIST = 'playlist';
    public static VIDEO = 'video';
    public static WATCHING_PLAYLIST = 'watching-playlist';
    public static SETTINGS_PAGE = 'settings';
    public static URL_CHANGE_WATCHER = 'url-change-watcher';

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

    getLogger(module: string): Logger {
        return logLevel.getLogger(module);
    }
}