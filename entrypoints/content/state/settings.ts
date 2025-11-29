import { BehaviorSubject } from 'rxjs';
import {
  SETTING_FEATURES,
  SETTING_SEARCH_STRINGS,
  SettingFeatures,
  SettingSearchStrings,
} from '@/utils/storage/settings-data';
import { getLogger, LoggerKind } from '@/entrypoints/content/state/logger';

const logger = getLogger(LoggerKind.SETTINGS_STATE);

function isScriptDisabled(features: Record<string, boolean> | undefined): boolean {
  return features ? Object.values(features).every((feature) => feature) : false;
}

export const homeScriptDisabled$ = new BehaviorSubject<boolean>(false);
storage.watch<SettingFeatures<boolean>>(SETTING_FEATURES, (features) => {
  homeScriptDisabled$.next(isScriptDisabled(features?.homePage));
});
storage.getItem<SettingFeatures<boolean>>(SETTING_FEATURES).then((features) => {
  homeScriptDisabled$.next(isScriptDisabled(features?.homePage));
});

export const watchingPlaylistScriptDisabled$ = new BehaviorSubject<boolean>(false);
storage.watch<SettingFeatures<boolean>>(SETTING_FEATURES, (features) => {
  watchingPlaylistScriptDisabled$.next(isScriptDisabled(features?.watchPlaylist));
});
storage.getItem<SettingFeatures<boolean>>(SETTING_FEATURES).then((features) => {
  watchingPlaylistScriptDisabled$.next(isScriptDisabled(features?.watchPlaylist));
});

export const playlistScriptDisabled$ = new BehaviorSubject<boolean>(false);
storage.watch<SettingFeatures<boolean>>(SETTING_FEATURES, (features) => {
  playlistScriptDisabled$.next(isScriptDisabled(features?.playlist));
});
storage.getItem<SettingFeatures<boolean>>(SETTING_FEATURES).then((features) => {
  playlistScriptDisabled$.next(isScriptDisabled(features?.playlist));
});

export const videoScriptDisabled$ = new BehaviorSubject<boolean>(false);
storage.watch<SettingFeatures<boolean>>(SETTING_FEATURES, (features) => {
  videoScriptDisabled$.next(isScriptDisabled(features?.watchVideo));
});
storage.getItem<SettingFeatures<boolean>>(SETTING_FEATURES).then((features) => {
  videoScriptDisabled$.next(isScriptDisabled(features?.watchVideo));
});

export const homeSearchStrings$ = new BehaviorSubject<SettingSearchStrings['homePage']>({
  watchLaterEntry: undefined,
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Setting search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.homePage) {
    homeSearchStrings$.next(settingSearchStrings.homePage);
  }
});
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Loaded setting search strings: ', settingSearchStrings);
  if (settingSearchStrings?.homePage) {
    homeSearchStrings$.next(settingSearchStrings.homePage);
  }
});

export const playlistSearchStrings$ = new BehaviorSubject<SettingSearchStrings['playlist']>({
  removeEntry: undefined,
  moveToTopEntry: undefined,
  moveToBottomEntry: undefined,
});
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Setting search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.playlist) {
    playlistSearchStrings$.next(settingSearchStrings.playlist);
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded setting search strings: ', settingSearchStrings);
  if (settingSearchStrings?.playlist) {
    playlistSearchStrings$.next(settingSearchStrings.playlist);
  }
});

export const watchVideoSearchStrings$ = new BehaviorSubject<SettingSearchStrings['watchVideo']>({
  watchLaterEntry: undefined,
  videoSaveButton: undefined,
});
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Watch video search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.watchVideo) {
    watchVideoSearchStrings$.next(settingSearchStrings.watchVideo);
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded watch video search strings: ', settingSearchStrings);
  if (settingSearchStrings?.watchVideo) {
    watchVideoSearchStrings$.next(settingSearchStrings.watchVideo);
  }
});

export const watchPlaylistSearchStrings$ = new BehaviorSubject<SettingSearchStrings['watchPlaylist']>({
  watchLaterEntry: undefined,
  removeEntry: undefined,
  videoSaveButton: undefined,
});
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Watch playlist search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.watchPlaylist) {
    watchPlaylistSearchStrings$.next(settingSearchStrings.watchPlaylist);
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded watch playlist search strings: ', settingSearchStrings);
  if (settingSearchStrings?.watchPlaylist) {
    watchPlaylistSearchStrings$.next(settingSearchStrings.watchPlaylist);
  }
});
