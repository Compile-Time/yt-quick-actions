import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "../../html-navigation/navigation-filter";
import {Ids, Tags, TextContent} from "../../html-element-processing/element-data";
import {YtQuickActionsElements} from "../../html-element-processing/yt-quick-action-elements";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver} from "../../data/oneshot-observer";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {ElementExistsWatcher} from "../../html-element-processing/element-exists-watcher";
import {contentLogProvider, contentScriptObserversManager} from "../init-extension";
import {LogProvider} from "../../logging/log-provider";

const logger = contentLogProvider.getLogger(LogProvider.HOME_PAGE);

/*
Observer to wait for the "Save to Watch later" option to update for the relevant video.
 */
const saveToWatchLaterPopupEntryReadyObserver = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        const target = mutation.target;
        if (target.nodeName.toLowerCase() === Tags.YTD_MENU_SERVICE_ITEM_RENDERER
            && mutation.oldValue === '') {
            const watchLaterButton = HtmlTreeNavigator.startFrom(document.body)
                .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
                .findFirst(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.SAVE_TO_WATCH_LATER));

            if (watchLaterButton) {
                watchLaterButton.click();
            } else {
                logger.error('Could not find watch later button to click');
            }

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
        const target = mutation.target as HTMLElement;
        const ytdRichGridRow = HtmlParentNavigator.startFrom(target)
            .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));

        if (target.nodeName.toLowerCase() === Tags.BUTTON && !!ytdRichGridRow) {
            const menuButton = target as HTMLButtonElement;
            const divMenu = HtmlParentNavigator.startFrom(menuButton)
                .find(new IdNavigationFilter(Tags.DIV, Ids.MENU));

            const divDetails = divMenu.parentElement;
            const existingWatchLaterButton = HtmlTreeNavigator.startFrom(divDetails)
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_HOME_WATCH_LATER));
            if (!existingWatchLaterButton) {
                divDetails.insertBefore(setupWatchLaterButton(menuButton), divMenu);
            }
        }
    }
});

function setupWatchLaterButton(videoMenuButton: HTMLElement): HTMLButtonElement {
    const watchLaterButton = YtQuickActionsElements.watchLaterHomeVideoButton();
    watchLaterButton.onclick = () => {
        videoMenuButton.click();
        const popupContainer = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));

        if (!popupContainer) {
            logger.error('Could not find popup container');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(
            OneshotObserverId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
            saveToWatchLaterPopupEntryReadyObserver
        )).observe(popupContainer, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden']
        })
    };

    return watchLaterButton;
}

function initContentScript(homePageVideos: HTMLElement[]): void {
    const firstHomePageVideo = homePageVideos[0];
    const divContents = firstHomePageVideo.parentElement;

    contentScriptObserversManager.addBackgroundObserver(homePageVideosLoadingObserver)
        .observe(divContents, {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['aria-label']
        })
}

export function runHomePageScriptIfTargetElementExists(): void {
    logger.debug('Watch for first home page video grid row');
    ElementExistsWatcher.build()
        .queryFn(() =>
            HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_APP))
                .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
                .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
                .findFirst(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW))
        )
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(observer)
                .observe(document.body, {
                    childList: true,
                    subtree: true
                })
        )
        .run()
        .then(() => {
            logger.debug('First video grid row was found!');
            const homePageVideoGridRows = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_APP))
                .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
                .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
                .findAll(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));
            if (homePageVideoGridRows.length > 0) {
                initContentScript(homePageVideoGridRows);
            } else {
                logger.error('Could not find home page video grid rows');
            }
        });
}
