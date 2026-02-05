// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { Browser } from 'happy-dom';
import {
  homeItemHtml,
  homeRowShortsSectionItemHtml,
  homeRowTopicsSectionHtml,
} from '@/utils/__tests__/page-logic/dom-samples';
import { delay, first, Subject } from 'rxjs';
import { testIfWatchLaterButtonShouldBeCreated } from '@/utils/page-logic/home';

import { CurrentPage } from '@/utils/types/current-page';

class MockNodeList<T extends Node> implements NodeList {
  readonly nodes: T[] = [];
  readonly length: number;

  constructor(nodes: T[]) {
    this.nodes = nodes;
    this.length = nodes.length;
  }

  [index: number]: T;

  item(index: number): T | null {
    return this.nodes[index] ?? null;
  }

  forEach(callbackfn: (value: Node, key: number, parent: NodeList) => void, thisArg?: unknown): void {
    this.nodes.forEach((nodeValue, nodeKey) => callbackfn(nodeValue, nodeKey, this));
  }

  toString(): string {
    return this.nodes.toString();
  }

  toLocaleString(): string {
    return this.nodes.toLocaleString();
  }

  valueOf(): object {
    return this.nodes.valueOf();
  }

  hasOwnProperty(v: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(this, v);
  }

  isPrototypeOf(v: object): boolean {
    return Object.prototype.isPrototypeOf.call(this, v);
  }

  propertyIsEnumerable(v: PropertyKey): boolean {
    return Object.prototype.propertyIsEnumerable.call(this, v);
  }

  [Symbol.iterator](): ArrayIterator<Node> {
    return this.nodes[Symbol.iterator]();
  }

  entries(): ArrayIterator<[number, Node]> {
    return this.nodes.entries();
  }

  keys(): ArrayIterator<number> {
    return this.nodes.keys();
  }

  values(): ArrayIterator<Node> {
    return this.nodes.values();
  }
}

describe('Home page', () => {
  describe('Create watch later button', () => {
    it(
      'should create the watch later button for the common home item div',
      { timeout: 3000 },
      () =>
        new Promise<void>((done) => {
          const browser = new Browser();
          const page = browser.newPage();
          page.url = 'https://www.youtube.com/';
          page.content = homeItemHtml;

          const mutationDiv = page.mainFrame.document.getElementsByName('test-setup-name')[0] as unknown as Node;
          const nodeList = new MockNodeList([
            page.mainFrame.document.getElementsByName('test-setup-name')[0] as unknown as Node,
          ]);

          const subject = new Subject<[MutationRecord, CurrentPage]>();
          subject.pipe(first(), testIfWatchLaterButtonShouldBeCreated()).subscribe(([mutation]) => {
            expect(mutation).toBeTruthy();
            expect(mutation.addedNodes.length).toBe(1);

            const div = mutation.addedNodes.item(0) as HTMLElement;
            expect(div.nodeName).toBe('DIV');
            expect(div.id).toBe('content');

            done();
          });

          subject.next([
            {
              addedNodes: nodeList,
              target: mutationDiv,
              type: 'childList',
              oldValue: null,
              attributeName: null,
              attributeNamespace: null,
              nextSibling: null,
              previousSibling: null,
              removedNodes: new MockNodeList([]),
            },
            CurrentPage.HOME,
          ]);
        }),
    );

    it('should not create the watch later button for shorts inside a section', () =>
      new Promise<void>((done, fail) => {
        const browser = new Browser();
        const page = browser.newPage();
        page.content = homeRowShortsSectionItemHtml;

        const subject = new Subject<[MutationRecord, CurrentPage]>();
        subject.pipe(first(), testIfWatchLaterButtonShouldBeCreated()).subscribe(() => {
          fail('Mutation passes the filters which should not happen!');
        });
        subject.pipe(first(), delay(2000)).subscribe(([mutation]) => {
          expect(mutation).toBeTruthy();
          done();
        });

        const mutationDiv = page.mainFrame.document.getElementsByName('test-setup-name')[0] as unknown as Node;
        const nodeList = new MockNodeList([
          page.mainFrame.document.getElementsByName('test-setup-name')[0] as unknown as Node,
        ]);
        subject.next([
          {
            addedNodes: nodeList,
            target: mutationDiv,
            type: 'childList',
            oldValue: null,
            attributeName: null,
            attributeNamespace: null,
            nextSibling: null,
            previousSibling: null,
            removedNodes: new MockNodeList([]),
          },
          CurrentPage.HOME,
        ]);
      }));

    it(
      'should create the watch later button for the section home item div',
      { timeout: 3000 },
      () =>
        new Promise<void>((done) => {
          const browser = new Browser();
          const page = browser.newPage();
          page.content = homeRowTopicsSectionHtml;

          const subject = new Subject<[MutationRecord, CurrentPage]>();
          subject.pipe(first(), testIfWatchLaterButtonShouldBeCreated()).subscribe(([mutation]) => {
            expect(mutation).toBeTruthy();
            expect(mutation.addedNodes.length).toBe(1);

            const div = mutation.addedNodes.item(0) as HTMLElement;
            expect(div.nodeName).toBe('DIV');
            expect(div.id).toBe('content');

            done();
          });

          const mutationDiv = page.mainFrame.document.getElementsByName('test-setup-name')[0] as unknown as Node;
          const nodeList = new MockNodeList([
            page.mainFrame.document.getElementsByName('test-setup-name')[0] as unknown as Node,
          ]);
          subject.next([
            {
              addedNodes: nodeList,
              target: mutationDiv as unknown as Node,
              type: 'childList',
              oldValue: null,
              attributeName: null,
              attributeNamespace: null,
              nextSibling: null,
              previousSibling: null,
              removedNodes: new MockNodeList([]),
            },
            CurrentPage.HOME,
          ]);
        }),
    );
  });
});
