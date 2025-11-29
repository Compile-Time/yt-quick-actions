import { createLogger } from '@/utils/logging/log-provider';
import { SETTING_LOG_LEVELS, SettingLogLevels } from '@/utils/storage/settings-data';
import { Logger } from 'loglevel';

export enum LoggerKind {
  HOME_SCRIPT = 'homePage',
  PLAYLIST_SCRIPT = 'playlist',
  VIDEO_SCRIPT = 'watchVideo',
  WATCHING_PLAYLIST_SCRIPT = 'watchPlaylist',
  SETTINGS_STATE = 'settings',
}

const loggers: Record<keyof SettingLogLevels, Logger> = {
  [LoggerKind.HOME_SCRIPT]: createLogger('home'),
  [LoggerKind.PLAYLIST_SCRIPT]: createLogger('playlist'),
  [LoggerKind.VIDEO_SCRIPT]: createLogger('video'),
  [LoggerKind.WATCHING_PLAYLIST_SCRIPT]: createLogger('watching-playlist'),
  [LoggerKind.SETTINGS_STATE]: createLogger('settings'),
};

function updateLogLevel(logLevels: SettingLogLevels | null) {
  Object.keys(logLevels ?? {}).forEach((loggerName) => {
    // @ts-expect-error The effort to properly type this is not worth the convenience this offers.
    const logger = loggers[loggerName];
    // @ts-expect-error The effort to properly type this is not worth the convenience this offers.
    const level = logLevels[loggerName]!;
    if (!logger || !level) {
      console.error(`Logger with name ${loggerName} does not exist!`);
      return;
    }
    logger.setLevel(level);
  });
}

storage.getItem<SettingLogLevels>(SETTING_LOG_LEVELS).then((logLevels) => updateLogLevel(logLevels));
storage.watch<SettingLogLevels>(SETTING_LOG_LEVELS, (logLevels) => updateLogLevel(logLevels));

export function getLogger(name: LoggerKind) {
  if (!loggers[name]) {
    throw new Error(`Logger with name ${name} does not exist!`);
  }
  return loggers[name];
}
