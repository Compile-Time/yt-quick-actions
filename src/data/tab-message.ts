import {PageEvent} from "../enums/page-event";

export class TabMessage {
    constructor(readonly runtimeMessage: PageEvent,
                readonly disconnectObservers: boolean) {
    }
}