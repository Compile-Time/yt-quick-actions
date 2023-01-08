import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../src/html-navigation/filter/navigation-filter";

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

    getSvg(): HTMLCollection {
        const svg = document.createElement('svg');
        const path = document.createElement('path');

        svg.id = 'svg';

        path.id = 'path';
        path.setAttribute('d', 'M 10 10');

        svg.appendChild(path);

        this.elementMap.set(svg.id, svg);
        this.elementMap.set(path.id, path);

        return svg.children;
    }

    getElementById(id: string): HTMLElement {
        return this.elementMap.get(id);
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

    describe('SvgDrawPathNavigationFilter', () => {
        it('should filter HTML collection by tag and svg draw path', () => {
            const filter = new SvgDrawPathNavigationFilter('M 10 10');
            const htmlCollection = fakeDocument.getSvg();

            const result: Element[] = filter.apply(htmlCollection);
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(fakeDocument.getElementById('path'));
        });

        it('should filter single HTMLElement', () => {
            const filter = new SvgDrawPathNavigationFilter('M 10 10');
            const path: HTMLElement = document.createElement('path');

            path.id = 'path';
            path.setAttribute('d', 'M 10 10');

            const result = filter.applySingle(path);
            expect(result).toEqual(path);
        });
    });
});
