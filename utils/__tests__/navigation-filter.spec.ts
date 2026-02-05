// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import {
  AnyFilter,
  AttributeNavigationFilter,
  AttributesNavigationFilter,
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { Browser } from 'happy-dom';

const DEFAULT_PAGE_HTML = `
<html><body>
  <div id="div">
    <span id="span" class="hello world test">span</span>
    <span id="span2">span2</span>
    <p id="paragraph">paragraph</p>
    <i id="image">image</i>
    <span id="span2dup">span2duplicate</span>
  </div>
</body></html>
`;

describe('NavigationFilter', () => {
  describe('TagNavigationFilter', () => {
    it('should filter HTMLCollection by tag', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new TagNavigationFilter('p');
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('paragraph');
    });

    it('should filter single HTMLElement', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = `
        <html><body>
          <p id="paragraph">paragraph</p>
        </body></html>
      `;

      const filter = new TagNavigationFilter('p');
      const htmlElement = page.mainFrame.document.body.children[0] as unknown as HTMLElement;

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe('IdNavigationFilter', () => {
    it('should filter HTMLCollection by id and tag', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new IdNavigationFilter('i', 'image');
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('image');
    });

    it('should filter single HTMLElement', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = `
        <html><body>
          <p id="paragraph">paragraph</p>
        </body></html>
      `;

      const filter = new IdNavigationFilter('p', 'paragraph');
      const htmlElement = page.mainFrame.document.body.children[0] as unknown as HTMLElement;

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe('SvgDrawPathNavigationFilter', () => {
    it('should filter HTML collection by tag and svg draw path', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = `
        <html><body>
          <path id="path" d="M 10 10"></path>
        </body></html>
      `;

      const filter = new SvgDrawPathNavigationFilter('M 10 10');
      const htmlCollection = page.mainFrame.document.body.children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('path');
    });

    it('should filter single HTMLElement', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = `
        <html><body>
          <path id="path" d="M 10 10"></path>
        </body></html>
      `;

      const filter = new SvgDrawPathNavigationFilter('M 10 10');
      const path: HTMLElement = page.mainFrame.document.body.children[0] as unknown as HTMLElement;

      const result = filter.applySingle(path);
      expect(result).toEqual(path);
    });
  });

  describe('AttributeNavigationFilter', () => {
    it('should filter HTMLCollection by tag and attribute name', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new AttributeNavigationFilter('span', 'id');
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(3);
      expect(result[0].id).toEqual('span');
      expect(result[1].id).toEqual('span2');
      expect(result[2].id).toEqual('span2dup');
    });

    it('should filter HTMLCollection by tag and attribute name and value', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new AttributeNavigationFilter('span', 'id', 'span2');
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('span2');
    });

    it('should filter single HTMLElement', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = `
        <html><body>
          <div data-test="true"></div>
        </body></html>
      `;

      const filter = new AttributeNavigationFilter('div', 'data-test', 'true');
      const htmlElement: HTMLElement = page.mainFrame.document.body.children[0] as unknown as HTMLElement;

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe('AttributesNavigationFilter', () => {
    it('should filter HTMLCollection by multiple attributes', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new AttributesNavigationFilter('span', { id: 'span', class: 'test' });
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('span');
    });

    it('should filter HTMLCollection by id', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new AttributesNavigationFilter('span', { id: 'span' });
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('span');
    });

    it('should filter HTMLCollection by class even if there are multiple classes', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = DEFAULT_PAGE_HTML;

      const filter = new AttributesNavigationFilter('span', { class: 'test' });
      const htmlCollection = page.mainFrame.document.body.children[0].children as unknown as HTMLCollection;

      const result: HTMLElement[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual('span');
    });
  });

  describe('AnyFilter', () => {
    it('should be empty for draw path not present in filter', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = '<html><body></body></html>';

      const anyFilter = new AnyFilter([
        new SvgDrawPathNavigationFilter('M 10 10'),
        new SvgDrawPathNavigationFilter('M 20 20'),
        new SvgDrawPathNavigationFilter('M 30 30'),
      ]);

      const body = page.mainFrame.document.body;
      const result: HTMLElement[] = anyFilter.apply(body.children as unknown as HTMLCollection);
      expect(result.length).toEqual(0);
      expect(result[0]).toBeUndefined();
    });

    it('should find multiple svg elements matching filter', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.url = 'https://example.com';
      page.content = `
        <html><body>
          <path id="path1" d="M 10 10"></path>
          <path id="path2" d="M 20 20"></path>
        </body></html>
      `;

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
