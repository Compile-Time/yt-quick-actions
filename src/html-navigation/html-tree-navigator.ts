import {NavigationFilter} from "./navigation-filter";
import {NavigationFilterQueue} from "./navigation-filter-queue";

/**
 * Builder-like class for HTML tree navigation.
 */
export class HtmlTreeNavigator {
    private debug: boolean = false;
    private initialFilterQueue: NavigationFilterQueue = new NavigationFilterQueue();

    constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlTreeNavigator {
        return new HtmlTreeNavigator(element);
    }

    /**
     * Enable debug mode for this HtmlTreeNavigator.
     *
     * Debug mode causes the navigator to write out information if for a given filter an element could be
     * found. The information is written out with console.debug.
     */
    debugNavigation(): HtmlTreeNavigator {
        this.debug = true;
        return this;
    }

    /**
     * Add a {@link NavigationFilter} to restrict the tree navigation with.
     *
     * When looking for a specific element in the HTMl tree it might be possible that such an element
     * might exist in many places in the tree while only a specific subtree is relevant. This method
     * allows restricting usage in a specific subtree.
     * @param filter - The filter to use for subtree restriction
     */
    filter(filter: NavigationFilter): HtmlTreeNavigator {
        this.initialFilterQueue.addFilter(filter);
        return this;
    }

    find(): HTMLElement[] | undefined {
        // TODO: It would be nicer if the target element to find is provided as an argument to this
        //  method. Otherwise it is unclear what the target should be when providing a bunch of filter calls.
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
            if (foundElements.length === 0) {
                console.debug(`No elements found with filter ${filter}`);
            } else {
                const foundElementNames = foundElements.map(element => element.tagName).join(', ');
                console.debug(`Found the following elements with filter ${filter}: ${foundElementNames}`);
            }
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