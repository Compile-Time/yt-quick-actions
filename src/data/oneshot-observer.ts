import {PageEvent} from "../enums/page-event";

export class OneshotObserver {
    constructor(readonly id: string,
                readonly runtimeMessage: PageEvent,
                readonly observer: MutationObserver) {
    }

    equals(other: OneshotObserver): boolean {
        return this.id === other.id
            && this.runtimeMessage === other.runtimeMessage;
    }
}