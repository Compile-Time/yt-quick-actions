import {HtmlTreeNavigator, NavigationFilter} from "../../src/html-tree-navigation/html-tree-navigator";

describe('HtmlTreeNavigator', () => {
    it('should return the only element present on matching filters', () => {
        const div = document.createElement('div');
        div.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        div.appendChild(div2);

        const elements: Element[] = HtmlTreeNavigator.navigate(div)
            .filter(NavigationFilter.of('div'))
            .find();

        expect(elements.length).toEqual(1);
        expect(elements).toEqual([div2]);
    });

    it('should return no element when filters do not match', () => {
        const div = document.createElement('div');
        div.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        div.appendChild(div2);

        const elements: Element[] = HtmlTreeNavigator.navigate(div)
            .filter(NavigationFilter.of('span'))
            .find();

        expect(elements).toEqual([]);
    });

    it('should return multiple elements if target is not unique', () => {
        const rootContainer = document.createElement('div');
        rootContainer.id = 'root-container';

        const div1 = document.createElement('div');
        div1.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        const div3 = document.createElement('div');
        div3.id = 'div3';

        rootContainer.appendChild(div1);
        rootContainer.appendChild(div2);
        rootContainer.appendChild(div3);

        const elements: Element[] = HtmlTreeNavigator.navigate(rootContainer)
            .filter(NavigationFilter.of('div'))
            .find();

        expect(elements.length).toEqual(3);
        expect(elements).toEqual([div1, div2, div3]);
    });

    it('should return single element when multiple similar paths exist', () => {
        const rootContainer = document.createElement('div');
        rootContainer.id = 'root-container';

        const div1 = document.createElement('div');
        div1.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        const div3 = document.createElement('div');
        div3.id = 'div3';

        const span1 = document.createElement('span');
        span1.textContent = 'Span1';
        const span2 = document.createElement('span');
        span2.textContent = 'Span2';
        const span3 = document.createElement('span');
        span3.textContent = 'Span3';

        div1.appendChild(span1);
        div2.appendChild(span2);
        div3.appendChild(span3);

        rootContainer.appendChild(div1);
        rootContainer.appendChild(div2);
        rootContainer.appendChild(div3);

        const elements: Element[] = HtmlTreeNavigator.navigate(rootContainer)
            .filter(NavigationFilter.of('div'))
            .filter(NavigationFilter.of('span'))
            .find();

        expect(elements.length).toEqual(3);
        expect(elements).toEqual([div1, div2, div3]);
    });
});