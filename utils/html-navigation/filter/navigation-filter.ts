import { AttributeNames, Tags } from '../../html-element-processing/element-data';

export abstract class NavigationFilter {
  apply(htmlCollection: HTMLCollection): HTMLElement[] {
    const filteredElements: HTMLElement[] = [];
    for (let i = 0; i < htmlCollection.length; i++) {
      const childNode = htmlCollection.item(i);
      if (!childNode) {
        continue;
      }
      const element: HTMLElement = childNode as unknown as HTMLElement;

      if (this.applyCondition(element)) {
        filteredElements.push(element);
      }
    }

    return filteredElements;
  }

  applySingle(element: HTMLElement | null): HTMLElement | null {
    return this.applyCondition(element) ? element : null;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  abstract equals(other: NavigationFilter): boolean;

  protected lowercaseEquals(stringA: string, stringB: string): boolean {
    return stringA.toLowerCase() === stringB.toLowerCase();
  }

  protected lowercaseContains(normalString: string, lowercaseString: string) {
    return normalString.toLowerCase().includes(lowercaseString);
  }

  protected abstract applyCondition(element: HTMLElement | null): boolean;
}

export class IdNavigationFilter extends NavigationFilter {
  constructor(
    private readonly tagName: string,
    private readonly id: string,
  ) {
    super();
  }

  applyCondition(element: HTMLElement): boolean {
    return element.id === this.id && this.lowercaseEquals(element.tagName, this.tagName);
  }

  equals(other: IdNavigationFilter): boolean {
    return this.tagName === other.tagName && this.id === other.id;
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
  constructor(private readonly drawPath: string) {
    super();
  }

  equals(other: SvgDrawPathNavigationFilter): boolean {
    return this.drawPath === other.drawPath;
  }

  protected applyCondition(element: HTMLElement): boolean {
    return this.lowercaseEquals(element.tagName, Tags.PATH) && element.getAttribute(AttributeNames.D) === this.drawPath;
  }
}

export class AnyFilter<T extends NavigationFilter> extends NavigationFilter {
  constructor(private readonly filterList: T[]) {
    super();
  }

  equals(other: AnyFilter<T>): boolean {
    return other.filterList.every((filter) => this.filterList.includes(filter));
  }

  protected applyCondition(element: HTMLElement): boolean {
    return this.filterList.some((filter) => !!filter.applySingle(element));
  }
}

export class TextNavigationFilter extends NavigationFilter {
  constructor(
    private readonly tag: string,
    private readonly text: string,
  ) {
    super();
  }

  protected applyCondition(element: HTMLElement): boolean {
    return (
      element.tagName === this.tag.toUpperCase() && element.textContent?.toLowerCase().includes(this.text.toLowerCase())
    );
  }

  equals(other: TextNavigationFilter): boolean {
    return other.text === this.text;
  }
}
