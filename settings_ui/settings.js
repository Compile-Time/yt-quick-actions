const enumValue = (name) => Object.freeze({toString: () => name});

const LogMode = Object.freeze({
    NORMAL: enumValue('normal'),
    DEBUG: enumValue('debug')
});

const Theme = Object.freeze({
    LIGHT: enumValue('light'),
    DARK: enumValue('dark')
});

function getFormLogMode() {
    let selectedValue = document.querySelector('input[name="log-mode"]:checked').value;

    switch (selectedValue) {
        case LogMode.NORMAL.toString():
        case LogMode.DEBUG.toString():
            break;

        default:
            console.error(`Selected log mode value does not match enum LogMode: ${selectedValue}`);
            return;
    }

    return selectedValue;
}

function getFormTheme() {
    let selectedValue = document.querySelector('input[name="theme"]:checked').value;

    switch (selectedValue) {
        case Theme.LIGHT.toString():
        case Theme.DARK.toString():
            break;

        default:
            console.error(`Selected theme value does not match enum Theme: ${selectedValue}`);
            return;
    }

    return selectedValue;
}

function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        logMode: getFormLogMode(),
        theme: getFormTheme()
    });
}

function init() {
    const logModePromise = browser.storage.local.get('logMode');
    logModePromise.then(
        storage => {
            if (!!storage.logMode) {
                document.querySelector(`#log-mode-${storage.logMode}`).checked = true
            } else {
                document.querySelector(`#log-mode-${LogMode.NORMAL.toString()}`).checked = true
            }
        },
        error => console.error(`Could not retrieve log mode value from storage: ${error}`)
    );
}

document.addEventListener("DOMContentLoaded", init);
document.querySelector("form").addEventListener("submit", saveOptions);
