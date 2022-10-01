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
        expect(elements[0].id).toEqual('div2');
    });

    xit('should return no element when filters do not match', () => {

    });
});