import {NavigationFilter} from "./navigation-filter";
import {NavigationFilterQueue} from "./navigation-filter-queue";

export class HtmlTreeDirectNavigator {
    private debug: boolean = false;
    private initialFilterQueue: NavigationFilterQueue = new NavigationFilterQueue();

    constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlTreeDirectNavigator {
        return new HtmlTreeDirectNavigator(element);
    }

    debugNavigation(): HtmlTreeDirectNavigator {
        this.debug = true;
        return this;
    }

    filter(filter: NavigationFilter): HtmlTreeDirectNavigator {
        this.initialFilterQueue.addFilter(filter);
        return this;
    }

    find(): HTMLElement[] | undefined {
        return this.navigateTree(this.initialFilterQueue.clone(), this.element.children);
    }

    findFirst(): HTMLElement | undefined {
        const foundElements = this.find();
        return foundElements.length > 0 ? foundElements[0] : undefined;
    }

    findLast(): HTMLElement | undefined {
        const foundElements = this.find();
        return foundElements.length > 0 ? foundElements[foundElements.length - 1] : undefined;
    }

    private navigateTree(filterQueue: NavigationFilterQueue, htmlCollection: HTMLCollection): HTMLElement[] {
        if (htmlCollection.length === 0) {
            return [];
        }

        const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        const filter = filterToProcess.getFilter();
        const foundElements: HTMLElement[] = filter.apply(htmlCollection);

        if (this.debug) {
            const foundElementNames = foundElements
                .map(element => element.tagName)
                .join(', ');
            console.debug(`Found the following elements with filter ${filter}: ${foundElementNames}`);
        }

        if (foundElements.length > 0) {
            filterToProcess.markProcessed();
            if (filterQueue.areAllFiltersProcessed()) {
                return foundElements;
            }
        }

        return Array.from(htmlCollection)
            .flatMap(element => element.children)
            .flatMap(children => this.navigateTree(filterQueue.clone(), children))
            .filter(element => !!element);
    }
}