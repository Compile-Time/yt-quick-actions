import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "../../src/html-tree-navigation/navigation-filter";

function createDocument(): HTMLCollection {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const p = document.createElement('p');
    const i = document.createElement('i');

    span.id = 'span';
    span.textContent = 'span';
    i.id = 'image';
    p.id = 'paragraph';

    div.appendChild(span);
    div.appendChild(i);
    div.appendChild(p);

    return div.children;
}

describe('NavigationFilter', () => {
    describe('TagNavigationFilter', () => {
        it('should filter by tag', () => {
            const filter = new TagNavigationFilter('p');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result[0]).toEqual(htmlCollection[2]);
        })
    });

    describe('IdNavigationFilter', () => {
        it('should filter by id and tag', () => {
            const filter = new IdNavigationFilter('i', 'image');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result[0]).toEqual(htmlCollection[1]);
        })
    });

    describe('TextContentNavigationFilter', () => {
        it('should filter by tag and text content', () => {
            const filter = new TextContentNavigationFilter('span', 'span');
            const htmlCollection = createDocument();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result[0]).toEqual(htmlCollection[0]);
        })
    });
});
