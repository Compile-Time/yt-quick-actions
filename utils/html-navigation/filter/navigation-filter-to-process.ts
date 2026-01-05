import { NavigationFilter } from './navigation-filter';

/**
 * Class to keep track of process state for a filter.
 *
 * This is useful for situations where it is desirable to know if a filter has been already used (=processed) or not.
 */
export class NavigationFilterToProcess {
  private readonly filter: NavigationFilter;
  private processed: boolean;

  constructor(filter: NavigationFilter, processed = false) {
    this.filter = filter;
    this.processed = processed;
  }

  markProcessed(): void {
    this.processed = true;
  }

  getFilter(): NavigationFilter {
    return this.filter;
  }

  isProcessed(): boolean {
    return this.processed;
  }

  clone(): NavigationFilterToProcess {
    return new NavigationFilterToProcess(this.filter, this.processed);
  }
}
