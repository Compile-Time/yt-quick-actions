export class ActivePageObserverManager {
    private observer: MutationObserver;

    constructor() {
    }

    switchObserver(observer: MutationObserver): void {
        if (!!this.observer) {
            this.observer.disconnect();
        }
        this.observer = observer;
    }
}

export const activePageObserverManager: ActivePageObserverManager = new ActivePageObserverManager();
