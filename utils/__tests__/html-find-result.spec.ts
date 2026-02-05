// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { HtmlFindResult } from '@/utils/html-navigation/html-find-result';
import { Browser } from 'happy-dom';

describe('HtmlFindResult', () => {
  describe('exists', () => {
    it('should return true when element exists', () => {
      const browser = new Browser();
      const page = browser.newPage();
      page.content = '<div id="test"></div>';
      const element = page.mainFrame.document.getElementById('test') as unknown as HTMLElement;

      const result = new HtmlFindResult(element);
      expect(result.exists()).toBeTruthy();
    });

    const notExistsElements: unknown[] = [null, undefined];
    notExistsElements.forEach((element) => {
      it(`should return false when element is ${element}`, () => {
        const result = new HtmlFindResult(element as HTMLElement);
        expect(result.exists()).toBeFalsy();
      });
    });
  });
});
