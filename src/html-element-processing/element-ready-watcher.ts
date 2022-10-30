import {activeObserversManager} from "../active-observers-manager";
import {RuntimeMessage} from "../enums/runtime-message";

export class ElementReadyWatcher {

    static watch(runtimeMessage: RuntimeMessage, elementQueryCallback: () => HTMLElement): Promise<HTMLElement> {
        return new Promise(resolve => {
            const initialCheck: HTMLElement = elementQueryCallback();

            if (initialCheck) {
                return resolve(initialCheck);
            }

            const domChangeObserver = new MutationObserver((_, observer) => {
                const element: HTMLElement = elementQueryCallback();
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });

            activeObserversManager.addForPage(runtimeMessage, domChangeObserver)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                });
        });
    }

}