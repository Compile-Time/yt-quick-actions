import {RuntimeMessage} from "../enums/runtime-message";

export class TabMessage {
    constructor(private readonly runtimeMessage: RuntimeMessage,
                private readonly disconnectObservers: boolean) {
    }

    shouldDisconnectObservers(): boolean {
        return this.disconnectObservers;
    }

    isVideoPage(): boolean {
        return this.runtimeMessage === RuntimeMessage.NAVIGATED_TO_VIDEO;
    }

    isHomePage(): boolean {
        return this.runtimeMessage === RuntimeMessage.NAVIGATED_TO_HOME_PAGE;
    }

    isPlaylistPage(): boolean {
        return this.runtimeMessage === RuntimeMessage.NAVIGATED_TO_PLAYLIST;
    }

    isWatchingVideoInPlaylistPage(): boolean {
        return this.runtimeMessage === RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST;
    }
}