import {
    IdAndTextContentNavigationFilter,
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentContainsNavigationFilter,
    TextContentNavigationFilter
} from "../../src/html-navigation/navigation-filter";

class FakeDocument {
    private elementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    private collection: HTMLCollection;

    constructor() {
        this.setupDocument();
    }

    getHtmlCollection(): HTMLCollection {
        return this.collection;
    }

    getElementById(id: string): HTMLElement {
        return this.elementMap.get(id);
    }

    private setupDocument(): void {
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

        this.collection = div.children;
        this.elementMap.set(div.id, div);
        this.elementMap.set(span.id, span);
        this.elementMap.set(span2.id, span2);
        this.elementMap.set('span2dup', span2duplicate);
        this.elementMap.set(p.id, p);
        this.elementMap.set(i.id, i);
    }
}

describe('NavigationFilter', () => {

    const fakeDocument = new FakeDocument();

    describe('TagNavigationFilter', () => {
        it('should filter HTMLCollection by tag', () => {
            const filter = new TagNavigationFilter('p');
            const htmlCollection = fakeDocument.getHtmlCollection();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(fakeDocument.getElementById('paragraph'));
        })

        it('should filter single HTMLElement', () => {
            const filter = new TagNavigationFilter('p');
            const htmlElement: HTMLElement = document.createElement('p');

            const result = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });

    describe('IdNavigationFilter', () => {
        it('should filter HTMLCollection by id and tag', () => {
            const filter = new IdNavigationFilter('i', 'image');
            const htmlCollection = fakeDocument.getHtmlCollection();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(fakeDocument.getElementById('image'));
        })

        it('should filter single HTMLElement', () => {
            const filter = new IdNavigationFilter('p', 'paragraph');
            const htmlElement: HTMLElement = document.createElement('p');
            htmlElement.id = 'paragraph';

            const result = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });

    describe('TextContentNavigationFilter', () => {
        it('should filter HTMLCollection by tag and text content', () => {
            const filter = new TextContentNavigationFilter('span', 'span');
            const htmlCollection = fakeDocument.getHtmlCollection();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(fakeDocument.getElementById('span'));
        })

        it('should filter single HTMLElement', () => {
            const filter = new TextContentNavigationFilter('span', 'span');
            const htmlElement: HTMLElement = document.createElement('span');
            htmlElement.textContent = 'span';

            const result = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });

    describe('IdAndTextContentNavigationFilter', () => {
        it('should filter HTMLCollection by tag and text content', () => {
            const filter = new IdAndTextContentNavigationFilter('span', 'span2', 'span2');
            const htmlCollection = fakeDocument.getHtmlCollection();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(fakeDocument.getElementById('span2'));
        });

        it('should filter single HTMLElement', () => {
            const filter = new IdAndTextContentNavigationFilter('span', 'span', 'span');
            const htmlElement: HTMLElement = document.createElement('span');
            htmlElement.id = 'span';
            htmlElement.textContent = 'span';

            const result = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        });
    });

    describe('TextContentContainsNavigationFilter', () => {
        it('should filter HTML collection by tag and text content with a contains condition', () => {
            const filter = new TextContentContainsNavigationFilter('span', 'dup');
            const htmlCollection = fakeDocument.getHtmlCollection();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(fakeDocument.getElementById('span2dup'));
        });

        it('should filter single HTMLElement', () => {
            const filter = new TextContentContainsNavigationFilter('span', 'dup');
            const htmlElement: HTMLElement = document.createElement('span');
            htmlElement.id = 'span';
            htmlElement.textContent = 'span dup text';

            const result = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        });
    });
});
