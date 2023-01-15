import {AttributeNames, Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver, PageObserver} from "../../observation/observer-types";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";
import {LogProvider} from "../../logging/log-provider";
import {MutationSummary} from "mutation-summary";

const logger = contentLogProvider.getLogger(LogProvider.PLAYLIST);

let playlistMutationSummary: MutationSummary;
let moreOptionsMenuObserver: OneshotObserver;

/*
Register an observer to add the remove button to new playlist items loaded afterwards. This only
 occurs in long playlists.
 */
const playlistLoadingNewEntriesObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(mutation.target as HTMLElement)
            .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
            .consume();

        if (!ytdPlaylistVideoRenderer) {
            logger.error('Could not find ytd-playlist-video-renderer from mutation target');
            return;
        }

        const moreOptionsButton = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
            .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
            .consume();

        if (!moreOptionsButton) {
            logger.error('Could not find yt-icon-button (more options) in ytd-playlist-video-renderer');
            return;
        }

        setupRemoveButtonIfNotPresent(moreOptionsButton, ytdPlaylistVideoRenderer);
    }
});

function setupRemoveButton(moreOptionsMenu: HTMLElement, ytdPlaylistVideoRenderer: HTMLElement): void {
    const removeButton = QaHtmlElements.removeButton();
    removeButton.onclick = () => {
        clickRemoveMenuEntryInMoreOptionsMenu(moreOptionsMenu);
    }
    ytdPlaylistVideoRenderer.append(removeButton);
}

function setupRemoveButtonIfNotPresent(moreOptionsButton: HTMLElement, ytdPlaylistVideoRenderer: HTMLElement): void {
    const existingRemoveButton: HTMLElement = HtmlTreeNavigator.startFrom(ytdPlaylistVideoRenderer)
        .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON))
        .consume();
    if (!!ytdPlaylistVideoRenderer && !existingRemoveButton) {
        setupRemoveButton(moreOptionsButton, ytdPlaylistVideoRenderer);
    }
}

function initMoreOptionsMenuMutationSummary(ytdPopupContainer: Node): void {
    moreOptionsMenuObserver = new OneshotObserver(
        OneshotObserverId.PLAYLIST_MENU_UPDATED_OBSERVER,
        disconnectFn => {
            const summary = new MutationSummary({
                callback: summaries => {
                    const removeSvgPaths: HTMLElement[] = summaries[0].added
                        .filter(addedNode => addedNode.nodeName.toLowerCase() === 'path')
                        .map(pathNode => pathNode as HTMLElement)
                        .filter(pathElement => pathElement.getAttribute(AttributeNames.D) === SVG_DRAW_PATH.TRASH_ICON);

                    if (removeSvgPaths.length > 0) {
                        // The "More Options" popup is rendered for the first time -> Relevant SVG is loaded in at some point.
                        disconnectFn();

                        // There should be only one remove menu entry.
                        HtmlParentNavigator.startFrom(removeSvgPaths[0])
                            .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
                            .consume()
                            .click();
                    } else if (summaries[1].removed.length > 0) {
                        // The "More Options" popup was already rendered once -> Find the relevant entry by the
                        // hidden attribute being removed.
                        summaries[1].removed
                            .map(ytdMenuServiceItem => ytdMenuServiceItem as HTMLElement)
                            .filter(
                                removedFromElement => HtmlTreeNavigator.startFrom(removedFromElement)
                                    .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.TRASH_ICON))
                                    .exists()
                            )
                            // Only a single element should match the above filter.
                            .forEach(removeMenuEntry => {
                                disconnectFn();
                                removeMenuEntry.click();
                            });
                    }
                },
                rootNode: ytdPopupContainer,
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

function clickRemoveMenuEntryInMoreOptionsMenu(moreOptionsMenu: HTMLElement): void {
    contentScriptObserversManager.upsertOneshotObserver(moreOptionsMenuObserver).observe();
    moreOptionsMenu.click();
}

function initContentScript(moreOptionsButtons: HTMLElement[]): void {
    for (const moreOptionsButton of moreOptionsButtons) {
        const ytdPlaylistVideoRenderer = HtmlParentNavigator.startFrom(moreOptionsButton)
            .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
            .consume();
        setupRemoveButtonIfNotPresent(moreOptionsButton, ytdPlaylistVideoRenderer)
    }

    const firstMenuButton = moreOptionsButtons[0] as HTMLButtonElement;
    const ytdPlaylistVideoListRenderer = HtmlParentNavigator.startFrom(firstMenuButton)
        .find(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
        .consume();

    if (!ytdPlaylistVideoListRenderer) {
        logger.error('Could not find ytd-playlist-video-list-renderer to setup quick actions for future' +
            ' playlist items');
        return;
    }

    const popupMenu = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
        .consume();
    initMoreOptionsMenuMutationSummary(popupMenu);

    contentScriptObserversManager.addBackgroundObserver(new PageObserver(() => playlistLoadingNewEntriesObserver, {
        targetNode: ytdPlaylistVideoListRenderer,
        initOptions: {
            subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['title']
        }
    })).observe();
}

export function runPlaylistScriptIfTargetElementExists(): void {
    logger.debug('Watch for the first menu button in a playlist item');
    MutationElementExistsWatcher.build()
        .queryFn(() => {
            const ytIconButtons = HtmlTreeNavigator.startFrom(document.body)
                .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
                .findAll(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
                .map(result => result.consume());
            return {ytIconButtons: ytIconButtons};
        })
        .observeFn(observer =>
            contentScriptObserversManager.addBackgroundObserver(new PageObserver(() => observer, {
                targetNode: document.body,
                initOptions: {
                    childList: true, subtree: true
                }
            })).observe()
        )
        .start()
        .then(elementWatchResult => {
            logger.debug('First menu button in playlist item was found!');
            const moreOptionsButtons = elementWatchResult.ytIconButtons as HTMLElement[];
            if (moreOptionsButtons.length > 0) {
                initContentScript(moreOptionsButtons);
            } else {
                logger.error('Could not find menu buttons of playlist items');
            }
        })
        .catch(err => logger.error(err));
}
