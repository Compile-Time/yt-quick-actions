import { BehaviorSubject } from 'rxjs';
import { featuresStorage, searchStringStorage, SettingFeatures, SettingSearchStrings } from '@/utils/storage';
import { getLogger, LoggerKind } from '@/entrypoints/content/state/logger';

const logger = getLogger(LoggerKind.SETTINGS_STATE);

function isScriptDisabled(features: Record<string, boolean>): boolean {
  return features ? Object.values(features).every((feature) => feature) : false;
}

// Flags for script disabled states
export const homeScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const subscriptionScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const watchingPlaylistScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const playlistScriptDisabled$ = new BehaviorSubject<boolean>(false);
export const videoScriptDisabled$ = new BehaviorSubject<boolean>(false);

// Flags for watch later disabled states
export const homeWatchLaterDisabled$ = new BehaviorSubject<boolean>(false);
export const videoWatchLaterDisabled$ = new BehaviorSubject<boolean>(false);
export const subscriptionWatchLaterDisabled$ = new BehaviorSubject<boolean>(false);
export const watchPlaylistWatchLaterDisabled$ = new BehaviorSubject<boolean>(false);
// Flags for move top/bottom disabled states
export const playlistMoveTopBottomDisabled$ = new BehaviorSubject<boolean>(false);
// Flags for remove disabled states
export const playlistRemoveDisabled$ = new BehaviorSubject<boolean>(false);
export const watchPlaylistRemoveDisabled$ = new BehaviorSubject<boolean>(false);
// Flags for scroll top/bottom disabled states
export const playlistScrollTopBottomDisabled$ = new BehaviorSubject<boolean>(false);
export const watchPlaylistScrollTopBottomDisabled$ = new BehaviorSubject<boolean>(false);

function pushScriptsDisabledStatus(features: SettingFeatures<boolean>) {
  homeScriptDisabled$.next(isScriptDisabled(features.homePage));
  homeWatchLaterDisabled$.next(features.homePage.disableWatchLater);

  subscriptionScriptDisabled$.next(isScriptDisabled(features.subscriptionsPage));
  subscriptionWatchLaterDisabled$.next(features.subscriptionsPage.disableWatchLater);

  watchingPlaylistScriptDisabled$.next(isScriptDisabled(features.watchPlaylist));
  watchPlaylistRemoveDisabled$.next(features.watchPlaylist.disableRemove);
  watchPlaylistWatchLaterDisabled$.next(features.watchPlaylist.disableWatchLater);
  watchPlaylistScrollTopBottomDisabled$.next(features.watchPlaylist.disableScrollTopBottom);

  playlistScriptDisabled$.next(isScriptDisabled(features.playlist));
  playlistMoveTopBottomDisabled$.next(features.playlist.disableMoveTopBottom);
  playlistRemoveDisabled$.next(features.playlist.disableRemove);
  playlistScrollTopBottomDisabled$.next(features.playlist.disableScrollTopBottom);

  videoScriptDisabled$.next(isScriptDisabled(features.watchVideo));
  videoWatchLaterDisabled$.next(features.watchVideo.disableWatchLater);
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
