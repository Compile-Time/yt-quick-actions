import {Ids, Tags} from "./element-data";

export class QaButtonInContainer {
    constructor(public completeHtmlElement: HTMLElement,
                public buttonElement: HTMLButtonElement) {
    }
}

export class YtQuickActionsElements {
    static removeButton(): HTMLButtonElement {
        const button = document.createElement(Tags.BUTTON);
        button.id = Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON;
        button.innerHTML = `<i class="fa-solid fa-trash fa-lg"></i>`;
        button.setAttribute('class', 'qa-btn');
        return button;
    }

    static watchLaterUnderVideoButton(): HTMLButtonElement {
        const button = document.createElement(Tags.BUTTON);
        button.id = Ids.YT_QUICK_ACTIONS_VIDEO_WATCH_LATER;
        button.innerHTML = `<i class="fa-solid fa-clock fa-lg"></i>`
        button.setAttribute('class', 'qa-btn qa-btn-pill');
        return button;
    }

    static watchLaterHomeVideoButton(): QaButtonInContainer {
        const flexContainer = document.createElement('div');
        flexContainer.id = Ids.QA_FLEX_CONTAINER;
        flexContainer.setAttribute('class', 'qa-home-watch-later');

        const button = document.createElement(Tags.BUTTON);
        button.id = Ids.YT_QUICK_ACTIONS_HOME_WATCH_LATER;
        button.innerHTML = `<i class="fa-solid fa-clock fa-lg"></i>`
        button.setAttribute('class', 'qa-btn');

        flexContainer.append(button);
        return new QaButtonInContainer(flexContainer, button);
    }
}