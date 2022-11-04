import {LogLevel} from "../enums/log-level";

export class SettingsData {
    static readonly LOG_LEVEL_ATTR = 'logLevel';

    logLevel: LogLevel = LogLevel.WARN;
}
