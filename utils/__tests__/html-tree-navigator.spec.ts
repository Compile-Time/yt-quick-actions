// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { Tags } from '@/utils/html-element-processing/element-data';
import { Browser } from 'happy-dom';

describe('HtmlTreeNavigator', () => {
  it('should return a child div when navigating from a parent div', () => {
    const browser = new Browser();
    const page = browser.newPage();
    page.content = `
      <div id="div1">
        <div id="div2"></div>
      </div>
    `;

    const div = page.mainFrame.document.getElementById('div1') as unknown as HTMLElement;
    const div2 = page.mainFrame.document.getElementById('div2') as unknown as HTMLElement;

    const elements = HtmlTreeNavigator.startFrom(div)
      .findAll(new TagNavigationFilter('div'))
      .map((result) => result.consume());

    expect(elements).toEqual([div2]);
  });

  it('should return no element when filters do not match', () => {
    const browser = new Browser();
    const page = browser.newPage();
    page.content = `
      <div id="div1">
        <div id="div2"></div>
      </div>
    `;

    const div = page.mainFrame.document.getElementById('div1') as unknown as HTMLElement;

    const elements = HtmlTreeNavigator.startFrom(div)
      .findAll(new TagNavigationFilter('span'))
      .map((result) => result.consume());

    expect(elements).toEqual([]);
  });

  it('should return multiple elements if target is not unique', () => {
    const browser = new Browser();
    const page = browser.newPage();
    page.content = `
      <div id="root-container">
        <div id="div1"></div>
        <div id="div2"></div>
        <div id="div3"></div>
      </div>
    `;

    const rootContainer = page.mainFrame.document.getElementById('root-container') as unknown as HTMLElement;
    const div1 = page.mainFrame.document.getElementById('div1') as unknown as HTMLElement;
    const div2 = page.mainFrame.document.getElementById('div2') as unknown as HTMLElement;
    const div3 = page.mainFrame.document.getElementById('div3') as unknown as HTMLElement;

    const elements = HtmlTreeNavigator.startFrom(rootContainer)
      .findAll(new TagNavigationFilter('div'))
      .map((result) => result.consume());

    expect(elements).toEqual([div1, div2, div3]);
  });

  it('should return a single element even when multiple similar paths exist', () => {
    const browser = new Browser();
    const page = browser.newPage();
    page.content = `
      <div id="root-container">
        <div id="div1">
          <svg id="svg1">
            <g><path d="M10 10"></path></g>
          </svg>
        </div>
        <div id="div2">
          <svg id="svg2">
            <g><path id="path2" d="M20 20"></path></g>
          </svg>
        </div>
        <div id="div3">
          <svg id="svg3">
            <g><path d="M30 30"></path></g>
          </svg>
        </div>
      </div>
    `;

    const rootContainer = page.mainFrame.document.getElementById('root-container') as unknown as HTMLElement;
    const path2 = page.mainFrame.document.getElementById('path2') as unknown as HTMLElement;

    const elements = HtmlTreeNavigator.startFrom(rootContainer)
      .findAll(new SvgDrawPathNavigationFilter('M20 20'))
      .map((result) => result.consume());

    expect(elements).toEqual([path2]);
  });

  it('should return the element whose path matches the most with the given filters', () => {
    const browser = new Browser();
    const page = browser.newPage();
    page.content = `
      <div id="root-container">
        <div id="div1">
          <button id="button1">
            <svg id="svg1">
              <g><path id="path1" d="M10 10"></path></g>
            </svg>
          </button>
        </div>
        <div id="div2"><button></button></div>
        <div id="div3"><button></button></div>
      </div>
    `;

    const rootContainer = page.mainFrame.document.getElementById('root-container') as unknown as HTMLElement;
    const path1 = page.mainFrame.document.getElementById('path1') as unknown as HTMLElement;

    const elements = HtmlTreeNavigator.startFrom(rootContainer)
      .filter(new TagNavigationFilter(Tags.BUTTON))
      .findAll(new SvgDrawPathNavigationFilter('M10 10'))
      .map((result) => result.consume());

    expect(elements).toEqual([path1]);
  });

  it(
    'should return the element whose path matches the most with the given filters even if it is not the' +
      ' last element in the tree',
    () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.content = `
        <div id="root-container">
          <div id="div1">
            <button id="button1">
              <span>Span1</span>
            </button>
          </div>
          <div id="div2"><button></button></div>
          <div id="div3"><button></button></div>
        </div>
      `;

      const rootContainer = page.mainFrame.document.getElementById('root-container') as unknown as HTMLElement;
      const button1 = page.mainFrame.document.getElementById('button1') as unknown as HTMLElement;

      const elements = HtmlTreeNavigator.startFrom(rootContainer)
        .filter(new TagNavigationFilter(Tags.DIV))
        .findAll(new IdNavigationFilter('button', 'button1'))
        .map((result) => result.consume());

      expect(elements).toEqual([button1]);
    },
  );
});
