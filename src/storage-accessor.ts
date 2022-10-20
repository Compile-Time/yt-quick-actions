import * as Browser from "webextension-polyfill";

export class StorageAccessor {
    static getLogMode(): Promise<string> {
        return Browser.storage.local.get('logMode')
            .then(storage => storage.logMode);
    }

    static getTheme(): Promise<string | undefined> {
        return Browser.storage.local.get('theme')
            .then(storage => {
                if (!storage.theme) {
                    return undefined;
                }
                return storage.theme;
            });
    }
}