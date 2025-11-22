import { HtmlParentNavigator } from './html-parent-navigator';
import { HtmlTreeNavigator } from './html-tree-navigator';

export class HtmlFindResult {
  constructor(private element: HTMLElement | null) {}

  static noResult(): HtmlFindResult {
    return new HtmlFindResult(null);
  }

  consume(): HTMLElement | null {
    return this.element;
  }

  exists(): boolean {
    return !!this.element;
  }

  notExists(): boolean {
    return !this.exists();
  }

  intoParentNavigator(jumpUp: boolean = false): HtmlParentNavigator {
    if (jumpUp) {
      return HtmlParentNavigator.startFrom(this.element!.parentElement);
    }
    return HtmlParentNavigator.startFrom(this.element);
  }

  intoTreeNavigator(): HtmlTreeNavigator {
    return HtmlTreeNavigator.startFrom(this.element);
  }
}
