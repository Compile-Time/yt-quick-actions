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
import {MutationSummary} from "mutation-summary";

const logger = contentLogProvider.getLogger(LogProvider.HOME_PAGE);

let saveToWatchLaterEntryObserver: OneshotObserver;
let homePageVideosLoadingObserver: PageObserver;

function setupWatchLaterButtonIfNotPresent(videoMenuButton: HTMLElement): void {
    const divDismissible = HtmlParentNavigator.startFrom(videoMenuButton)
        .find(new IdNavigationFilter(Tags.DIV, Ids.DISMISSIBLE))
        .consume();
    // Set position relative so when 'position: absolute' is used in our elements the position of
    // divDismissible is used as the position context.
    divDismissible.setAttribute('style', 'position: relative')

    if (HtmlTreeNavigator.startFrom(divDismissible)
        .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_HOME_WATCH_LATER))
        .notExists()) {
        divDismissible.appendChild(createWatchLaterButton(videoMenuButton).completeHtmlElement);
    }
}

function createWatchLaterButton(videoMenuButton: HTMLElement): QaButtonInContainer {
    const watchLaterButton = QaHtmlElements.watchLaterHomeVideoButton();
    watchLaterButton.buttonElement.onclick = () => {
        contentScriptObserversManager.upsertOneshotObserver(saveToWatchLaterEntryObserver).observe();
        videoMenuButton.click();
    };
    return watchLaterButton;
}

/**
 * Initialize a {@link OneshotObserver} with a {@link MutationSummary} that watches the more options popup of a home
 * page video and clicks the "Save to Watch Later" menu.
 *
 * The created {@link MutationSummary} watches for changes in YouTube's popup container and clicks the "Save To
 * Watch Later" entry when it appears.
 *
 * @param ytdPopupContainer - A YouTube ytd-popup-container HTML element that should be watched for changes
 */
function initSaveToWatchLaterEntryObserver(ytdPopupContainer: Node): void {
    saveToWatchLaterEntryObserver = new OneshotObserver(
        OneshotObserverId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
        disconnectFn => {
            const summary = new MutationSummary({
                callback: summaries => {
                    summaries[0].removed
                        .map(ytdMenuServiceItemRenderer => ytdMenuServiceItemRenderer as HTMLElement)
                        .filter(
                            ytdMenuServiceItemRenderer => HtmlTreeNavigator.startFrom(ytdMenuServiceItemRenderer)
                                .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.WATCH_LATER))
                                .exists()
                        )
                        // Only a single element should match the above filter.
                        .forEach(watchLaterMenuEntry => {
                            disconnectFn();
                            watchLaterMenuEntry.click();
                        });
                },
                rootNode: ytdPopupContainer,
                queries: [
                    {attribute: 'hidden'}
                ]
            });
            summary.disconnect();
            return summary;
        }
    );
}

/**
 * Initialize a {@link PageObserver} with a {@link MutationSummary} that watches the home page for new videos being
 * loaded.
 *
 * The created {@link MutationSummary} watches for the appearance of new video grid rows to add a Quick Action watch
 * later button to it.
 *
 * @param divContainerForYtdRichGridRows - A div element containing YouTube's ytd-rich-grid-row elements
 */
function initHomePageVideosLoadingObserverNew(divContainerForYtdRichGridRows: Node): void {
    homePageVideosLoadingObserver = new PageObserver(
        () => {
            const summary = new MutationSummary({
                callback: summaries => {
                    if (summaries[0].added.length > 0) {
                        summaries[0].added
                            .map(ytIconButton => ytIconButton as HTMLElement)
                            .filter(ytIconButton =>
                                HtmlParentNavigator.startFrom(ytIconButton)
                                    .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_MEDIA))
                                    .exists()
                            )
                            .forEach(moreOptionsButton => setupWatchLaterButtonIfNotPresent(moreOptionsButton));
                    }
                },
                rootNode: divContainerForYtdRichGridRows,
                queries: [
                    // Do not use the yt-icon-element here. For some reason a click on a yt-icon-button gets
                    // propagated to the parent container which causes YouTube to play the video.
                    {element: 'button#button'}
                ]
            });
            summary.disconnect();
            return summary;
        }
    );
}

function initMoreOptionsMenuContent(ytdRichGridRow: HTMLElement): void {
    MutationElementExistsWatcher.build()
        .queryFn(() => {
            const button = HtmlTreeNavigator.startFrom(ytdRichGridRow)
                .filter(new TagNavigationFilter(Tags.YTD_RICH_GRID_MEDIA))
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.BUTTON))
                .consume();
            return {button: button};
        })
        .observeFn(notStartedObserver => {
            contentScriptObserversManager.upsertOneshotObserver(new OneshotObserver(OneshotObserverId.HOME_PAGE_MENU_UPDATED_OBSERVER,
                () => notStartedObserver,
                {
                    targetNode: ytdRichGridRow,
                    initOptions: {
                        childList: true, subtree: true
                    }
                })).observe()
        })
        .start()
        .then(elementWatcherResult => {
            const button = elementWatcherResult.button as HTMLElement;
            button.click();
            button.click();
        });
}

function initContentScript(ytdRichGridRows: HTMLElement[]): void {
    const firstYtdRichGridRow = ytdRichGridRows[0];
    const divForYtdRichGridRows = firstYtdRichGridRow.parentElement;

    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
        .consume();

    if (!popupContainer) {
        logger.error('Could not find popup container');
        return;
    }

    initSaveToWatchLaterEntryObserver(popupContainer);
    initHomePageVideosLoadingObserverNew(divForYtdRichGridRows);
    initMoreOptionsMenuContent(firstYtdRichGridRow);

    contentScriptObserversManager.addBackgroundObserver(homePageVideosLoadingObserver).observe();
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
