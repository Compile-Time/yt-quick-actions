export class OneshotObserver {
    constructor(readonly id: string,
                readonly observer: MutationObserver) {
    }

    equals(other: OneshotObserver): boolean {
        return this.id === other.id;
    }
}