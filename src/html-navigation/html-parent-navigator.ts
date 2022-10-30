import {NavigationFilter} from "./navigation-filter";

export class HtmlParentNavigator {
    private constructor(private element: HTMLElement) {
    }

    static startFrom(element: HTMLElement): HtmlParentNavigator {
        return new HtmlParentNavigator(element)
    }

    find(filter: NavigationFilter): HTMLElement | null {
        return this.navigateToParent(this.element, filter);
    }

    private navigateToParent(element: HTMLElement, filter: NavigationFilter): HTMLElement | null {
        const foundElement = filter.applySingle(element);

        if (!foundElement && !element.parentElement) {
            return null;
        }

        return !!foundElement ? foundElement : this.navigateToParent(element.parentElement, filter);
    }

}