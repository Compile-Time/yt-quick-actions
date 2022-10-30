import * as Browser from "webextension-polyfill";
import {LogLevel, LogLevelMapper} from "../src/enums/log-level";
import {Theme} from "../src/enums/theme";
import {SettingsData} from "../src/storage/settings-data";
import {LogProvider} from "../src/logging/log-provider";

const settingsLogProvider = new LogProvider();
const logger = settingsLogProvider.getSettingsPageLogger();

const settingsData = new SettingsData();

function updateLogLevel(event: Event) {
    const select = event.target as HTMLSelectElement;
    settingsData.logLevel = LogLevelMapper.fromStr(select.options[select.selectedIndex].value);

}

function getFormTheme(): string {
    let selectedValue = document.querySelector('input[name="theme"]:checked')
        .getAttribute('value');

    switch (selectedValue) {
        case Theme.SYSTEM:
        case Theme.LIGHT:
        case Theme.DARK:
            break;

        default:
            logger.error(`Selected theme value does not match enum Theme: ${selectedValue}`);
            return;
    }

    return selectedValue;
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

function initTheme(): void {
    Browser.storage.local.get('theme')
        .then(
            storage => {
                if (!!storage.theme) {
                    document.querySelector(`#theme-${storage.theme}`)
                        .setAttribute('checked', 'true');
                } else {
                    document.querySelector('#theme-system')
                        .setAttribute('checked', 'true');
                }
            },
            error => logger.error(`Could not retrieve theme value from storage API: ${error}`)
        )
}

function onThemeChange(event: Event): void {
    const target = (event.target as HTMLElement);
    const theme = target.getAttribute('value');
    switch (theme) {
        case Theme.SYSTEM:
            document.documentElement.removeAttribute('data-theme');
            break;

        case Theme.LIGHT:
            document.documentElement.setAttribute('data-theme', 'light');
            break;

        case Theme.DARK:
            document.documentElement.setAttribute('data-theme', 'dark');
            break;
    }
}

function saveOptions(e): void {
    e.preventDefault();
    Browser.storage.local.set(settingsData);
}

function init(): void {
    initLogLevel();
    initTheme();
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('#log-level')
    .addEventListener('change', updateLogLevel);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelectorAll('[name="theme"]')
    .forEach(element => element.addEventListener('change', onThemeChange))