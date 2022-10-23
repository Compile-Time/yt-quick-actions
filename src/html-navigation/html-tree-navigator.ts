import {NavigationFilter} from "./navigation-filter";
import {NavigationFiltersToProcessQueue} from "./navigation-filters-to-process-queue";
import {NavigationFilterToProcess} from "./navigation-filter-to-process";
import {LogMode} from "../enums/log-mode";

/**
 * Builder-like class for HTML tree navigation.
 */
export class HtmlTreeNavigator {
    private logModePromise: Promise<LogMode> = null;
    private initialFilterQueue: NavigationFiltersToProcessQueue = new NavigationFiltersToProcessQueue();
    private debugContext: string;
    private debugFiltersToProcessMap: Map<NavigationFilter, NavigationFilterToProcess> =
        new Map<NavigationFilter, NavigationFilterToProcess>();

    constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlTreeNavigator {
        return new HtmlTreeNavigator(element);
    }

    /**
     * Write debug messages to the console depending on if log mode is set to debug.
     *
     * This method takes a promise that returns the current log mode. If the log mode is set to debug the
     * extension will write out information regarding filter results out to the console on the debug
     * level. Additionally, a context string must be provided that is used to group the debug messages.
     *
     * @param context - A context string used to group the resulting debug messages
     * @param logModePromise - A promise returning the currently enabled log mode
     */
    logOperations(context: string, logModePromise: Promise<LogMode>): HtmlTreeNavigator {
        this.debugContext = context;
        this.logModePromise = logModePromise;
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
    findAll(targetElementFilter: NavigationFilter): HTMLElement[] {
        this.filter(targetElementFilter);
        this.initialFilterQueue.getFilters().forEach(filterToProcess => {
            this.debugFiltersToProcessMap.set(filterToProcess.getFilter(), filterToProcess);
        })
        const foundElement = this.navigateTree(this.initialFilterQueue, this.element.children);

        if (!!this.logModePromise) {
            this.logModePromise.then(logMode => {
                if (logMode === LogMode.DEBUG) {
                    console.group(this.debugContext);
                    this.debugFiltersToProcessMap.forEach((filterToProcess) => {
                        if (filterToProcess.isProcessed()) {
                            console.debug(`Filter ${filterToProcess.getFilter()} result: found element`);
                        } else {
                            console.debug(`Filter ${filterToProcess.getFilter()} result: element not found!`);
                        }
                    })
                    console.groupEnd();
                }
            })
        }

        return foundElement;
    }

    /**
     * Define the final HTML element to find by providing a filter.
     *
     * {@see findAll} for implementation details.
     *
     * @param filter - The filter defining the final element to look for
     */
    findFirst(filter: NavigationFilter): HTMLElement | null {
        const foundElements = this.findAll(filter);
        return foundElements.length > 0 ? foundElements[0] : null;
    }

    /**
     * Define the final HTML element to find by providing a filter.
     *
     * {@see findAll} find for implementation details.
     *
     * @param filter - The filter defining the final element to look for
     */
    findLast(filter: NavigationFilter): HTMLElement | null {
        const foundElements = this.findAll(filter);
        return foundElements.length > 0 ? foundElements[foundElements.length - 1] : null;
    }

    private navigateTree(filterQueue: NavigationFiltersToProcessQueue, htmlCollection: HTMLCollection): HTMLElement[] {
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