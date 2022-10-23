export enum LogMode {
    DEFAULT = 'default',
    DEBUG = 'debug'
}

export class LogModeMapper {
    static fromStr(str: string): LogMode {
        switch (str) {
            case LogMode.DEFAULT:
                return LogMode.DEFAULT;

            case LogMode.DEBUG:
                return LogMode.DEBUG;
        }
    }
}
