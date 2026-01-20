// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { HtmlFindResult } from '@/utils/html-navigation/html-find-result';

describe('HtmlFindResult', () => {
  describe('exists', () => {
    it('should return true when element exists', () => {
      const element = document.createElement('div');
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
