import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {AttributeNames, Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
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
import {MutationSummary} from "mutation-summary";

const createdElements: HTMLElement[] = [];
const logger = contentLogProvider.getLogger(LogProvider.VIDEO);

/**
 * Wait for the "Save to" popup to be ready and then check the "Watch later" entry.
 *
 * @param popupTrigger - The HTML element which triggers the "Save to" pop up
 */
function clickSaveToWatchLaterOption(popupTrigger: HTMLElement): void {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
        .consume();

    if (!popupContainer) {
        logger.error('Could not find popup container for full screen size');
        return;
    }

    const ms = new MutationSummary({
        callback: summaries => {
            logger.debug('popup summaries', summaries);
            const popupCloseSvgPaths: HTMLElement[] = summaries[0].added
                .filter(addedNode => addedNode.nodeName.toLowerCase() === 'path')
                .map(pathNode => pathNode as HTMLElement)
                .filter(pathElement => pathElement.getAttribute(AttributeNames.D) === SVG_DRAW_PATH.POPUP_CLOSE);

            if (popupCloseSvgPaths.length > 0) {
                // The "Save To" popup is rendered for the first time -> The close button SVG is rendered in at some
                // point.
                ms.disconnect();

                const closePopupButton = HtmlParentNavigator.startFrom(popupCloseSvgPaths[0])
                    .find(new IdNavigationFilter(Tags.BUTTON, Ids.BUTTON))
                    .consume();
                const watchLaterCheckboxEntry = HtmlParentNavigator.startFrom(closePopupButton)
                    .find(new TagNavigationFilter(Tags.YTD_ADD_TO_PLAYLIST_RENDERER))
                    .intoTreeNavigator()
                    .filter(new IdNavigationFilter(Tags.DIV, Ids.PLAYLISTS))
                    .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER))
                    .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_CHECKBOX, Ids.CHECKBOX))
                    .consume();

                watchLaterCheckboxEntry.click();
                closePopupButton.click();
            } else if (summaries[1].removed.length > 0) {
                // The "Save To" popup was already opened -> 'aria-hidden' attribute should be removed from the
                // popup itself.
                summaries[1].removed
                    .map(tpYtPaperDialog => tpYtPaperDialog as HTMLElement)
                    .filter(
                        removedFromElement => !!HtmlTreeNavigator.startFrom(removedFromElement)
                            .findFirst(new TagNavigationFilter(Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER))
                            .consume()
                    )
                    .forEach(tpYtPaperDialog => {
                        ms.disconnect();

                        const watchLaterCheckboxEntry = HtmlTreeNavigator.startFrom(tpYtPaperDialog)
                            .filter(new IdNavigationFilter(Tags.DIV, Ids.PLAYLISTS))
                            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER))
                            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_CHECKBOX, Ids.CHECKBOX))
                            .consume();
                        watchLaterCheckboxEntry.click()

                        const closePopupButton = HtmlTreeNavigator.startFrom(tpYtPaperDialog)
                            .filter(new IdNavigationFilter(Tags.DIV, Ids.HEADER))
                            .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.BUTTON))
                            .consume();
                        closePopupButton.click();
                    });
            }
        },
        rootNode: popupContainer,
        queries: [
            {all: true},
            {attribute: 'aria-hidden'}
        ]
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
        .consume();

    if (!popupContainer) {
        logger.error('Could not find popup container for half screen size');
        return;
    }

    const ms = new MutationSummary({
        callback: summaries => {
            const saveSvgPaths: HTMLElement[] = summaries[0].added
                .filter(addedNode => addedNode.nodeName.toLowerCase() === 'path')
                .map(pathNode => pathNode as HTMLElement)
                .filter(pathElement => pathElement.getAttribute(AttributeNames.D) === SVG_DRAW_PATH.VIDEO_SAVE);

            if (saveSvgPaths.length > 0) {
                // The "More Options" popup is rendered for the first time -> SVG is loaded in at some point.
                ms.disconnect();

                const saveMenuEntry = HtmlParentNavigator.startFrom(saveSvgPaths[0])
                    .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
                    .consume();
                logger.debug('click from svg');
                clickSaveToWatchLaterOption(saveMenuEntry);
            } else if (summaries[1].removed.length > 0) {
                // The "More Options" popup was already opened -> 'hidden' attribute should be removed from entries
                // that will be displayed.
                summaries[1].removed
                    .map(ytdMenuServiceItemRenderer => ytdMenuServiceItemRenderer as HTMLElement)
                    .filter(
                        removedFromElement => !!HtmlTreeNavigator.startFrom(removedFromElement)
                            .filter(new TagNavigationFilter(Tags.YT_ICON))
                            .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_SAVE))
                            .consume()
                    )
                    .forEach(ytdMenuServiceItemRenderer => {
                        ms.disconnect();

                        logger.debug('click from attribute');
                        clickSaveToWatchLaterOption(ytdMenuServiceItemRenderer);
                    });
            }
        },
        rootNode: popupContainer,
        queries: [
            {all: true},
            {attribute: 'hidden'}
        ]
    });

    moreOptionsButton.click();
}

function setupWatchLaterButton(moreOptionsButton: HTMLElement): HTMLButtonElement {
    const quickActionsWatchLater = QaHtmlElements.watchLaterUnderVideoButton();
    createdElements.push(quickActionsWatchLater);
    quickActionsWatchLater.onclick = () => {
        const ytdMenuRenderer = HtmlParentNavigator.startFrom(moreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .consume();

        if (!ytdMenuRenderer) {
            logger.error('Could not find ytd-menu-renderer as a parent');
            return;
        }

        // On half-screen size this element is hidden in the more options button ("...").
        const saveButton = HtmlTreeNavigator.startFrom(ytdMenuRenderer)
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .filter(new TagNavigationFilter(Tags.YT_ICON))
            .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_SAVE))
            .intoParentNavigator()
            .find(new TagNavigationFilter(Tags.BUTTON))
            .consume();

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
        .consume();
    firstMoreOptionsHtmlTag.parentElement.insertBefore(quickActionsWatchLater, firstMoreOptionsHtmlTag);
}

function getMoreOptionsButton(): HTMLElement {
    return HtmlTreeNavigator.startFrom(document.body)
        .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
        .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
        .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
        .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
        .filter(new IdNavigationFilter(Tags.YT_BUTTON_SHAPE, Ids.BUTTON_SHAPE))
        .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.VIDEO_MORE_ACTIONS))
        .intoParentNavigator()
        .find(new TagNavigationFilter(Tags.BUTTON))
        .consume();
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
        .catch(err => logger.error(err));
}
