import { LogLevel } from '../enums/log-level';

export const SETTING_LOG_LEVELS = 'local:log-levels';

export interface SettingLogLevels {
  homePage: LogLevel;
  watchVideo: LogLevel;
  watchPlaylist: LogLevel;
  playlist: LogLevel;
}

export interface SettingSearchStrings {
  playlistRemoveEntry: string;
  playlistMoveTopEntry: string;
  playlistMoveBottomEntry: string;
  homePageWatchLaterEntry: string;
  videoWatchLaterEntry: string;
  watchingPlaylistRemoveEntry: string;
  watchingPlaylistWatchLaterEntry: string;
}
