import { NavigationFilter } from "./filter/navigation-filter";
import { HtmlFindResult } from "./html-find-result";

export class HtmlParentNavigator {
  private constructor(private element: HTMLElement) {}

  static startFrom(element: HTMLElement): HtmlParentNavigator {
    return new HtmlParentNavigator(element);
  }

  find(filter: NavigationFilter): HtmlFindResult {
    if (!this.element) {
      return HtmlFindResult.noResult();
    }

    return new HtmlFindResult(this.navigateToParent(this.element, filter));
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
