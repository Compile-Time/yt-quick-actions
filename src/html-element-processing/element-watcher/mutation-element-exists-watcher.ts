import {ElementWatcher} from "./element-watcher";
import {ElementWatcherResult} from "./element-watcher-result";

export class MutationElementExistsWatcher extends ElementWatcher<MutationElementExistsWatcher> {
    private mutationObserverFn: ((observer: MutationObserver) => void);

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
            if (this.isValidQueryResult(initialElementQueryResult)) {
                return resolve(initialElementQueryResult);
            }

            const domChangeObserver = new MutationObserver((_, observer) => {
                const elementQueryResult: ElementWatcherResult = this.elementQueryFn();
                if (this.isValidQueryResult(elementQueryResult)) {
                    resolve(elementQueryResult);
                    observer.disconnect();
                }
            });

            this.mutationObserverFn(domChangeObserver);
        });
    }

    private isValidQueryResult(elementQueryResult: ElementWatcherResult): boolean {
        const objectValues = Object.values(elementQueryResult);
        return objectValues.length > 0
            && objectValues.every(value => {
                if (!value) {
                    return false;
                }
                return this.isHtmlElementArray(value) ? value.length > 0 : true;
            })

    }

    private isHtmlElementArray(elements: HTMLElement | HTMLElement[]): elements is Array<HTMLElement> {
        return (elements as Array<HTMLElement>).length !== undefined;
    }

}