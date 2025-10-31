import { LogLevel } from "../enums/log-level";

export const SETTING_LOG_LEVEL = "logLevel";

export interface SettingSearchStrings {
  playlistRemoveEntry: string;
  playlistMoveTopEntry: string;
  playlistMoveBottomEntry: string;
  homePageWatchLaterEntry: string;
  videoWatchLaterEntry: string;
  watchingPlaylistRemoveEntry: string;
  watchingPlaylistWatchLaterEntry: string;
}

export interface SettingsData extends Record<string, any> {
  logLevel?: LogLevel;
  searchStrings?: SettingSearchStrings;
}
