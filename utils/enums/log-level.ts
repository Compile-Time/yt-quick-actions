export enum LogLevel {
  SILENT = 'silent',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export function logLevelFromStr(str: string) {
  switch (str) {
    case LogLevel.SILENT:
      return LogLevel.SILENT;

    case LogLevel.ERROR:
      return LogLevel.ERROR;

    case LogLevel.WARN:
      return LogLevel.WARN;

    case LogLevel.INFO:
      return LogLevel.INFO;

    case LogLevel.DEBUG:
      return LogLevel.DEBUG;

    case LogLevel.TRACE:
      return LogLevel.TRACE;

    default:
      throw new Error('Given string does not match a LogLevel value!');
  }
}

export function logLevelFromStrOrDefault(str: string) {
  try {
    return logLevelFromStr(str);
  } catch {
    return LogLevel.WARN;
  }
}

export function logLevelFromNumber(logLevel: LogLevel) {
  switch (logLevel) {
    case LogLevel.SILENT:
      return 0;

    case LogLevel.ERROR:
      return 1;

    case LogLevel.WARN:
      return 2;

    case LogLevel.INFO:
      return 3;

    case LogLevel.DEBUG:
      return 4;

    case LogLevel.TRACE:
      return 5;
  }
}
