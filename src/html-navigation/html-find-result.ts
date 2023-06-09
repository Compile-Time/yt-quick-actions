import { HtmlParentNavigator } from "./html-parent-navigator";
import { HtmlTreeNavigator } from "./html-tree-navigator";

export class HtmlFindResult {
  constructor(private element: HTMLElement) {}

  static noResult(): HtmlFindResult {
    return new HtmlFindResult(null);
  }

  consume(): HTMLElement {
    return this.element;
  }

  exists(): boolean {
    return !!this.element;
  }

  notExists(): boolean {
    return !this.exists();
  }

  intoParentNavigator(): HtmlParentNavigator {
    return HtmlParentNavigator.startFrom(this.element);
  }

  intoTreeNavigator(): HtmlTreeNavigator {
    return HtmlTreeNavigator.startFrom(this.element);
  }
}
