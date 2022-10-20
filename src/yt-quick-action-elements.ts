import {Ids, Tags} from "./html-navigation/element-data";
import {StorageAccessor} from "./storage-accessor";

export class YtQuickActionsElements {
    static removeButton(): HTMLButtonElement {
        const button = document.createElement(Tags.BUTTON);
        button.id = Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON;
        button.innerHTML = `<i class="fa-solid fa-trash fa-lg"></i>`;
        this.setButtonClass(button);
        return button;
    }

    static watchLaterUnderVideoButton(): HTMLButtonElement {
        const button = document.createElement(Tags.BUTTON);
        button.id = Ids.YT_QUICK_ACTIONS_VIDEO_WATCH_LATER;
        button.innerHTML = `<i class="quick-actions-watch-later-under-video-icon fa-solid fa-clock fa-lg"></i>`
        this.setButtonClass(button);
        return button;
    }

    static watchLaterHomeVideoButton(): HTMLButtonElement {
        const button = document.createElement(Tags.BUTTON);
        button.id = Ids.YT_QUICK_ACTIONS_HOME_WATCH_LATER;
        button.innerHTML = `<i class="quick-actions-watch-later-home-icon fa-solid fa-clock fa-lg"></i>`
        this.setButtonClass(button);
        return button;
    }

    private static setButtonClass(button: HTMLButtonElement): void {
        StorageAccessor.getTheme()
            .then(theme => {
                let cssClass = 'quick-actions-button';
                if (!!theme && theme === 'light') {
                    cssClass = 'quick-actions-button-light'
                } else if (!!theme && theme === 'dark') {
                    cssClass = 'quick-actions-button-dark'
                }
                button.setAttribute('class', cssClass);
            });
    }
}