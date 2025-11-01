import * as Browser from 'webextension-polyfill';
import { logLevelFromStrOrDefault } from '../enums/log-level';
import { SETTING_LOG_LEVELS } from './settings-data';

export function getLogLevelFromStorage() {
  return Browser.storage.local
    .get(SETTING_LOG_LEVELS)
    .then((storage: Record<string, string>) => logLevelFromStrOrDefault(storage.logLevel));
}
