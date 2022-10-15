import {NavigationFilter} from "./navigation-filter";

export class HtmlTreeNavigator {
    private filters: NavigationFilter[] = [];
    private debug: boolean = false;

    private constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlTreeNavigator {
        return new HtmlTreeNavigator(element);
    }

    debugNavigation(): HtmlTreeNavigator {
        this.debug = true;
        return this;
    }

    filter(filter: NavigationFilter): HtmlTreeNavigator {
        this.filters.push(filter);
        return this;
    }

    find(): HTMLElement[] {
        return this.navigateTree(0, this.element.children);
    }

    findFirst(): HTMLElement | undefined {
        const elements = this.navigateTree(0, this.element.children);
        return elements.length > 0 ? elements[0] : undefined;
    }

    findLast(): HTMLElement | undefined {
        const elements = this.navigateTree(0, this.element.children);
        return elements.length > 0 ? elements[elements.length - 1] : undefined;
    }

    private navigateTree(filterStartIndex: number, htmlCollection: HTMLCollection): HTMLElement[] | undefined {
        const currentFilter = this.filters[filterStartIndex];
        const relevantElements: HTMLElement[] = currentFilter.apply(htmlCollection);

        if (this.debug) {
            const relevantElementNames = relevantElements
                .map(element => element.tagName)
                .join(', ');
            console.debug(`Found the following elements with filter ${currentFilter}: ${relevantElementNames}`);
        }

        if (filterStartIndex === this.filters.length - 1) {
            return relevantElements;
        }

        return relevantElements
            .flatMap(element => element.children)
            .flatMap(htmlCollection => this.navigateTree(filterStartIndex + 1, htmlCollection))
            .filter(element => !!element);
    }

}