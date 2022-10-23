import * as Browser from "webextension-polyfill";
import {LogMode, LogModeMapper} from "./enums/log-mode";

export class StorageAccessor {
    static getLogMode(): Promise<LogMode> {
        return Browser.storage.local.get('logMode')
            .then(storage => LogModeMapper.fromStr(storage.logMode));
    }

    static getTheme(): Promise<string | null> {
        return Browser.storage.local.get('theme')
            .then(storage => {
                if (!storage.theme) {
                    return null;
                }
                return storage.theme;
            });
    }
}