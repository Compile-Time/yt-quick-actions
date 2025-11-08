import loglevel from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';
import { LogLevel } from '../enums/log-level';

prefix.reg(loglevel);
prefix.apply(loglevel, {
  template: '[%t] [%l] [%n] - ',
  levelFormatter: function (level) {
    return level.toUpperCase();
  },
  nameFormatter: function (name) {
    const resolvedName = name || 'root';
    return `yt-qa-${resolvedName}`;
  },
  timestampFormatter: function (date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  },
  format: undefined,
});

export function createLogger(name: string) {
  const logger = loglevel.getLogger(name);
  if (import.meta.env.DEV) {
    logger.setDefaultLevel(LogLevel.DEBUG);
  } else {
    logger.setDefaultLevel(LogLevel.WARN);
  }

  return logger;
}
