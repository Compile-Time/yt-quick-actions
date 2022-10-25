export enum RuntimeMessage {
    NAVIGATED_TO_PLAYLIST = 'navigated-to-playlist',
    NAVIGATED_TO_VIDEO = 'navigated-to-video',
    NAVIGATED_TO_HOME_PAGE = 'navigated-to-home-page',
    NAVIGATED_TO_VIDEO_IN_PLAYLIST = 'navigated-to-video-in-playlist'
}

export class RuntimeMessageUtils {
    static getNotGivenValues(runtimeMessages: RuntimeMessage[]): RuntimeMessage[] {
        return Object.values(RuntimeMessage).filter(value => !runtimeMessages.includes(value));
    }
}