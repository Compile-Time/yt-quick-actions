import {Tags} from "../html-element-processing/element-data";

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

    protected lowercaseEquals(normalString: string, lowercaseString: string): boolean {
        return normalString.toLowerCase() === lowercaseString;
    }

    protected lowercaseContains(normalString: string, lowercaseString: string) {
        return normalString.toLowerCase().includes(lowercaseString);
    }

    abstract equals(other: NavigationFilter): boolean;

    protected abstract applyCondition(element: HTMLElement): boolean;

}

export class IdNavigationFilter extends NavigationFilter {
    constructor(private readonly tagName: string,
                private readonly id: string) {
        super();
    }

    applyCondition(element: HTMLElement): boolean {
        return element.id === this.id
            && this.lowercaseEquals(element.tagName, this.tagName);
    }

    equals(other: IdNavigationFilter): boolean {
        return this.tagName === other.tagName
            && this.id === other.id;
    }
}


export class TagNavigationFilter extends NavigationFilter {
    constructor(private readonly tagName: string) {
        super();
    }

    applyCondition(element: HTMLElement): boolean {
        return this.lowercaseEquals(element.tagName, this.tagName);
    }

    equals(other: TagNavigationFilter): boolean {
        return this.tagName === other.tagName;
    }
}

export class SvgDrawPathNavigationFilter extends NavigationFilter {
    private static readonly DRAW_PATH = 'd';

    constructor(private readonly drawPath: string) {
        super();
    }

    protected applyCondition(element: HTMLElement): boolean {
        return this.lowercaseEquals(element.tagName, Tags.PATH)
            && element.getAttribute(SvgDrawPathNavigationFilter.DRAW_PATH) === this.drawPath;
    }

    equals(other: SvgDrawPathNavigationFilter): boolean {
        return this.drawPath === other.drawPath;
    }
}