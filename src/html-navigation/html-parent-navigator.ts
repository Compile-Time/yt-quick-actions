import {NavigationFilter} from "./navigation-filter";

export class HtmlParentNavigator {
    private constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlParentNavigator {
        return new HtmlParentNavigator(element)
    }

    find(filter: NavigationFilter): HTMLElement | undefined {
        return this.navigateToParent(this.element, filter);
    }

    private navigateToParent(element: HTMLElement, filter: NavigationFilter): HTMLElement | undefined {
        const foundElement = filter.applySingle(element);
        if (!foundElement && !element.parentElement) {
            return undefined;
        }

        return !!foundElement ? foundElement : this.navigateToParent(element.parentElement, filter);
    }

}