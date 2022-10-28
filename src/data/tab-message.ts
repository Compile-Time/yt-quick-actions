import {RuntimeMessage} from "../enums/runtime-message";

export class TabMessage {
    constructor(readonly runtimeMessage: RuntimeMessage,
                readonly disconnectObservers: boolean) {
    }
}