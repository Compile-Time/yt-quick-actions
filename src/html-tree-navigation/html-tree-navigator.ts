import {NavigationFilter} from "./navigation-filter";

export class HtmlTreeNavigator {
    filters: NavigationFilter[] = [];

    constructor(private element: HTMLElement) {
    }

    static navigate(element: HTMLElement): HtmlTreeNavigator {
        return new HtmlTreeNavigator(element);
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
        const relevantElements: HTMLElement[] = this.filters[filterStartIndex].apply(htmlCollection);

        if (filterStartIndex === this.filters.length - 1) {
            return relevantElements;
        }

        return relevantElements
            .flatMap(element => element.children)
            .flatMap(htmlCollection => this.navigateTree(filterStartIndex + 1, htmlCollection))
            .filter(element => !!element);
    }

}