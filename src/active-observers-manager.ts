import {OneshotObserver} from "./data/oneshot-observer";

/**
 * Manage active mutation observers inside the same page context.
 *
 * Because of how YouTube is designed the DOM changes very little when navigating between pages. This can
 * cause mutation observers of one page to still be active in a different page. To prevent such an event
 * this is designed to keep track of all observer instances and provide an option to disconnect them all.
 *
 * Usage note: Mutation observers created in a content script can not be managed from a background script
 * because content script and background scripts both run in separate contexts. Therefore, an instance of
 * this manager must be created for both the content script and background script.
 */
export class ActiveObserversManager {
    private backgroundObservers: MutationObserver[] = [];
    private oneshotObservers: OneshotObserver[] = [];

    /**
     * Track a mutation observer as an oneshot observer.
     *
     * An oneshot observer is an observer that runs under a specific condition and disconnects after the
     * condition has been fulfilled. An example usage might be to determine if the content of a dialog has
     * changed so that an action is performed for the correct element.
     *
     * If a different reference to an observer but the same id data is provided, then the previous referenced
     * observer will be disconnected.
     *
     * @param oneshotObserver - The mutation observer and identifier data to add as an oneshot observer
     */
    upsertOneshotObserver(oneshotObserver: OneshotObserver): MutationObserver {
        const existingOneshotObserver = this.oneshotObservers
            .find(oneshotOb => oneshotOb.equals(oneshotObserver));
        if (existingOneshotObserver) {
            existingOneshotObserver.observer.disconnect();
            this.oneshotObservers = this.oneshotObservers
                .filter(oneshotOb => !oneshotOb.equals(existingOneshotObserver));
        }
        this.oneshotObservers.push(oneshotObserver);
        return oneshotObserver.observer;
    }

    /**
     * Track a mutation observer as a background observer.
     *
     * Background observers are long-running mutation observers watching specific DOM elements inside a
     * page context.
     *
     * @param observer - The mutation observer to track as a background observer
     */
    addBackgroundObserver(observer: MutationObserver): MutationObserver {
        this.backgroundObservers.push(observer);
        return observer;
    }

    /**
     * Disconnect all currently tracked oneshot and background observers.
     *
     * Before running the next content script ensure that this method gets called before to stop any
     * existing mutation observers.
     */
    disconnectAll(): void {
        const observers: MutationObserver[] = [
            ...this.backgroundObservers,
            ...this.oneshotObservers.map(oneshotOb => oneshotOb.observer)
        ];
        observers.forEach(observer => observer.disconnect());

        this.oneshotObservers = [];
        this.backgroundObservers = [];
    }
}
