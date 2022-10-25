import {RuntimeMessage} from "../enums/runtime-message";

export class OneshotObserver {
    constructor(readonly id: string,
                readonly runtimeMessage: RuntimeMessage,
                readonly observer: MutationObserver) {
    }

    equals(other: OneshotObserver): boolean {
        return this.id === other.id
            && this.runtimeMessage === other.runtimeMessage;
    }
}