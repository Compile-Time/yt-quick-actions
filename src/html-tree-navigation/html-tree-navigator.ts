import {NavigationFilter} from "./navigation-filter";

export class HtmlTreeNavigator {
    filters: NavigationFilter[] = [];

    constructor(private element: Element) {
    }

    static navigate(element: Element): HtmlTreeNavigator {
        return new HtmlTreeNavigator(element);
    }

    filter(filter: NavigationFilter): HtmlTreeNavigator {
        this.filters.push(filter);
        return this;
    }

    find(): Element[] {
        return this.navigateTree(0, this.element.children);
    }

    private navigateTree(filterStartIndex: number, htmlCollection: HTMLCollection): Element[] | undefined {
        const relevantElements: Element[] = this.filters[filterStartIndex].apply(htmlCollection);

        if (filterStartIndex === this.filters.length - 1) {
            return relevantElements;
        }

        return relevantElements
            .flatMap(element => element.children)
            .flatMap(htmlCollection => this.navigateTree(filterStartIndex + 1, htmlCollection))
            .filter(element => !!element);
    }

}