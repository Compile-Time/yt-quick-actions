import * as logLevel from "loglevel";
import {Logger} from "loglevel";
import * as prefix from "loglevel-plugin-prefix";
import {LogLevel} from "../enums/log-level";

export class LogProvider {
    public static readonly HOME_PAGE = 'home-page:cs';
    public static readonly PLAYLIST = 'playlist:cs';
    public static readonly VIDEO = 'video:cs';
    public static readonly WATCHING_PLAYLIST = 'watching-playlist:cs';
    public static readonly SETTINGS_PAGE = 'settings:page';
    public static readonly URL_CHANGE_WATCHER = 'url-change-watcher:bs';

    constructor() {
        prefix.reg(logLevel);
        prefix.apply(logLevel, {
            template: '[%t] [%l] [%n] -',
            levelFormatter: function (level) {
                return level.toUpperCase();
            },
            nameFormatter: function (name) {
                return 'yt-qa:' + name || 'root';
            },
            timestampFormatter: function (date) {
                return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
            },
            format: undefined
        });
        logLevel.setDefaultLevel(LogLevel.WARN);
    }

    setContentScriptLoggersLevel(level: LogLevel): void {
        logLevel.setLevel(level);
        const loggers: { [name: string]: Logger } = logLevel.getLoggers();
        Object.keys(loggers)
            .filter(key => key.includes(':cs'))
            .forEach(key => {
                loggers[key].setLevel(level);
            });
    }

    getLogger(module: string): Logger {
        return logLevel.getLogger(module);
    }
}