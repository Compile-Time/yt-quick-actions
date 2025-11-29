import { BehaviorSubject } from 'rxjs';
import { featuresStorage, searchStringStorage, SettingFeatures, SettingSearchStrings } from '@/utils/storage';
import { getLogger, LoggerKind } from '@/entrypoints/content/state/logger';

const logger = getLogger(LoggerKind.SETTINGS_STATE);

function isScriptDisabled(features: Record<string, boolean>): boolean {
  return features ? Object.values(features).every((feature) => feature) : false;
}

export const homeScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const watchingPlaylistScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const playlistScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const videoScriptDisabled$ = new BehaviorSubject<boolean>(false);

function pushScriptsDisabledStatus(features: SettingFeatures<boolean>) {
  homeScriptDisabled$.next(isScriptDisabled(features.homePage));
  watchingPlaylistScriptDisabled$.next(isScriptDisabled(features.watchPlaylist));
  playlistScriptDisabled$.next(isScriptDisabled(features.playlist));
  videoScriptDisabled$.next(isScriptDisabled(features.watchVideo));
}

export const featuresStorageUnwatch = featuresStorage.watch((features) => {
  pushScriptsDisabledStatus(features);
});
featuresStorage.getValue().then((features) => {
  pushScriptsDisabledStatus(features);
});

export const homeSearchStrings$ = new BehaviorSubject<SettingSearchStrings['homePage']>(
  searchStringStorage.fallback.homePage,
);
export const playlistSearchStrings$ = new BehaviorSubject<SettingSearchStrings['playlist']>(
  searchStringStorage.fallback.playlist,
);
export const watchVideoSearchStrings$ = new BehaviorSubject<SettingSearchStrings['watchVideo']>(
  searchStringStorage.fallback.watchVideo,
);
export const watchPlaylistSearchStrings$ = new BehaviorSubject<SettingSearchStrings['watchPlaylist']>(
  searchStringStorage.fallback.watchPlaylist,
);

function pushSearchStrings(searchStrings: SettingSearchStrings) {
  logger.debug('Search strings settings changed: ', searchStrings);
  homeSearchStrings$.next(searchStrings.homePage);
  playlistSearchStrings$.next(searchStrings.playlist);
  watchVideoSearchStrings$.next(searchStrings.watchVideo);
  watchPlaylistSearchStrings$.next(searchStrings.watchPlaylist);
}

export const searchStringStorageUnwatch = searchStringStorage.watch((settingSearchStrings) => {
  pushSearchStrings(settingSearchStrings);
});
searchStringStorage.getValue().then((settingSearchStrings) => {
  pushSearchStrings(settingSearchStrings);
});
