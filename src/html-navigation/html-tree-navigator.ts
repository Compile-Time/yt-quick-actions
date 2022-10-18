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
     * Debug mode causes the navigator to write out information about the results of the filter operation.
     * The intent is to help with debugging by being able to see if for a filter a match could be found.
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
     * allows restricting the search to a specific subtree.
     *
     * @param filter - The filter to use for subtree restriction
     */
    filter(filter: NavigationFilter): HtmlTreeNavigator {
        this.initialFilterQueue.addFilter(filter);
        return this;
    }

    /**
     * Define the HTML element to look for with a filter.
     *
     * Calling this method will start the navigation process of this {@link HtmlTreeNavigator}.
     * The {@link HtmlTreeNavigator} will then recursively navigate the HTML tree. If any filters are set
     * those filters will be taken into account ({@see filter}). Only when all filters match a non-empty
     * result will be returned.
     *
     * @param targetElementFilter - The filter to use for finding the desired target element
     * @returns {HTMLElement[]} - If any of the given filters do not match, an empty array is returned
     */
    find(targetElementFilter: NavigationFilter): HTMLElement[] {
        this.filter(targetElementFilter);
        return this.navigateTree(this.initialFilterQueue.clone(), this.element.children);
    }

    /**
     * @see find for implementation details.
     *
     * This method differs to {@link find} that it only returns the first element of the array of found
     * elements.
     */
    findFirst(filter: NavigationFilter): HTMLElement | undefined {
        const foundElements = this.find(filter);
        return foundElements.length > 0 ? foundElements[0] : undefined;
    }

    /**
     * @see find for implementation details.
     *
     * This method differs to {@link find} that it only returns the last element of the array of found
     * elements.
     */
    findLast(filter: NavigationFilter): HTMLElement | undefined {
        const foundElements = this.find(filter);
        return foundElements.length > 0 ? foundElements[foundElements.length - 1] : undefined;
    }

    // TODO: This method could be made into its own class that returns a new instance of itself with
    //  reduced information. Currently the filter queue is copied over and over again. This could become
    //  costly and right now propagates unnecessary data that isn't required into the next recursive call.
    private navigateTree(filterQueue: NavigationFilterQueue, htmlCollection: HTMLCollection): HTMLElement[] {
        if (htmlCollection.length === 0) {
            return [];
        }

        const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        const filter = filterToProcess.getFilter();
        const foundElements: HTMLElement[] = filter.apply(htmlCollection);

        if (this.debug) {
            if (foundElements.length === 0) {
                // FIXME: This case is a common case which leads to many false positives being written
                //  into the console. This information should be collected and then written out once in
                //  the end.
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