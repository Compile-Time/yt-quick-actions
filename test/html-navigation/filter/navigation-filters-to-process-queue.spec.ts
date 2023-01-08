import {NavigationFiltersToProcessQueue} from "../../../src/html-navigation/filter/navigation-filters-to-process-queue";
import {TagNavigationFilter} from "../../../src/html-navigation/filter/navigation-filter";
import {Tags} from "../../../src/html-element-processing/element-data";

describe('NavigationFilterQueue', () => {
    it('should return first filter when no filters are marked as processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const filterQueue = NavigationFiltersToProcessQueue.fromFilters([
            divFilter
        ]);

        const receivedFilterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        expect(receivedFilterToProcess.getFilter()).toEqual(divFilter);
        expect(receivedFilterToProcess.isProcessed()).toBeFalsy();
    })

    it('should return second element when first element is marked as processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFiltersToProcessQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        const filterToMarkProcessed = filterQueue.getCurrentOrNextUnprocessedFilter();
        expect(filterToMarkProcessed.getFilter()).toEqual(divFilter);
        expect(filterToMarkProcessed.isProcessed()).toBeFalsy();

        filterToMarkProcessed.markProcessed();
        expect(filterToMarkProcessed.isProcessed()).toBeTruthy();

        const receivedFilterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        expect(receivedFilterToProcess.getFilter()).toEqual(spanFilter);
        expect(receivedFilterToProcess.isProcessed()).toBeFalsy();
    });

    it('should return true when all filters are processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFiltersToProcessQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        while (filterQueue.areAllFiltersProcessed() === false) {
            const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
            filterToProcess.markProcessed();
        }
        expect(filterQueue.areAllFiltersProcessed()).toBeTruthy();
    });

    it('should return false when not all filters are processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFiltersToProcessQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        filterToProcess.markProcessed();
        expect(filterQueue.areAllFiltersProcessed()).toBeFalsy();
    });

    it('should correctly clone current filters', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFiltersToProcessQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        filterQueue.getCurrentOrNextUnprocessedFilter().markProcessed();
        filterQueue.getCurrentOrNextUnprocessedFilter().markProcessed();
        filterQueue.getCurrentOrNextUnprocessedFilter().markProcessed();

        expect(filterQueue.areAllFiltersProcessed()).toBeTruthy();

        const clonedQueue = filterQueue.cloneWithoutProcessed();
        expect(clonedQueue.areAllFiltersProcessed()).toBeTruthy();
    });
});