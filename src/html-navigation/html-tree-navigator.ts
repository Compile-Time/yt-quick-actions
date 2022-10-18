import {NavigationFilter} from "./navigation-filter";
import {NavigationFilterQueue} from "./navigation-filter-queue";
import {NavigationFilterToProcess} from "./navigation-filter-to-process";

/**
 * Builder-like class for HTML tree navigation.
 */
export class HtmlTreeNavigator {
    private debug: boolean = false;
    private initialFilterQueue: NavigationFilterQueue = new NavigationFilterQueue();
    private debugFiltersToProcessMap: Map<NavigationFilter, NavigationFilterToProcess> =
        new Map<NavigationFilter, NavigationFilterToProcess>();

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
        this.initialFilterQueue.getFilters().forEach(filterToProcess => {
            this.debugFiltersToProcessMap.set(filterToProcess.getFilter(), filterToProcess);
        })
        const foundElement = this.navigateTree(this.initialFilterQueue, this.element.children);

        if (this.debug) {
            this.debugFiltersToProcessMap.forEach((filterToProcess) => {
                if (!filterToProcess.isProcessed()) {
                    console.debug(`Could not find matching element for filter ${filterToProcess.getFilter()}`)
                }
            })
        }

        return foundElement;
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

    private navigateTree(filterQueue: NavigationFilterQueue, htmlCollection: HTMLCollection): HTMLElement[] {
        if (htmlCollection.length === 0) {
            return [];
        }

        const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        const filter = filterToProcess.getFilter();
        const foundElements: HTMLElement[] = filter.apply(htmlCollection);

        if (foundElements.length > 0) {
            filterToProcess.markProcessed();
            this.debugFiltersToProcessMap.set(filter, filterToProcess);
            if (filterQueue.areAllFiltersProcessed()) {
                return foundElements;
            }
        }

        return Array.from(htmlCollection)
            .flatMap(element => element.children)
            .flatMap(children => this.navigateTree(filterQueue.cloneWithoutProcessed(), children))
            .filter(element => !!element);
    }
}