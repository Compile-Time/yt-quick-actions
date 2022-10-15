import {NavigationFilter} from "./navigation-filter";

export class HtmlTreeDirectNavigator {
    private debug: boolean = false;

    constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlTreeDirectNavigator {
        return new HtmlTreeDirectNavigator(element);
    }

    find(filter: NavigationFilter): HTMLElement[] | undefined {
        return this.navigateTree(filter, this.element.children);
    }

    findFirst(filter: NavigationFilter): HTMLElement | undefined {
        const foundElements = this.find(filter);
        return foundElements.length > 0 ? foundElements[0] : undefined;
    }

    findLast(filter: NavigationFilter): HTMLElement | undefined {
        const foundElements = this.find(filter);
        return foundElements.length > 0 ? foundElements[foundElements.length - 1] : undefined;
    }

    private navigateTree(filter: NavigationFilter, htmlCollection: HTMLCollection): HTMLElement[] {
        if (htmlCollection.length === 0) {
            return [];
        }

        const foundElements: HTMLElement[] = filter.apply(htmlCollection);

        if (this.debug) {
            const foundElementNames = foundElements
                .map(element => element.tagName)
                .join(', ');
            console.debug(`Found the following elements with filter ${filter}: ${foundElementNames}`);
        }

        if (foundElements.length > 0) {
            return foundElements;
        }

        return Array.from(htmlCollection)
            .flatMap(element => element.children)
            .flatMap(children => this.navigateTree(filter, children))
            .filter(element => !!element);
    }
}