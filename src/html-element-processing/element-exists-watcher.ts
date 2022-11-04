export class ElementExistsWatcher {
    private elementQueryFn: () => HTMLElement;
    private mutationObserverFn: (observer) => void;

    private constructor() {
    }

    static build(): ElementExistsWatcher {
        return new ElementExistsWatcher();
    }

    queryFn(elementQueryFn: () => HTMLElement): ElementExistsWatcher {
        this.elementQueryFn = elementQueryFn;
        return this;
    }

    observeFn(mutationObserverFn: (observer: MutationObserver) => void): ElementExistsWatcher {
        this.mutationObserverFn = mutationObserverFn;
        return this;
    }

    run(): Promise<HTMLElement> {
        if (!this.queryFn) {
            throw new Error('No query function was provided');
        }
        if (!this.observeFn) {
            throw new Error('No observe function was provided');
        }

        return new Promise(resolve => {
            const initialElementQuery: HTMLElement = this.elementQueryFn();

            if (initialElementQuery) {
                return resolve(initialElementQuery);
            }

            const domChangeObserver = new MutationObserver((_, observer) => {
                const element: HTMLElement = this.elementQueryFn();
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });

            this.mutationObserverFn(domChangeObserver);
        });
    }

}