import { PageEvent } from "../enums/page-event";

export class TabMessage {
  constructor(
    readonly pageEvent: PageEvent,
    readonly disconnectObservers: boolean
  ) {}
}
