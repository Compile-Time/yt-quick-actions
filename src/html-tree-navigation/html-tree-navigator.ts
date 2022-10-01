export class HtmlTreeNavigator {
    filters: NavigationFilter[] = [];

    constructor(private htmlElement: HTMLElement) {
    }

    static navigate(htmlElement: HTMLElement): HtmlTreeNavigator {
        return new HtmlTreeNavigator(htmlElement);
    }

    filter(filter: NavigationFilter): HtmlTreeNavigator {
        this.filters.push(filter);
        return this;
    }

    find(): Element[] {
        const finalElements = this.navigateTree(0, this.htmlElement.children);
        if (finalElements.length > 0) {
            console.error('Did not find exactly one element');
        }

        return finalElements;
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

export class NavigationFilter {
    constructor(private tagName: string,
                private id?: string,
                private textContent?: string) {
    }

    static of(tagName: string, id?: string, textContent?: string): NavigationFilter {
        return new NavigationFilter(tagName, id, textContent);
    }

    apply(htmlCollection: HTMLCollection): Element[] {
        const filteredElements: Element[] = [];
        for (let i = 0; i < htmlCollection.length; i++) {
            const element: Element = htmlCollection[i];

            // element.tagName is in UPPERCASE.
            const elementTagName = element.tagName.toLowerCase();

            if (!!this.id && elementTagName === this.tagName && element.id === this.id) {
                filteredElements.push(element);
            } else if (!!this.textContent && elementTagName === this.tagName && element.textContent === this.textContent) {
                filteredElements.push(element);
            } else if (elementTagName === this.tagName) {
                filteredElements.push(element);
            }
        }

        return filteredElements;
    }
}