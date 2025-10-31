import { NavigationFilterToProcess } from './navigation-filter-to-process';
import { NavigationFilter } from './navigation-filter';

/**
 * Class representing a queue of filters to be processed.
 *
 * This class provides methods for determining the overall state of given filters to be queued and is designed
 * with recursion usage in mind.
 */
export class NavigationFiltersToProcessQueue {
  private readonly filtersToProcess: NavigationFilterToProcess[] = [];

  constructor(filters: NavigationFilterToProcess[] = []) {
    this.filtersToProcess = filters;
  }

  static fromFilters(navigationFilters: NavigationFilter[]): NavigationFiltersToProcessQueue {
    return new NavigationFiltersToProcessQueue(
      navigationFilters.map((filter) => new NavigationFilterToProcess(filter)),
    );
  }

  getCurrentOrNextUnprocessedFilter(): NavigationFilterToProcess | null {
    for (const filterToProcess of this.filtersToProcess) {
      if (!filterToProcess.isProcessed()) {
        return filterToProcess;
      }
    }
    return null;
  }

  addFilter(filter: NavigationFilter): void {
    this.filtersToProcess.push(new NavigationFilterToProcess(filter));
  }

  areAllFiltersProcessed(): boolean {
    return this.filtersToProcess.every((filterProcessed) => filterProcessed.isProcessed() === true);
  }

  cloneWithoutProcessed(): NavigationFiltersToProcessQueue {
    return new NavigationFiltersToProcessQueue(
      this.filtersToProcess.filter((toProcess) => !toProcess.isProcessed()).map((toProcess) => toProcess.clone()),
    );
  }
}
