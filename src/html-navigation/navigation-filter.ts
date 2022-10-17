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

    applySingle(element: HTMLElement): HTMLElement | undefined {
        return this.applyCondition(element, element.tagName.toLowerCase()) ? element : undefined;
    }

    toString(): string {
        return JSON.stringify(this);
    }

    abstract equals(other: NavigationFilter): boolean;

    protected abstract applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean;

}

export class IdNavigationFilter extends NavigationFilter {
    constructor(private tagName: string,
                private id: string) {
        super();
    }

    applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean {
        return element.id === this.id && lowercaseElementTagName === this.tagName;
    }

    equals(other: IdNavigationFilter): boolean {
        return this.tagName === other.tagName
            && this.id === other.id;
    }
}


export class TagNavigationFilter extends NavigationFilter {
    constructor(private tagName: string) {
        super();
    }

    applyCondition(element: HTMLElement, lowercaseElementTagName: string): boolean {
        return lowercaseElementTagName === this.tagName;
    }

    equals(other: TagNavigationFilter): boolean {
        return this.tagName === other.tagName;
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

    equals(other: TextContentNavigationFilter): boolean {
        return this.textContent === other.textContent
            && this.tagName === other.tagName;
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

    equals(other: IdAndTextContentNavigationFilter): boolean {
        return this.id === other.id
            && this.textContent === other.textContent
            && this.tagName === other.tagName;
    }
}