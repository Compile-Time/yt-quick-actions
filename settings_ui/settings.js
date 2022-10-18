const enumValue = (name) => Object.freeze({toString: () => name});

const LogMode = Object.freeze({
    NORMAL: enumValue("normal"),
    DEBUG: enumValue("debug"),
});

function saveOptions(e) {
    e.preventDefault();
    let selectedValue = document.querySelector('input[name="log-mode"]:checked').value;

    switch (selectedValue) {
        case LogMode.NORMAL.toString():
        case LogMode.DEBUG.toString():
            break;

        default:
            console.error(`Selected log mode value does not match enum LogMode: ${selectedValue}`);
            return;
    }

    browser.storage.local.set({
        logMode: selectedValue
    });
}

function init() {
    const logModePromise = browser.storage.local.get('logMode');
    logModePromise.then(
        storage => {
            if (!!storage.logMode) {
                document.querySelector(`#${storage.logMode}`).checked = true
            } else {
                document.querySelector(`#${LogMode.NORMAL.toString()}`).checked = true
            }
        },
        error => console.error(`Could not retrieve log mode value from storage: ${error}`)
    );
}

document.addEventListener("DOMContentLoaded", init);
document.querySelector("form").addEventListener("submit", saveOptions);
