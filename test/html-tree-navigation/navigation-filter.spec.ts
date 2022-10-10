import {
    IdAndTextContentNavigationFilter,
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "../../src/html-tree-navigation/navigation-filter";

function createDocument(): HTMLCollection {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const span2 = document.createElement('span');
    const span2duplicate = document.createElement('span');
    const p = document.createElement('p');
    const i = document.createElement('i');

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

    return div.children;
}

describe('NavigationFilter', () => {

    describe('TagNavigationFilter', () => {
        it('should filter HTMLCollection by tag', () => {
            const filter = new TagNavigationFilter('p');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(htmlCollection[2]);
        })

        it('should filter single HTMLElement', () => {
            const filter = new TagNavigationFilter('p');
            const htmlElement = document.createElement('p');

            const result: Element = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });

    describe('IdNavigationFilter', () => {
        it('should filter HTMLCollection by id and tag', () => {
            const filter = new IdNavigationFilter('i', 'image');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(htmlCollection[1]);
        })

        it('should filter single HTMLElement', () => {
            const filter = new TagNavigationFilter('p');
            const htmlElement = document.createElement('p');

            const result: Element = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });

    describe('TextContentNavigationFilter', () => {
        it('should filter HTMLCollection by tag and text content', () => {
            const filter = new TextContentNavigationFilter('span', 'span');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(htmlCollection[0]);
        })

        it('should filter single HTMLElement', () => {
            const filter = new TagNavigationFilter('p');
            const htmlElement = document.createElement('p');

            const result: Element = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });

    describe('IdAndTextContentNavigationFilter', () => {
        it('should filter HTMLCollection by tag and text content', () => {
            const filter = new IdAndTextContentNavigationFilter('span', 'span2', 'span2');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(htmlCollection[3]);
        })

        it('should filter single HTMLElement', () => {
            const filter = new TagNavigationFilter('p');
            const htmlElement = document.createElement('p');

            const result: Element = filter.applySingle(htmlElement);
            expect(result).toEqual(htmlElement);
        })
    });
});
