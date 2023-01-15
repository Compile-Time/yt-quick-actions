import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {QaButtonInContainer, QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver, PageObserver} from "../../observation/observer-types";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {LogProvider} from "../../logging/log-provider";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";

const logger = contentLogProvider.getLogger(LogProvider.HOME_PAGE);

/*
Observer to wait for the "Save to Watch later" option to update for the relevant video.
 */
const saveToWatchLaterPopupEntryReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const ytdMenuServiceItemRenderer: HTMLElement = mutation.target as HTMLElement;
        if (ytdMenuServiceItemRenderer.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
            && mutation.oldValue === '') {
            const watchLaterMenuEntry = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
                .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
                .filter(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
                .filter(new TagNavigationFilter(Tags.YT_ICON))
                .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.WATCH_LATER))
                .intoParentNavigator()
                .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
                .consume();

            if (watchLaterMenuEntry) {
                watchLaterMenuEntry.click();
            } else {
                logger.error('Could not find watch later button to click');
            }

            observer.disconnect();
        }
    }
});

/*
  Click the menu button on the first home page video to initialize the popup menu. If this is not done, then the
   first press on a Quick Action element will only open the popup.
 */
const firstHomePageVideoMenuClickObserver = new MutationObserver((mutations, observer) => {
    if (mutations.length > 0) {
        const homePageVideoMoreOptionsButton = mutations[0].target as HTMLElement;
        const ytdRichGridRow = HtmlParentNavigator.startFrom(homePageVideoMoreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));

        if (homePageVideoMoreOptionsButton.nodeName.toLowerCase() === Tags.BUTTON && !!ytdRichGridRow) {
            homePageVideoMoreOptionsButton.click();
            homePageVideoMoreOptionsButton.click();
            observer.disconnect();
        }
    }
});

/*
Home page videos are lazily loaded on scrolling, therefore, we need to observe them. Disconnect is handled
 by the ActiveObserversManager and url-change-watcher background script when switching to a different page
  on YouTube.
 */
const homePageVideosLoadingObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        const homePageVideoMoreOptionsButton = mutation.target as HTMLElement;
        const ytdRichGridRow = HtmlParentNavigator.startFrom(homePageVideoMoreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));

        if (homePageVideoMoreOptionsButton.nodeName.toLowerCase() === Tags.BUTTON && !!ytdRichGridRow) {
            const menuButton = homePageVideoMoreOptionsButton as HTMLButtonElement;
            const divDismissible = HtmlParentNavigator.startFrom(menuButton)
                .find(new IdNavigationFilter(Tags.DIV, Ids.DISMISSIBLE))
                .consume();
            // Set position relative so when 'position: absolute' is used in our elements the position of
            // divDismissible is used as the position context.
            divDismissible.setAttribute('style', 'position: relative')

            const existingWatchLaterButton = HtmlTreeNavigator.startFrom(divDismissible)
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_HOME_WATCH_LATER))
                .consume();
            if (!existingWatchLaterButton) {
                divDismissible.append(setupWatchLaterButton(menuButton).completeHtmlElement);
            }
        }
    }
});

function setupWatchLaterButton(videoMenuButton: HTMLElement): QaButtonInContainer {
    const watchLaterButton = QaHtmlElements.watchLaterHomeVideoButton();
    watchLaterButton.buttonElement.onclick = () => {
        videoMenuButton.click();
        const popupContainer = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
            .consume();

        if (!popupContainer) {
            logger.error('Could not find popup container');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotObserverId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
            () => saveToWatchLaterPopupEntryReadyObserver,
            {
                targetNode: popupContainer,
                initOptions: {
                    subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
                }
            }
        )).observe();
    };

    return watchLaterButton;
}

function initContentScript(ytdRichGridRows: HTMLElement[]): void {
    const firstYtdRichGridRow = ytdRichGridRows[0];
    const divForYtdRichGridRows = firstYtdRichGridRow.parentElement;

    contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
        OneshotObserverId.HOME_PAGE_MENU_UPDATED_OBSERVER,
        () => firstHomePageVideoMenuClickObserver,
        {
            targetNode: divForYtdRichGridRows,
            initOptions: {
                subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['aria-label']
            }
        }
    )).observe();

    contentScriptObserversManager.addBackgroundObserver(new PageObserver(() => homePageVideosLoadingObserver, {
        targetNode: divForYtdRichGridRows,
        initOptions: {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['aria-label']
        }
    })).observe();
}

export function runHomePageScriptIfTargetElementExists(): void {
    logger.debug('Watch for first home page video grid row');
    MutationElementExistsWatcher.build()
        .queryFn(() => {
            const ytdRichGridRows = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_APP))
                .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
                .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
                .findAll(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW))
                .map(result => result.consume());
            return {ytdRichGridRows: ytdRichGridRows};
        })
        .observeFn(
            observer =>
                contentScriptObserversManager.addBackgroundObserver(new PageObserver(() => observer, {
                    targetNode: document.body,
                    initOptions: {
                        childList: true, subtree: true
                    }
                })).observe()
        )
        .start()
        .then(elementWatcherResult => {
            logger.debug('First video grid row was found!');
            const ytdRichGridRows = elementWatcherResult.ytdRichGridRows as HTMLElement[];
            if (ytdRichGridRows.length > 0) {
                initContentScript(ytdRichGridRows);
            } else {
                logger.error('Could not find home page video grid rows');
            }
        })
        .catch(err => logger.error(err));
}
