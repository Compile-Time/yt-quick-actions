import * as Browser from "webextension-polyfill";
import {LogMode} from "../src/enums/log-mode";
import {Theme} from "../src/enums/theme";

function getFormLogMode(): string {
    let selectedValue = document.querySelector('input[name="log-mode"]:checked')
        .getAttribute('value');

    switch (selectedValue) {
        case LogMode.DEFAULT:
        case LogMode.DEBUG:
            break;

        default:
            console.error(`Selected log mode value does not match enum LogMode: ${selectedValue}`);
            return;
    }

    return selectedValue;
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
            console.error(`Selected theme value does not match enum Theme: ${selectedValue}`);
            return;
    }

    return selectedValue;
}

function initLogMode(): void {
    Browser.storage.local.get('logMode')
        .then(
            storage => {
                if (!!storage.logMode) {
                    document.querySelector(`#log-mode-${storage.logMode}`)
                        .setAttribute('checked', 'true');
                } else {
                    document.querySelector(`#log-mode-${LogMode.DEFAULT}`)
                        .setAttribute('checked', 'true');
                }
            },
            error => console.error(`Could not retrieve log mode value from storage: ${error}`)
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
            error => console.error(`Could not retrieve theme value from storage: ${error}`)
        )
}

function saveOptions(e): void {
    e.preventDefault();
    Browser.storage.local.set({
        logMode: getFormLogMode(),
        theme: getFormTheme()
    });
}

function init(): void {
    initLogMode();
    initTheme();
}

document.addEventListener('DOMContentLoaded', init);
document.querySelector('form').addEventListener('submit', saveOptions);
