import { LogLevel } from '../enums/log-level';

export const SETTING_LOG_LEVELS = 'local:log-levels';
export const SETTING_SEARCH_STRINGS = 'local:search-strings';

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
