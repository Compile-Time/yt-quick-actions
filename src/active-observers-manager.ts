import {PageEvent} from "./enums/page-event";
import {OneshotObserver} from "./data/oneshot-observer";

/**
 * Manage active mutation observers inside the same context.
 *
 * Mutation observers created in a content script can not be managed from a background script because
 * content script and background scripts both run in separate contexts.
 */
export class ActiveObserversManager {
    // TODO: The differentiation between page has become unnecessary since all observers are cleared on page
    //  change. Therefore, all references to RuntimeMesssage can be removed here.
    private runtimeMessageToObserversMap: Map<PageEvent, MutationObserver[]> = new Map<PageEvent, MutationObserver[]>();
    private oneshotObservers: OneshotObserver[] = [];

    constructor() {
        this.resetRuntimeMessageObserversMap();
    }

    /**
     * Start an observer as an oneshot observer.
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

    addForPage(runtimeMessage: PageEvent, observer: MutationObserver): MutationObserver {
        const existingObservers = this.runtimeMessageToObserversMap.get(runtimeMessage);
        this.runtimeMessageToObserversMap.set(runtimeMessage, [...existingObservers, observer]);
        return observer;
    }

    disconnectAll(): void {
        const observers: MutationObserver[] = [
            ...Array.from(this.runtimeMessageToObserversMap.values()).flat(),
            ...this.oneshotObservers.map(oneshotOb => oneshotOb.observer)
        ];
        observers.forEach(observer => observer.disconnect());

        this.oneshotObservers = [];
        this.resetRuntimeMessageObserversMap();
    }

    private resetRuntimeMessageObserversMap(): void {
        Object.values(PageEvent).forEach(value => this.runtimeMessageToObserversMap.set(value, []));
    }
}
