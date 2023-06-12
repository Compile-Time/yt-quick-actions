import * as Browser from "webextension-polyfill";
import { LogLevel, LogLevelMapper } from "../src/enums/log-level";
import { SettingsData } from "../src/storage/settings-data";
import { LogProvider } from "../src/logging/log-provider";
import { HtmlTreeNavigator } from "../src/html-navigation/html-tree-navigator";
import { IdNavigationFilter, TagNavigationFilter } from "../src/html-navigation/filter/navigation-filter";

const settingsLogProvider = new LogProvider();
const logger = settingsLogProvider.getLogger(LogProvider.SETTINGS_PAGE);

const settingsData = new SettingsData();

function generateLogLevelsForSelect(selectedOption: string): HTMLOptionElement[] {
  return Object.values(LogLevel).map((level) => {
    const option = document.createElement("option");
    option.innerText = level.toUpperCase();
    option.setAttribute("value", level);
    if (selectedOption === level) {
      option.setAttribute("selected", "");
    }
    return option;
  });
}

function updateLogLevel(event: Event) {
  const select = event.target as HTMLSelectElement;
  const level = LogLevelMapper.fromStr(select.options[select.selectedIndex].value);
  logger.setLevel(level);
  settingsData.logLevel = level;
}

function initLogLevel(): void {
  Browser.storage.local.get(SettingsData.LOG_LEVEL_ATTR).then(
    (storage) => {
      const select = document.querySelector("#log-level") as HTMLSelectElement;
      let logLevel: LogLevel;
      if (storage.logLevel) {
        logLevel = LogLevelMapper.fromStr(storage.logLevel);
      } else {
        logLevel = LogLevel.WARN;
      }
      generateLogLevelsForSelect(logLevel).forEach((option) => select.append(option));
    },
    (error) => logger.error(`Could not retrieve log level from storage API: ${error}`)
  );
}

function saveOptions(event: Event): void {
  event.preventDefault();
  Browser.storage.local.set(settingsData);
}

function registerEventListeners(): void {
  HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new IdNavigationFilter("select", "log-level"))
    .consume()
    .addEventListener("change", updateLogLevel);
  HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter("form"))
    .consume()
    .addEventListener("submit", saveOptions);
}

function init(): void {
  registerEventListeners();
  initLogLevel();
}

document.addEventListener("DOMContentLoaded", init);
