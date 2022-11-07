export class ElementExistsWatcher {
    private elementQueryFn: (() => HTMLElement | null) | undefined;
    private mutationObserverFn: ((observer: MutationObserver) => void) | undefined;

    private constructor() {
    }

    static build(): ElementExistsWatcher {
        return new ElementExistsWatcher();
    }

    queryFn(elementQueryFn: () => HTMLElement | null): ElementExistsWatcher {
        this.elementQueryFn = elementQueryFn;
        return this;
    }

    observeFn(mutationObserverFn: (observer: MutationObserver) => void): ElementExistsWatcher {
        this.mutationObserverFn = mutationObserverFn;
        return this;
    }

    run(): Promise<HTMLElement> {
        return new Promise((resolve, reject) => {
            if (!this.elementQueryFn) {
                return reject(new Error('No query function was provided'));
            }
            if (!this.mutationObserverFn) {
                return reject(new Error('No observe function was provided'));
            }

            const initialElementQuery: HTMLElement = this.elementQueryFn();
            if (initialElementQuery) {
                return resolve(initialElementQuery);
            }

            const domChangeObserver = new MutationObserver((_, observer) => {
                const element = this.elementQueryFn();
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });

            this.mutationObserverFn(domChangeObserver);
        });
    }

}