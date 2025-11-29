import { LogLevel } from '../enums/log-level';

export const SETTING_LOG_LEVELS = 'local:log-levels';
export const SETTING_SEARCH_STRINGS = 'local:search-strings';
export const SETTING_FEATURES = 'local:features';

export interface SettingFeatures<T> {
  homePage: {
    disableWatchLater: T;
  };
  watchVideo: {
    disableWatchLater: T;
  };
  watchPlaylist: {
    disableRemove: T;
    disableWatchLater: T;
    disableScrollToTop: T;
    disableScrollToBottom: T;
  };
  playlist: {
    disableRemove: T;
    disableMoveToTop: T;
    disableMoveToBottom: T;
    disableScrollToTop: T;
    disableScrollToBottom: T;
  };
}
export type TemplateFeatures = SettingFeatures<string>;
export type SettingFeaturesValues = SettingFeatures<boolean>['homePage'] &
  SettingFeatures<boolean>['watchVideo'] &
  SettingFeatures<boolean>['watchPlaylist'] &
  SettingFeatures<boolean>['playlist'];

export interface SettingLogLevels {
  homePage: LogLevel;
  watchVideo: LogLevel;
  watchPlaylist: LogLevel;
  playlist: LogLevel;
}

interface SettingSearchStringsBase<T> {
  homePage: {
    watchLaterEntry: T;
  };
  watchVideo: {
    watchLaterEntry: T;
    videoSaveButton: T;
  };
  watchPlaylist: {
    removeEntry: T;
    watchLaterEntry: T;
    videoSaveButton: T;
  };
  playlist: {
    removeEntry: T;
    moveToTopEntry: T;
    moveToBottomEntry: T;
  };
}

export type SettingSearchStrings = SettingSearchStringsBase<string | undefined>;
export type TemplateSearchStrings = SettingSearchStringsBase<string>;
export type SettingSearchStringValues = SettingSearchStrings['homePage'] &
  SettingSearchStrings['watchVideo'] &
  SettingSearchStrings['watchPlaylist'] &
  SettingSearchStrings['playlist'];
