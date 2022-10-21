import {Ids, Tags} from "./html-navigation/element-data";
import {StorageAccessor} from "./storage-accessor";
import {Theme} from "./enums/theme";

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
                let cssClass;
                switch (theme) {
                    case Theme.LIGHT:
                        cssClass = 'quick-actions-button-light'
                        break;

                    case Theme.DARK:
                        cssClass = 'quick-actions-button-dark'
                        break;

                    default:
                        cssClass = 'quick-actions-button';
                        break;
                }
                button.setAttribute('class', cssClass);
            });
    }
}