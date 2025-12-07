export enum DeduplicationAttribute {
  YT_QUICK_ACTIONS_REMOVE_BUTTON = 'yt-quick-actions-remove-button',
  YT_QUICK_ACTIONS_MOVE_TOP_BUTTOM_BUTTON = 'yt-quick-actions-move-top-button',
}

/**
 * Tracks DOM elements and attributes that have been added to the page's original DOM.
 *
 * The DOM of playlist pages is partially updated when navigating between them. This is due to the nature of YouTube
 * being a single-page application (SPA). If you navigate from the watch later playlist to the like playlist, the
 * entries in the playlist will not be completely replaced. Instead, only the changed parts will be updated in
 * the DOM. This has the annoying side effect that custom added DOM elements will appear on entries that shouldn't have
 * them. It is therefore necessary to manually clean up the custom added DOM elements.
 *
 * Additionally, this adds further complexity to the content script because it needs to react to DOM mutations of
 * attributes to catch the navigation from the like playlist to the watch later playlist. This introduces the issue
 * of duplicate custom DOM elements being added. To prevent this, a data attribute is added to the original DOM to
 * make sure that a custom element is only added once.
 */
export class ElementDeduplicationTracker {
  private addedDomElements: IntegratedContentScriptUi<unknown>[] = [];
  private readonly addedDomAttributes: Map<string, HTMLElement[]> = new Map();

  addDomElement(element: IntegratedContentScriptUi<unknown>): void {
    this.addedDomElements.push(element);
  }

  addDomAttribute(element: HTMLElement, attribute: DeduplicationAttribute): void {
    element.setAttribute(attribute, 'true');
    this.addedDomAttributes.set(attribute, [...(this.addedDomAttributes.get(attribute) ?? []), element]);
  }

  checkForDeduplicationAttribute(element: HTMLElement, attribute: DeduplicationAttribute): boolean {
    return element.getAttribute(attribute) !== null;
  }

  cleanup(): void {
    this.addedDomElements.forEach((element) => element.remove());
    this.addedDomAttributes.forEach((value, key) => value.forEach((v) => v.removeAttribute(key)));
    this.addedDomElements = [];
    this.addedDomAttributes.clear();
  }
}
