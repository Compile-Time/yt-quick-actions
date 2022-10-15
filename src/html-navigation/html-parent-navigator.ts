import {NavigationFilter} from "./navigation-filter";

export class HtmlParentNavigator {
    private debug: boolean = false;

    private constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlParentNavigator {
        return new HtmlParentNavigator(element)
    }

    debugNavigation(): HtmlParentNavigator {
        this.debug = true;
        return this;
    }

    find(filter: NavigationFilter): HTMLElement | undefined {
        return this.navigateToParent(this.element, filter);
    }

    private navigateToParent(element: HTMLElement, filter: NavigationFilter): HTMLElement | undefined {
        const foundElement = filter.applySingle(element);

        if (this.debug) {
            console.debug(`Found the following element for filter ${filter}: ${foundElement.tagName}`)
        }

        if (!foundElement && !element.parentElement) {
            return undefined;
        }

        return !!foundElement ? foundElement : this.navigateToParent(element.parentElement, filter);
    }

}