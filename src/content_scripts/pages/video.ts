import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {LogProvider} from "../../logging/log-provider";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {OneshotObserver} from "../../data/oneshot-observer";
import {
    TimeoutElementExistsWatcher
} from "../../html-element-processing/element-watcher/timeout-element-exists-watcher";

const createdElements: HTMLElement[] = [];
const logger = contentLogProvider.getLogger(LogProvider.VIDEO);

/*
Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 */
const saveToFullScreenPopupReadyObserver = new MutationObserver((mutations, observer) => {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));

    // It is assumed that the first entry of the playlist popup is the watch later playlist because YouTube places
    // it at the first position. Sadly, there is no better way to determine the "Watch later" playlist.
    const watchLaterMenuEntry = HtmlTreeNavigator.startFrom(popupContainer)
        .filter(new IdNavigationFilter(Tags.DIV, Ids.PLAYLISTS))
        .findFirst(new IdNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.LABEL));

    watchLaterMenuEntry.click();

    const popupCloseButton = HtmlTreeNavigator.startFrom(popupContainer)
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
});

/*
Wait for the more options popup to be ready and then delegate to the normal "Save to" click process.
 */
const saveToHalfScreenObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const ytdMenuServiceItemRenderer = mutation.target as HTMLElement;

        TimeoutElementExistsWatcher.build()
            .queryFn(() => {
                const popupTrigger = HtmlTreeNavigator.startFrom(ytdMenuServiceItemRenderer)
                    .findFirstToParentNavigator(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_SAVE))
                    .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM));
                return {popupTrigger: popupTrigger};
            })
            // Delay the start to prevent an accidental click of other actions, such as "Transcript" or "Clip".
            .startDelayed(200)
            .then(elementWatcherResult => {
                const popupTrigger = elementWatcherResult.popupTrigger;
                if (mutation.oldValue === ''
                    && ytdMenuServiceItemRenderer.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
                    && !!popupTrigger) {
                    clickSaveToWatchLaterOption(popupTrigger);
                    observer.disconnect();
                }
            });
        // Logging the "not found" code path causes to many false positives because the "found" code path might
        // resolve to an element. This also applies to the mutation observer solutions in other content scripts as well.
    }
});

/**
 * Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 *
 * @param popupTrigger - The HTML element which triggers the "Save to" pop up
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
 * {@link clickSaveToWatchLaterOption} via {@link saveToHalfScreenObserver}.
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
    });

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
            .filter(new TagNavigationFilter(Tags.YT_ICON))
            .findFirstToParentNavigator(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_SAVE))
            .find(new TagNavigationFilter(Tags.BUTTON));

        if (saveButton) {
            clickSaveToWatchLaterOption(saveButton);
        } else {
            clickSaveToWatchLaterOptionForHalfScreenSize(moreOptionsButton);
        }
    };

    return quickActionsWatchLater;
}

function initContentScript(moreOptionsButton: HTMLElement): void {
    // Remove existing buttons otherwise duplicates are present on the page.
    createdElements.forEach(element => element.remove());
    const quickActionsWatchLater = setupWatchLaterButton(moreOptionsButton);

    // For some reason the parent of the found button in the yt-button-shape is a yt-icon-button ...
    const firstMoreOptionsHtmlTag = HtmlParentNavigator.startFrom(moreOptionsButton)
        .find(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
    firstMoreOptionsHtmlTag.parentElement.insertBefore(quickActionsWatchLater, firstMoreOptionsHtmlTag);
}

function getMoreOptionsButton(): HTMLElement {
    return HtmlTreeNavigator.startFrom(document.body)
        .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
        .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
        .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
        .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
        .filter(new IdNavigationFilter(Tags.YT_BUTTON_SHAPE, Ids.BUTTON_SHAPE))
        .findFirstToParentNavigator(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_MORE_ACTIONS))
        .find(new TagNavigationFilter(Tags.BUTTON));
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
