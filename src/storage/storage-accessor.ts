import * as Browser from "webextension-polyfill";
import {LogLevel, LogLevelMapper} from "../enums/log-level";
import {SettingsData} from "./settings-data";

export class StorageAccessor {
    static getLogLevel(): Promise<LogLevel> {
        return Browser.storage.local.get(SettingsData.LOG_LEVEL_ATTR)
            .then((storage: Record<string, any>) => LogLevelMapper.fromStrOrDefault(storage.logLevel));
    }
}