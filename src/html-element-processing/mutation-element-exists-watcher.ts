import {ElementWatcher} from "./element-watcher";
import {ElementWatcherResult} from "./element-watcher-result";

export class MutationElementExistsWatcher extends ElementWatcher<MutationElementExistsWatcher> {
    private mutationObserverFn: ((observer: MutationObserver) => void) | undefined;

    private constructor() {
        super()
    }

    static build(): MutationElementExistsWatcher {
        return new MutationElementExistsWatcher();
    }

    queryFn(elementQueryFn: () => ElementWatcherResult | null): MutationElementExistsWatcher {
        this.elementQueryFn = elementQueryFn;
        return this;
    }

    observeFn(mutationObserverFn: (observer: MutationObserver) => void): MutationElementExistsWatcher {
        this.mutationObserverFn = mutationObserverFn;
        return this;
    }

    start(): Promise<ElementWatcherResult> {
        return new Promise<ElementWatcherResult>((resolve, reject) => {
            if (!this.elementQueryFn) {
                return reject(new Error('No query function was provided'));
            }
            if (!this.mutationObserverFn) {
                return reject(new Error('No observe function was provided'));
            }

            const initialElementQueryResult: ElementWatcherResult = this.elementQueryFn();
            if (Object.values(initialElementQueryResult).every(element => !!element)) {
                return resolve(initialElementQueryResult);
            }

            const domChangeObserver = new MutationObserver((_, observer) => {
                const elementQueryResult: ElementWatcherResult = this.elementQueryFn();
                if (Object.values(elementQueryResult).every(element => !!element)) {
                    resolve(elementQueryResult);
                    observer.disconnect();
                }
            });

            this.mutationObserverFn(domChangeObserver);
        });
    }

}