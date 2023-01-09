import {NavigationFilter} from "./filter/navigation-filter";
import {NavigationFiltersToProcessQueue} from "./filter/navigation-filters-to-process-queue";
import {HtmlFindResult} from "./html-find-result";

/**
 * Builder-like class for HTML tree navigation.
 */
export class HtmlTreeNavigator {
    private initialFilterQueue: NavigationFiltersToProcessQueue = new NavigationFiltersToProcessQueue();

    constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlTreeNavigator {
        return new HtmlTreeNavigator(element);
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
     * Define the final HTML elements to find by providing a filter.
     *
     * Calling this method will start the navigation process of this {@link HtmlTreeNavigator}.
     * The {@link HtmlTreeNavigator} will then recursively navigate the HTML tree. If any additional filters
     * are set by {@link filter} those filters will be taken into account ({@see filter}). Only when all
     * filters match (including the one given to {@link findAll}) a non-empty result will be returned.
     *
     * @param targetElementFilter - The filter to use for finding the desired target element
     * @returns {HTMLElement[]} - If any of the given filters do not match, an empty array is returned
     */
    findAll(targetElementFilter: NavigationFilter): HtmlFindResult[] {
        if (!this.element) {
            return [];
        }

        this.filter(targetElementFilter);
        return this.navigateTree(this.initialFilterQueue, this.element.children)
            .map(element => new HtmlFindResult(element));
    }

    /**
     * Define the final HTML element to find by providing a filter.
     *
     * {@see findAll} for implementation details.
     *
     * @param filter - The filter defining the final element to look for
     */
    findFirst(filter: NavigationFilter): HtmlFindResult {
        const foundElements = this.findAll(filter);
        return foundElements.length > 0 ? foundElements[0] : HtmlFindResult.noResult();
    }

    /**
     * Define the final HTML element to find by providing a filter.
     *
     * {@see findAll} find for implementation details.
     *
     * @param filter - The filter defining the final element to look for
     */
    findLast(filter: NavigationFilter): HtmlFindResult {
        const foundElements = this.findAll(filter);
        return foundElements.length > 0 ? foundElements[foundElements.length - 1] : HtmlFindResult.noResult();
    }

    private navigateTree(filterQueue: NavigationFiltersToProcessQueue, htmlCollection: HTMLCollection): HTMLElement[] {
        if (htmlCollection.length === 0) {
            return [];
        }

        const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        if (!filterToProcess) {
            return [];
        }
        const filter = filterToProcess.getFilter();

        const foundElements: HTMLElement[] = filter.apply(htmlCollection);
        if (foundElements.length > 0) {
            filterToProcess.markProcessed();
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