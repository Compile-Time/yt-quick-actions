import {NavigationFilterQueue} from "../../src/html-navigation/navigation-filter-queue";
import {TagNavigationFilter} from "../../src/html-navigation/navigation-filter";
import {Tags} from "../../src/html-navigation/element-data";

describe('NavigationFilterQueue', () => {
    it('should return first filter when no filters are marked as processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const filterQueue = NavigationFilterQueue.fromFilters([
            divFilter
        ]);

        const receivedFilterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        expect(receivedFilterToProcess.getFilter()).toEqual(divFilter);
        expect(receivedFilterToProcess.isProcessed()).toBeFalse();
    })

    it('should return second element when first element is marked as processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFilterQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        const filterToMarkProcessed = filterQueue.getCurrentOrNextUnprocessedFilter();
        expect(filterToMarkProcessed.getFilter()).toEqual(divFilter);
        expect(filterToMarkProcessed.isProcessed()).toBeFalse();

        filterToMarkProcessed.markProcessed();
        expect(filterToMarkProcessed.isProcessed()).toBeTrue();

        const receivedFilterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        expect(receivedFilterToProcess.getFilter()).toEqual(spanFilter);
        expect(receivedFilterToProcess.isProcessed()).toBeFalse();
    });

    it('should return true when all filters are processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFilterQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        while (filterQueue.areAllFiltersProcessed() === false) {
            const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
            filterToProcess.markProcessed();
        }
        expect(filterQueue.areAllFiltersProcessed()).toBeTrue();
    });

    it('should return false when not all filters are processed', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFilterQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        const filterToProcess = filterQueue.getCurrentOrNextUnprocessedFilter();
        filterToProcess.markProcessed();
        expect(filterQueue.areAllFiltersProcessed()).toBeFalse();
    });

    it('should correctly clone current filters', () => {
        const divFilter = new TagNavigationFilter(Tags.DIV);
        const spanFilter = new TagNavigationFilter(Tags.SPAN);
        const buttonFilter = new TagNavigationFilter(Tags.BUTTON);
        const filterQueue = NavigationFilterQueue.fromFilters([
            divFilter, spanFilter, buttonFilter
        ]);

        filterQueue.getCurrentOrNextUnprocessedFilter().markProcessed();
        filterQueue.getCurrentOrNextUnprocessedFilter().markProcessed();
        filterQueue.getCurrentOrNextUnprocessedFilter().markProcessed();

        expect(filterQueue.areAllFiltersProcessed()).toBeTrue();

        const clonedQueue = filterQueue.clone();
        expect(clonedQueue.areAllFiltersProcessed()).toBeTrue();
    });
});