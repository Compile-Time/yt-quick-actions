import {HtmlParentNavigator} from "../../src/html-navigation/html-parent-navigator";
import {TagNavigationFilter} from "../../src/html-navigation/filter/navigation-filter";

describe('HtmlParentNavigator', () => {
    it('should return the parent element filtered for', () => {
        const div = document.createElement('div');
        const unorderedList = document.createElement('ul');
        const list = document.createElement('li');

        div.appendChild(unorderedList);
        unorderedList.appendChild(list);

        const foundDiv = HtmlParentNavigator.startFrom(list)
            .find(new TagNavigationFilter('div'));

        expect(foundDiv).toEqual(div);
    });
})