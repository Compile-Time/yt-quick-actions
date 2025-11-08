import { NavigationFilter } from './filter/navigation-filter';
import { HtmlFindResult } from './html-find-result';

export class HtmlParentNavigator {
  private constructor(private element: HTMLElement | null) {}

  static startFrom(element: HTMLElement | null): HtmlParentNavigator {
    return new HtmlParentNavigator(element);
  }

  find(filter: NavigationFilter): HtmlFindResult {
    if (!this.element) {
      return HtmlFindResult.noResult();
    }

    return new HtmlFindResult(this.navigateToParent(this.element, filter));
  }

  private navigateToParent(element: HTMLElement | null, filter: NavigationFilter): HTMLElement | null {
    const foundElement = filter.applySingle(element);

    if (foundElement) {
      return foundElement;
    } else {
      return !element?.parentElement ? null : this.navigateToParent(element.parentElement, filter);
    }
  }
}
