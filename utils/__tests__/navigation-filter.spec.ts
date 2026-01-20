// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import {
  AnyFilter,
  AttributeNavigationFilter,
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { Browser } from 'happy-dom';

class FakeHtmlCollection<T extends Element> implements HTMLCollection {
  elements: T[];

  [index: number]: Element;

  readonly length: number;

  constructor(elements: T[]) {
    this.elements = elements;
    this.length = elements.length;
  }

  [Symbol.iterator](): ArrayIterator<Element> {
    return this.elements.values();
  }

  item(index: number): T | null {
    return this.elements[index];
  }

  namedItem(name: string): T | null {
    return null;
  }
}

class FakeDocument {
  private elementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();

  getHtmlCollection(): HTMLCollection {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const span2 = document.createElement('span');
    const span2duplicate = document.createElement('span');
    const p = document.createElement('p');
    const i = document.createElement('i');

    div.id = 'div';

    span.id = 'span';
    span.textContent = 'span';

    span2.id = 'span2';
    span2.textContent = 'span2';

    span2duplicate.id = 'span2';
    span2duplicate.textContent = 'span2duplicate';

    i.id = 'image';
    p.id = 'paragraph';

    div.appendChild(span);
    div.appendChild(i);
    div.appendChild(p);
    div.appendChild(span2);
    div.appendChild(span2duplicate);

    this.elementMap.set(div.id, div);
    this.elementMap.set(span.id, span);
    this.elementMap.set(span2.id, span2);
    this.elementMap.set('span2dup', span2duplicate);
    this.elementMap.set(p.id, p);
    this.elementMap.set(i.id, i);

    return div.children;
  }

  getSvg(drawPath = 'M 10 10'): HTMLCollection {
    return this.getSvgAsElement(drawPath).children;
  }

  getSvgAsElement(drawPath = 'M 10 10', svgId = 'svg', pathId = 'path'): HTMLElement {
    const svg = document.createElement('svg');
    const path = document.createElement('path');

    svg.id = svgId;

    path.id = pathId;
    path.setAttribute('d', drawPath);

    svg.appendChild(path);

    this.elementMap.set(svg.id, svg);
    this.elementMap.set(path.id, path);

    return svg;
  }

  getElementById(id: string): HTMLElement | undefined {
    return this.elementMap.get(id);
  }
}

describe('NavigationFilter', () => {
  describe('TagNavigationFilter', () => {
    it('should filter HTMLCollection by tag', () => {
      const fakeDocument = new FakeDocument();

      const filter = new TagNavigationFilter('p');
      const htmlCollection = fakeDocument.getHtmlCollection();

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(fakeDocument.getElementById('paragraph'));
    });

    it('should filter single HTMLElement', () => {
      const fakeDocument = new FakeDocument();

      const filter = new TagNavigationFilter('p');
      const htmlElement: HTMLElement = document.createElement('p');

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe('IdNavigationFilter', () => {
    it('should filter HTMLCollection by id and tag', () => {
      const fakeDocument = new FakeDocument();

      const filter = new IdNavigationFilter('i', 'image');
      const htmlCollection = fakeDocument.getHtmlCollection();

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(fakeDocument.getElementById('image'));
    });

    it('should filter single HTMLElement', () => {
      const fakeDocument = new FakeDocument();

      const filter = new IdNavigationFilter('p', 'paragraph');
      const htmlElement: HTMLElement = document.createElement('p');
      htmlElement.id = 'paragraph';

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe('SvgDrawPathNavigationFilter', () => {
    it('should filter HTML collection by tag and svg draw path', () => {
      const fakeDocument = new FakeDocument();

      const filter = new SvgDrawPathNavigationFilter('M 10 10');
      const htmlCollection = fakeDocument.getSvg();

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(fakeDocument.getElementById('path'));
    });

    it('should filter single HTMLElement', () => {
      const fakeDocument = new FakeDocument();

      const filter = new SvgDrawPathNavigationFilter('M 10 10');
      const path: HTMLElement = document.createElement('path');

      path.id = 'path';
      path.setAttribute('d', 'M 10 10');

      const result = filter.applySingle(path);
      expect(result).toEqual(path);
    });
  });

  describe('AttributeNavigationFilter', () => {
    it('should filter HTMLCollection by tag and attribute name', () => {
      const fakeDocument = new FakeDocument();

      const filter = new AttributeNavigationFilter('span', 'id');
      const htmlCollection = fakeDocument.getHtmlCollection();

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(fakeDocument.getElementById('span'));
      expect(result[1]).toEqual(fakeDocument.getElementById('span2'));
      expect(result[2]).toEqual(fakeDocument.getElementById('span2dup'));
    });

    it('should filter HTMLCollection by tag and attribute name and value', () => {
      const fakeDocument = new FakeDocument();

      const filter = new AttributeNavigationFilter('span', 'id', 'span2');
      const htmlCollection = fakeDocument.getHtmlCollection();

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(fakeDocument.getElementById('span2'));
      expect(result[1]).toEqual(fakeDocument.getElementById('span2dup'));
    });

    it('should filter single HTMLElement', () => {
      const fakeDocument = new FakeDocument();

      const filter = new AttributeNavigationFilter('div', 'data-test', 'true');
      const htmlElement: HTMLElement = document.createElement('div');
      htmlElement.setAttribute('data-test', 'true');

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe('AnyFilter', () => {
    it('should be empty for draw path not present in filter', () => {
      const fakeDocument = new FakeDocument();

      const anyFilter = new AnyFilter([
        new SvgDrawPathNavigationFilter('M 10 10'),
        new SvgDrawPathNavigationFilter('M 20 20'),
        new SvgDrawPathNavigationFilter('M 30 30'),
      ]);
      const htmlCollection = fakeDocument.getSvg('M 40 40');

      const result: HTMLElement[] = anyFilter.apply(htmlCollection);
      expect(result.length).toEqual(0);
      expect(result[0]).toBeUndefined();
    });

    it('should find multiple svg elements matching filter', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content =
        '<html><body>' +
        '<path id="path1" d="M 10 10"></path>' +
        '<path id="path2" d="M 20 20"></path>' +
        '</body></html>';

      const anyFilter = new AnyFilter([
        new SvgDrawPathNavigationFilter('M 10 10'),
        new SvgDrawPathNavigationFilter('M 20 20'),
        new SvgDrawPathNavigationFilter('M 30 30'),
      ]);

      const body = page.mainFrame.document.body;
      const result: HTMLElement[] = anyFilter.apply(body.children as unknown as HTMLCollection);
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('path1');
      expect(result[1].id).toEqual('path2');

      browser.close().then();
    });
  });
});
