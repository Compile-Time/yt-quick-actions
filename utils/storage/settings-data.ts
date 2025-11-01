import { LogLevel } from '../enums/log-level';

export const SETTING_LOG_LEVELS = 'local:log-levels';
export const SETTING_SEARCH_STRINGS = 'local:search-strings';

export interface SettingLogLevels {
  homePage: LogLevel;
  watchVideo: LogLevel;
  watchPlaylist: LogLevel;
  playlist: LogLevel;
}

export interface SettingSearchStrings {
  playlistRemoveEntry: string | undefined;
  playlistMoveTopEntry: string | undefined;
  playlistMoveBottomEntry: string | undefined;
  homePageWatchLaterEntry: string | undefined;
  videoWatchLaterEntry: string | undefined;
  watchingPlaylistRemoveEntry: string | undefined;
  watchingPlaylistWatchLaterEntry: string | undefined;
}
