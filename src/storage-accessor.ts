import * as Browser from "webextension-polyfill";

export class StorageAccessor {
    static getLogMode(): Promise<string> {
        return Browser.storage.local.get('logMode')
            .then(storage => storage.logMode);
    }
}