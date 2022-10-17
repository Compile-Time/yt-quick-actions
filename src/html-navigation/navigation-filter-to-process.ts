import {NavigationFilter} from "./navigation-filter";

export class NavigationFilterToProcess {
    private filter: NavigationFilter;
    private processed: boolean;

    constructor(filter: NavigationFilter,
                processed: boolean = false) {
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