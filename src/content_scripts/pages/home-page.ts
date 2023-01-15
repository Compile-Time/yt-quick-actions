import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {AttributeNames, Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
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
    // FIXME: For some reason the watch later button propagates the click to the home page video causing it to be
    //  added to watch later and to navigate to the video page. It is not an issue with the overlapping div element
    //  created by the extension, as changing pointer-events to auto still causes the button to propagate the event.
    const watchLaterButton = QaHtmlElements.watchLaterHomeVideoButton();
    watchLaterButton.buttonElement.onclick = () => {
        contentScriptObserversManager.upsertOneshotObserver(saveToWatchLaterEntryObserver).observe();
        videoMenuButton.click();
    };
    return watchLaterButton;
}

function initSaveToWatchLaterEntryObserver(rootNode: Node): void {
    saveToWatchLaterEntryObserver = new OneshotObserver(
        OneshotObserverId.SAVE_TO_WATCH_LATER_POPUP_ENTRY,
        disconnectFn => {
            const summary = new MutationSummary({
                callback: summaries => {
                    const watchLaterSvgPaths: HTMLElement[] = summaries[0].added
                        .filter(addedNode => addedNode.nodeName.toLowerCase() === 'path')
                        .map(pathNode => pathNode as HTMLElement)
                        .filter(pathElement => pathElement.getAttribute(AttributeNames.D) === SVG_DRAW_PATH.WATCH_LATER);

                    if (watchLaterSvgPaths.length > 0) {
                        // The "More Options" popup is rendered for the first time -> Relevant SVG is loaded in at some point.
                        disconnectFn();

                        // There should be only one watch later menu entry.
                        HtmlParentNavigator.startFrom(watchLaterSvgPaths[0])
                            .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
                            .consume()
                            .click();
                    } else if (summaries[1].removed.length > 0) {
                        // The "More Options" popup was already rendered once -> Find the relevant entry by the
                        // hidden attribute being removed.
                        summaries[1].removed
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
                    }
                },
                rootNode: rootNode,
                queries: [
                    {all: true},
                    {attribute: 'hidden'}
                ]
            });
            summary.disconnect();
            return summary;
        }
    );
}

function initHomePageVideosLoadingObserverNew(rootNode: Node): void {
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
                rootNode: rootNode,
                queries: [
                    {element: 'yt-icon-button#button'}
                ]
            });
            summary.disconnect();
            return summary;
        }
    );
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
