export abstract class NavigationFilter {
    apply(htmlCollection: HTMLCollection): Element[] {
        const filteredElements: Element[] = [];
        for (let i = 0; i < htmlCollection.length; i++) {
            const element: Element = htmlCollection[i];

            // element.tagName is in UPPERCASE.
            const lowercaseElementTagName = element.tagName.toLowerCase();

            if (this.applyCondition(element, lowercaseElementTagName)) {
                filteredElements.push(element)
            }
        }

        return filteredElements;
    }

    abstract applyCondition(element: Element, lowercaseElementTagName: string): boolean;
}

export class IdNavigationFilter extends NavigationFilter {
    constructor(private tagName: string,
                private id: string) {
        super();
    }

    applyCondition(element: Element, lowercaseElementTagName: string): boolean {
        return lowercaseElementTagName === this.tagName && element.id === this.id;
    }
}


export class TagNavigationFilter extends NavigationFilter {
    constructor(private tagName: string) {
        super();
    }

    applyCondition(element: Element, lowercaseElementTagName: string): boolean {
        return lowercaseElementTagName === this.tagName;
    }
}

export class TextContentNavigationFilter extends NavigationFilter {
    constructor(private tagName: string,
                private textContent: string) {
        super();
    }

    applyCondition(element: Element, lowercaseElementTagName: string): boolean {
        return element.textContent === this.textContent && lowercaseElementTagName === this.tagName;
    }
}