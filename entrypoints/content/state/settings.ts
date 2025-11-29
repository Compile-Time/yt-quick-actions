import { BehaviorSubject } from 'rxjs';
import { SETTING_FEATURES, SettingFeatures } from '@/utils/storage/settings-data';

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
