import {RuntimeMessage} from "../enums/runtime-message";
import {Logger} from "loglevel";
import {contentScriptObserversManager} from "../content_scripts/init-globals";

export class ElementReadyWatcher {

    static watch(runtimeMessage: RuntimeMessage,
                 logger: Logger,
                 elementQueryCallback: () => HTMLElement): Promise<HTMLElement> {
        return new Promise(resolve => {
            logger.debug('Checking if element to watch is ready');
            const initialCheck: HTMLElement = elementQueryCallback();

            if (initialCheck) {
                logger.debug('Element to watch is ready!');
                return resolve(initialCheck);
            }

            const domChangeObserver = new MutationObserver((_, observer) => {
                const element: HTMLElement = elementQueryCallback();
                if (element) {
                    logger.debug('Element to watch is ready!');
                    resolve(element);
                    observer.disconnect();
                }
            });

            contentScriptObserversManager.addForPage(runtimeMessage, domChangeObserver)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                });
        });
    }

}