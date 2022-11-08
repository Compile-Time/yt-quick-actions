import {NavigationFilter} from "./navigation-filter";

export class HtmlParentNavigator {
    private constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlParentNavigator {
        return new HtmlParentNavigator(element)
    }

    find(filter: NavigationFilter): HTMLElement {
        return this.navigateToParent(this.element, filter);
    }

    private navigateToParent(element: HTMLElement, filter: NavigationFilter): HTMLElement {
        const foundElement = filter.applySingle(element);

        if (foundElement) {
            return foundElement;
        } else {
            return !element.parentElement ? null : this.navigateToParent(element.parentElement, filter);
        }
    }

}