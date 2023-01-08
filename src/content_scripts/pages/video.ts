import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {Ids, Tags, TextContent} from "../../html-element-processing/element-data";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentContainsNavigationFilter,
    TextContentNavigationFilter
} from "../../html-navigation/navigation-filter";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {MutationElementExistsWatcher} from "../../html-element-processing/mutation-element-exists-watcher";
import {LogProvider} from "../../logging/log-provider";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {OneshotObserver} from "../../data/oneshot-observer";
import {TimeoutElementExistsWatcher} from "../../html-element-processing/timeout-element-exists-watcher";

const createdElements: HTMLElement[] = [];
const logger = contentLogProvider.getLogger(LogProvider.VIDEO);

/*
Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 */
const saveToFullScreenPopupReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const popupWatchLaterEntry = mutation.target as HTMLElement;
        if (popupWatchLaterEntry.nodeName.toLowerCase() === Tags.YT_FORMATTED_STRING
            && popupWatchLaterEntry.textContent === TextContent.WATCH_LATER
            && popupWatchLaterEntry.id === Ids.LABEL
            && (mutation.oldValue === '' || mutation.oldValue === TextContent.WATCH_LATER)) {

            popupWatchLaterEntry.click();

            const popupCloseButton = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
                .filter(new TagNavigationFilter(Tags.TP_YT_PAPER_DIALOG))
                .filter(new IdNavigationFilter(Tags.DIV, Ids.HEADER))
                .filter(new TagNavigationFilter(Tags.YT_ICON_BUTTON))
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.BUTTON));

            if (popupCloseButton) {
                popupCloseButton.click();
            } else {
                logger.error('Could not find popup close button');
            }

            observer.disconnect();
        }
    }
});

/*
Wait for the more options popup to be ready and then delegate to the normal save to click process.
 */
const saveToHalfScreenObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const target = mutation.target as HTMLElement;
        const popupTrigger = HtmlTreeNavigator.startFrom(target)
            .findFirst(new TextContentContainsNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.SAVE))

        if (mutation.oldValue === ''
            && target.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
            && !!popupTrigger) {
            clickSaveToWatchLaterOption(popupTrigger);
            observer.disconnect();
        }
    }
});

/**
 * Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 *
 * @param popupTrigger - The html element which triggers the "Save to" pop up
 */
function clickSaveToWatchLaterOption(popupTrigger: HTMLElement): void {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));

    if (!popupContainer) {
        logger.error('Could not find popup container for full screen size');
        return;
    }

    contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
        OneshotObserverId.SAVE_TO_FULL_SCREEN_POPUP_READY,
        saveToFullScreenPopupReadyObserver
    )).observe(popupContainer, {
        subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
    });

    popupTrigger.click();
}

/**
 * Wait for the more options popup ("...") to be ready and click the "Save" entry then delegate to
 * {@link clickSaveToWatchLaterOption}.
 *
 * On half-screen sizes some video actions are hidden into the more options button. This includes the
 * "Save" action. Because the "Save" action only exists in either the more options popup or directly under
 * the video both cases need to be handled.
 *
 * @param moreOptionsButton - The HTML element which represents the more options menu ("...")
 */
function clickSaveToWatchLaterOptionForHalfScreenSize(moreOptionsButton: HTMLElement): void {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))

    if (!popupContainer) {
        logger.error('Could not find popup container for half screen size');
        return;
    }

    contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
        OneshotObserverId.SAVE_TO_HALF_SCREEN_POPUP_READY,
        saveToHalfScreenObserver
    )).observe(popupContainer, {
        subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
    })

    moreOptionsButton.click();
}

function setupWatchLaterButton(moreOptionsButton: HTMLElement): HTMLButtonElement {
    const quickActionsWatchLater = QaHtmlElements.watchLaterUnderVideoButton();
    createdElements.push(quickActionsWatchLater);
    quickActionsWatchLater.onclick = () => {
        const ytdMenuRenderer = HtmlParentNavigator.startFrom(moreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_MENU_RENDERER));

        if (!ytdMenuRenderer) {
            logger.error('Could not find ytd-menu-renderer as a parent');
            return;
        }

        // On half-screen size this element is hidden in the more options button ("...").
        const saveButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .findFirst(new TextContentNavigationFilter(Tags.SPAN, TextContent.SAVE));

        if (saveButton) {
            clickSaveToWatchLaterOption(saveButton);
        } else {
            const moreOptionsButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
                .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));

            if (moreOptionsButton) {
                clickSaveToWatchLaterOptionForHalfScreenSize(moreOptionsButton);
            } else {
                logger.error('Could not find HTML elements for action "Save to" or "... > Save"');
            }
        }
    };

    return quickActionsWatchLater;
}

function initContentScript(moreOptionsButton: HTMLElement): void {
    // Remove existing buttons otherwise duplicates are present on the page.
    createdElements.forEach(element => element.remove());
    const quickActionsWatchLater = setupWatchLaterButton(moreOptionsButton);
    moreOptionsButton.parentElement.insertBefore(quickActionsWatchLater, moreOptionsButton);
}

function getMoreOptionsButton(): HTMLElement {
    return HtmlTreeNavigator.startFrom(document.body)
        .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
        .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
        .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
        .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
        .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));
}

export function runVideoScriptIfTargetElementExists(): void {
    logger.debug('Watch for the more options button under a video');
    MutationElementExistsWatcher.build()
        .queryFn(() => ({moreOptions: getMoreOptionsButton()}))
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(observer)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                })
        )
        .start()
        .then(elementWatcherResult => {
            logger.debug(elementWatcherResult);
            const moreOptionsButton = getMoreOptionsButton();
            if (moreOptionsButton) {
                logger.debug('More options button was found!');
                initContentScript(moreOptionsButton);
            } else {
                logger.error('Could not find more options button under video');
            }
        })
}
