import {HtmlTreeNavigator} from "../../src/html-navigation/html-tree-navigator";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "../../src/html-navigation/navigation-filter";
import {Tags} from "../../src/html-navigation/element-data";

describe('HtmlTreeNavigator', () => {
    it('should return the only element present on matching filters', () => {
        const div = document.createElement('div');
        div.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        div.appendChild(div2);

        const elements: Element[] = HtmlTreeNavigator.startFrom(div)
            .find(new TagNavigationFilter('div'));

        expect(elements).toEqual([div2]);
    });

    it('should return no element when filters do not match', () => {
        const div = document.createElement('div');
        div.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        div.appendChild(div2);

        const elements: Element[] = HtmlTreeNavigator.startFrom(div)
            .find(new TagNavigationFilter('span'));

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

        const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
            .find(new TagNavigationFilter('div'));

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

        const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
            .find(new TextContentNavigationFilter('span', 'Span2'));

        expect(elements).toEqual([span2]);
    });

    it('should return the element whose path matches the most with the given filters', () => {
        const rootContainer = document.createElement('div');
        rootContainer.id = 'root-container';

        const div1 = document.createElement('div');
        div1.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        const div3 = document.createElement('div');
        div3.id = 'div3';

        const button1 = document.createElement('button');
        const button2 = document.createElement('button');
        const button3 = document.createElement('button');

        const span1 = document.createElement('span');
        span1.textContent = 'Span1';

        button1.appendChild(span1);

        div1.appendChild(button1);
        div2.appendChild(button2);
        div3.appendChild(button3);

        rootContainer.appendChild(div1);
        rootContainer.appendChild(div2);
        rootContainer.appendChild(div3);

        const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
            .filter(new TagNavigationFilter(Tags.BUTTON))
            .find(new TextContentNavigationFilter('span', 'Span1'));

        expect(elements).toEqual([span1]);
    });

    it('should return the element whose path matches the most with the given filters even if it is not the' +
        ' last element in the tree', () => {
        const rootContainer = document.createElement('div');
        rootContainer.id = 'root-container';

        const div1 = document.createElement('div');
        div1.id = 'div1';
        const div2 = document.createElement('div');
        div2.id = 'div2';
        const div3 = document.createElement('div');
        div3.id = 'div3';

        const button1 = document.createElement('button');
        button1.id = 'button1';
        const button2 = document.createElement('button');
        const button3 = document.createElement('button');

        const span1 = document.createElement('span');
        span1.textContent = 'Span1';

        button1.appendChild(span1);

        div1.appendChild(button1);
        div2.appendChild(button2);
        div3.appendChild(button3);

        rootContainer.appendChild(div1);
        rootContainer.appendChild(div2);
        rootContainer.appendChild(div3);

        const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
            .filter(new TagNavigationFilter(Tags.DIV))
            .find(new IdNavigationFilter('button', 'button1'));

        expect(elements).toEqual([button1]);
    });
});