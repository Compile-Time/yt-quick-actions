import * as Browser from "webextension-polyfill";
import {LogLevel, LogLevelMapper} from "../src/enums/log-level";
import {SettingsData} from "../src/storage/settings-data";
import {LogProvider} from "../src/logging/log-provider";

const settingsLogProvider = new LogProvider();
const logger = settingsLogProvider.getSettingsPageLogger();

const settingsData = new SettingsData();

function updateLogLevel(event: Event) {
    const select = event.target as HTMLSelectElement;
    settingsData.logLevel = LogLevelMapper.fromStr(select.options[select.selectedIndex].value);
}

function initLogLevel(): void {
    Browser.storage.local.get(SettingsData.LOG_LEVEL_ATTR)
        .then(
            storage => {
                logger.log(storage);
                const select = document.querySelector('#log-level') as HTMLSelectElement;
                if (!!storage.logLevel) {
                    const logLevel = LogLevelMapper.fromStr(storage.logLevel);
                    select.selectedIndex = LogLevelMapper.toNumber(logLevel);
                } else {
                    select.selectedIndex = LogLevelMapper.toNumber(LogLevel.WARN);
                }
            },
            error => logger.error(`Could not retrieve log level from storage API: ${error}`)
        );
}

function saveOptions(e): void {
    e.preventDefault();
    Browser.storage.local.set(settingsData);
}

function init(): void {
    initLogLevel();
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('#log-level')
    .addEventListener('change', updateLogLevel);
document.querySelector('form').addEventListener('submit', saveOptions);