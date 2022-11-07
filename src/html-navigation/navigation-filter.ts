export abstract class NavigationFilter {
    apply(htmlCollection: HTMLCollection): HTMLElement[] {
        const filteredElements: HTMLElement[] = [];
        for (let i = 0; i < htmlCollection.length; i++) {
            const element: HTMLElement = htmlCollection[i] as HTMLElement;

            if (this.applyCondition(element)) {
                filteredElements.push(element)
            }
        }

        return filteredElements;
    }

    applySingle(element: HTMLElement): HTMLElement | undefined {
        return this.applyCondition(element) ? element : undefined;
    }

    toString(): string {
        return JSON.stringify(this);
    }

    abstract equals(other: NavigationFilter): boolean;

    protected abstract applyCondition(element: HTMLElement): boolean;

}

export class IdNavigationFilter extends NavigationFilter {
    constructor(private readonly tagName: string,
                private readonly id: string) {
        super();
        this.tagName = tagName.toUpperCase();
    }

    applyCondition(element: HTMLElement): boolean {
        return element.id === this.id && element.tagName === this.tagName;
    }

    equals(other: IdNavigationFilter): boolean {
        return this.tagName === other.tagName
            && this.id === other.id;
    }
}


export class TagNavigationFilter extends NavigationFilter {
    constructor(private readonly tagName: string) {
        super();
        this.tagName = tagName.toUpperCase();
    }

    applyCondition(element: HTMLElement): boolean {
        return element.tagName === this.tagName;
    }

    equals(other: TagNavigationFilter): boolean {
        return this.tagName === other.tagName;
    }
}

export class TextContentNavigationFilter extends NavigationFilter {
    constructor(protected readonly tagName: string,
                protected readonly textContent: string) {
        super();
        this.tagName = tagName.toUpperCase();
    }

    applyCondition(element: HTMLElement): boolean {
        return element.textContent === this.textContent && element.tagName === this.tagName;
    }

    equals(other: TextContentNavigationFilter): boolean {
        return this.textContent === other.textContent
            && this.tagName === other.tagName;
    }
}

export class TextContentContainsNavigationFilter extends TextContentNavigationFilter {
    constructor(protected readonly tagName: string,
                protected readonly textContent: string) {
        super(tagName, textContent);
    }


    applyCondition(element: HTMLElement): boolean {
        return !!element.textContent
            && element.textContent.toLowerCase().includes(this.textContent.toLowerCase())
            && element.tagName === this.tagName;
    }
}

export class IdAndTextContentNavigationFilter extends NavigationFilter {
    constructor(private readonly tagName: string,
                private readonly id: string,
                private readonly textContent: string) {
        super();
        this.tagName = tagName.toUpperCase();
    }

    applyCondition(element: HTMLElement): boolean {
        return element.id === this.id
            && element.textContent === this.textContent
            && element.tagName === this.tagName;
    }

    equals(other: IdAndTextContentNavigationFilter): boolean {
        return this.id === other.id
            && this.textContent === other.textContent
            && this.tagName === other.tagName;
    }
}