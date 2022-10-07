export abstract class NavigationFilter {
    apply(htmlCollection: HTMLCollection): HTMLElement[] {
        const filteredElements: HTMLElement[] = [];
        for (let i = 0; i < htmlCollection.length; i++) {
            const element: HTMLElement = htmlCollection[i] as HTMLElement;

            // element.tagName is in UPPERCASE.
            const lowercaseElementTagName = element.tagName.toLowerCase();

            if (this.applyCondition(element, lowercaseElementTagName)) {
                filteredElements.push(element)
            }
        }

        return filteredElements;
    }

    abstract applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean;
}

export class IdNavigationFilter extends NavigationFilter {
    constructor(private tagName: string,
                private id: string) {
        super();
    }

    applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean {
        return element.id === this.id && lowercaseElementTagName === this.tagName;
    }
}


export class TagNavigationFilter extends NavigationFilter {
    constructor(private tagName: string) {
        super();
    }

    applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean {
        return lowercaseElementTagName === this.tagName;
    }
}

export class TextContentNavigationFilter extends NavigationFilter {
    constructor(private tagName: string,
                private textContent: string) {
        super();
    }

    applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean {
        return element.textContent === this.textContent && lowercaseElementTagName === this.tagName;
    }
}

export class IdAndTextContentNavigationFilter extends NavigationFilter {
    constructor(private tagName: string,
                private id: string,
                private textContent: string) {
        super();
    }

    applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean {
        return element.id === this.id
            && element.textContent === this.textContent
            && lowercaseElementTagName === this.tagName;
    }

}