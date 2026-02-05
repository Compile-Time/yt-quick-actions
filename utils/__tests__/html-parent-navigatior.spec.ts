// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';
import { TagNavigationFilter } from '@/utils/html-navigation/filter/navigation-filter';
import { Browser } from 'happy-dom';

describe('HtmlParentNavigator', () => {
  it('should return the parent element filtered for', () => {
    const browser = new Browser();
    const page = browser.newPage();
    page.content = `
      <div id="parent">
        <ul>
          <li id="child"></li>
        </ul>
      </div>
    `;

    const div = page.mainFrame.document.getElementById('parent') as unknown as HTMLElement;
    const list = page.mainFrame.document.getElementById('child') as unknown as HTMLElement;

    const foundDiv = HtmlParentNavigator.startFrom(list).find(new TagNavigationFilter('div')).consume();

    expect(foundDiv).toEqual(div);
  });
});
