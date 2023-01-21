import {QaHtmlElements} from "../../html-element-processing/qa-html-elements";
import {HtmlParentNavigator} from "../../html-navigation/html-parent-navigator";
import {
    IdNavigationFilter,
    SvgDrawPathNavigationFilter,
    TagNavigationFilter
} from "../../html-navigation/filter/navigation-filter";
import {AttributeNames, Ids, SVG_DRAW_PATH, Tags} from "../../html-element-processing/element-data";
import {HtmlTreeNavigator} from "../../html-navigation/html-tree-navigator";
import {OneshotObserver, PageObserver} from "../../observation/observer-types";
import {OneshotObserverId} from "../../enums/oneshot-observer-id";
import {
    MutationElementExistsWatcher
} from "../../html-element-processing/element-watcher/mutation-element-exists-watcher";
import {LogProvider} from "../../logging/log-provider";
import {contentLogProvider, contentScriptObserversManager} from "../init-globals";
import {MutationSummary} from "mutation-summary";

const logger = contentLogProvider.getLogger(LogProvider.WATCHING_PLAYLIST);

let moreOptionsMenuObserver: OneshotObserver;

function setupRemoveButton(element: HTMLElement): HTMLButtonElement {
    const button = QaHtmlElements.removeButtonInWatchingPlaylist();
    button.onclick = () => {
        element.click();
        const popupMenu = HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
            .consume();

        if (!popupMenu) {
            logger.error('Could not find popup menu trigger');
            return;
        }

        contentScriptObserversManager.upsertOneshotObserver(moreOptionsMenuObserver).observe();
    };
    return button;
}

/**
 * Initialize a {@link OneshotObserver} with a {@link MutationSummary} that watches the more options popup of active
 * playlist entry.
 *
 * The created {@link MutationSummary} watches for changes in YouTube's popup container and clicks the "Remove from
 * playlist" entry when it appears. The {@link MutationSummary} both works for an active playlist displayed to the
 * right of a video or below a video.
 *
 * @param rootNode - The node to watch for changes
 */
function initMoreOptionsMenuObserver(rootNode: Node): void {
    moreOptionsMenuObserver = new OneshotObserver(
        OneshotObserverId.REMOVE_POPUP_ENTRY_READY,
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
                            .filter(ytdMenuServiceItem => HtmlTreeNavigator.startFrom(ytdMenuServiceItem)
                                .filter(new TagNavigationFilter(Tags.YT_ICON))
                                .findFirst(new SvgDrawPathNavigationFilter(SVG_DRAW_PATH.TRASH_ICON))
                                .exists())
                            // Only a single entry should remain after the filter.
                            .forEach(removeYtdServiceMenuItem => {
                                disconnectFn();
                                removeYtdServiceMenuItem.click();
                            });
                    }
                },
                rootNode: rootNode,
                queries: [
                    {all: true},
                    {attribute: 'hidden'}
                ]
            })
            summary.disconnect();
            return summary;
        },
    );
}

function initContentScript(playlistPanelVideoRendererItems: HTMLElement[]): void {
    const ytdPopupContainer = HtmlTreeNavigator.startFrom(document.body)
        .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
        .consume();

    initMoreOptionsMenuObserver(ytdPopupContainer);

    playlistPanelVideoRendererItems
        .map(playlistPanelVideoRendererItem => HtmlTreeNavigator.startFrom(playlistPanelVideoRendererItem)
            .findFirst(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
            .consume()
        )
        .forEach(ytMenuIconButton => {
            const removeButton = setupRemoveButton(ytMenuIconButton);

            const playlistItem = HtmlParentNavigator.startFrom(ytMenuIconButton)
                .find(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))
                .consume();

            const existingRemoveButton = HtmlTreeNavigator.startFrom(playlistItem)
                .findFirst(new IdNavigationFilter(Tags.BUTTON, Ids.QA_REMOVE_BUTTON))
                .consume();
            if (!existingRemoveButton) {
                playlistItem.append(removeButton);
            }
        });
}

export function runWatchingPlaylistScriptIfTargetElementExists(): void {
    logger.debug('Watch for first playlist item under or next to a video');
    MutationElementExistsWatcher.build()
        .queryFn(() => {
                const playlistItems = HtmlTreeNavigator.startFrom(document.body)
                    .findAll(new IdNavigationFilter(Tags.YTD_PLAYLIST_PANEL_VIDEO_RENDERER, Ids.PLAYLIST_ITEMS))
                    .map(result => result.consume());

                return {playlistItems: playlistItems};
            }
        )
        .observeFn(
            observer => contentScriptObserversManager.addBackgroundObserver(new PageObserver(() => observer, {
                targetNode: document.body,
                initOptions: {
                    childList: true, subtree: true
                }
            })).observe()
        )
        .start()
        .then(elementWatcherResult => {
            logger.debug('First playlist item was found!');
            const playlistPanelVideoRendererItems = elementWatcherResult.playlistItems as HTMLElement[];
            if (playlistPanelVideoRendererItems) {
                initContentScript(playlistPanelVideoRendererItems);
            } else {
                logger.error('Could not find ytd-playlist-panel-video-renderer elements');
            }
        })
        .catch(err => logger.error(err));
}