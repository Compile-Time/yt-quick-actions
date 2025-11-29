import { LogLevel } from './enums/log-level';

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
  settings: LogLevel;
}
export type TemplateLogLevels = Record<keyof SettingLogLevels, string>;

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

export const logLevelStorage = storage.defineItem<SettingLogLevels>(SETTING_LOG_LEVELS, {
  fallback: {
    homePage: LogLevel.WARN,
    watchVideo: LogLevel.WARN,
    watchPlaylist: LogLevel.WARN,
    playlist: LogLevel.WARN,
    settings: LogLevel.WARN,
  },
});

export const searchStringStorage = storage.defineItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS, {
  fallback: {
    homePage: {
      watchLaterEntry: undefined,
    },
    watchVideo: {
      watchLaterEntry: undefined,
      videoSaveButton: undefined,
    },
    playlist: {
      moveToTopEntry: undefined,
      moveToBottomEntry: undefined,
      removeEntry: undefined,
    },
    watchPlaylist: {
      removeEntry: undefined,
      watchLaterEntry: undefined,
      videoSaveButton: undefined,
    },
  },
});

export const featuresStorage = storage.defineItem<SettingFeatures<boolean>>(SETTING_FEATURES, {
  fallback: {
    homePage: {
      disableWatchLater: false,
    },
    watchVideo: {
      disableWatchLater: false,
    },
    watchPlaylist: {
      disableRemove: false,
      disableWatchLater: false,
      disableScrollToTop: false,
      disableScrollToBottom: false,
    },
    playlist: {
      disableRemove: false,
      disableMoveToTop: false,
      disableMoveToBottom: false,
      disableScrollToTop: false,
      disableScrollToBottom: false,
    },
  },
});
