import {NavigationFilterToProcess} from "./navigation-filter-to-process";
import {NavigationFilter} from "./navigation-filter";

export class NavigationFilterQueue {
    private readonly filtersToProcess: NavigationFilterToProcess[] = [];

    constructor(filters: NavigationFilterToProcess[] = []) {
        this.filtersToProcess = filters;
    }

    static fromFilters(navigationFilters: NavigationFilter[]): NavigationFilterQueue {
        return new NavigationFilterQueue(navigationFilters.map(filter => new NavigationFilterToProcess(filter)));
    }

    getCurrentOrNextUnprocessedFilter(): NavigationFilterToProcess | undefined {
        for (const filterToProcess of this.filtersToProcess) {
            if (!filterToProcess.isProcessed()) {
                return filterToProcess;
            }
        }
        return undefined;
    }

    addFilter(filter: NavigationFilter): void {
        this.filtersToProcess.push(new NavigationFilterToProcess(filter));
    }

    areAllFiltersProcessed(): boolean {
        return this.filtersToProcess
            .filter(filterProcessed => filterProcessed.isProcessed())
            .length === this.filtersToProcess.length;
    }

    cloneWithoutProcessed(): NavigationFilterQueue {
        return new NavigationFilterQueue(this.filtersToProcess
            .filter(toProcess => !toProcess.isProcessed())
            .map(toProcess => toProcess.clone())
        )
    }

    getFilters(): NavigationFilterToProcess[] {
        return this.filtersToProcess;
    }
}