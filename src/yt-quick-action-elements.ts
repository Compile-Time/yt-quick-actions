import {Ids} from "./html-tree-navigation/element-data";

export class YtQuickActionsElements {
    static removeButton(): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON;
        button.innerHTML = `<i class="remove-button-icon fa-solid fa-trash fa-lg"></i>`;
        button.setAttribute('class', 'remove-button');
        return button;
    }
}