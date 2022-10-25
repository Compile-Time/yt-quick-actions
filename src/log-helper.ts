export class LogHelper {
    private static readonly APP_NAME = '[yt-quick-actions]';

    static log(message: string, ...optionalParams: any[]): void {
        console.log(`${this.APP_NAME}: ${message}`, optionalParams);
    }

    static error(message: string, ...optionalParams: any[]): void {
        console.error(`${this.APP_NAME}: ${message}`, optionalParams);
    }

    static debug(message: string): void {
        console.debug(`${this.APP_NAME}: ${message}`);
    }

    static group(label: string): void {
        console.group(`${this.APP_NAME}: ${label}`);
    }

    static groupEnd(): void {
        console.groupEnd();
    }

    static pageReadyIntervalLimitReached(contentScriptName: string): void {
        this.error(`Could not determine if page is ready for content script ${contentScriptName}.\n` +
            'Please enable debug mode and check the console logs with debug messages enabled.');
    }
}