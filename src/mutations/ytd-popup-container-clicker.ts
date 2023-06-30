import { buffer, debounceTime, first, Subject } from "rxjs";
import { YtdMenuServiceItemRendererSvgExtractor } from "./ytd-menu-service-item-renderer-svg-extractor";
import { OneshotObserver } from "../observation/observer-types";
import { OneshotObserverId } from "../enums/oneshot-observer-id";
import {
  AnyFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../html-navigation/filter/navigation-filter";
import { SvgDrawPath, Tags } from "../html-element-processing/element-data";
import { IQuery, MutationSummary } from "mutation-summary";
import { contentScriptObserversManager } from "../content_scripts/init-globals";
import { HtmlParentNavigator } from "../html-navigation/html-parent-navigator";

export type SvgOptionFn = (svgOption: HTMLElement) => void;

export class YtdPopupContainerClicker {
  public readonly popupContainer: HTMLElement;
  public connectedOneshotMutationsExtractorEmitter?: OneshotObserver;
  private subject = new Subject<YtdMenuServiceItemRendererSvgExtractor>();

  constructor(ytdPopupContainer: HTMLElement) {
    this.popupContainer = ytdPopupContainer;
  }

  static createOneshotObserverForClicker(
    oneshotObserverId: OneshotObserverId,
    anySvgToClick: SvgDrawPath[],
    clicker: YtdPopupContainerClicker
  ): OneshotObserver {
    const mutationSummaryQueries: IQuery[] = anySvgToClick.map((svg) => ({
      element: `path[d='${svg}']`,
    }));
    mutationSummaryQueries.push({ attribute: "hidden" });

    return new OneshotObserver(oneshotObserverId, () => {
      const summary = new MutationSummary({
        callback: (summaries) =>
          clicker.pushMutationsExtractor(
            new YtdMenuServiceItemRendererSvgExtractor(
              new AnyFilter(anySvgToClick.map((svg) => new SvgDrawPathNavigationFilter(svg))),
              {
                addedSvgs: [summaries[0], summaries[1]],
                ytdMenuServiceItemRendererHiddenAttribute: summaries[2],
              }
            )
          ),
        rootNode: clicker.popupContainer,
        queries: mutationSummaryQueries,
      });
      summary.disconnect();
      return summary;
    });
  }

  pushMutationsExtractor(mutations: YtdMenuServiceItemRendererSvgExtractor): void {
    this.subject.next(mutations);
  }

  connectToMutationsExtractorEmitterOneshotObserver(oneshotObserver: OneshotObserver): void {
    this.connectedOneshotMutationsExtractorEmitter = oneshotObserver;
  }

  /**
   * Process {@link YtdMenuServiceItemRendererSvgExtractor}s pushed into this {@link YtdPopupContainerClicker}'s
   * internal subject with a debounce and buffer before running any extraction logic on them.
   *
   * This method uses RxJS to facilitate the debounce and buffer behaviour. The reason and use case for this
   * method is the following: The `ytd-popup-container` keeps as many `ytd-menu-service-item-renderer` elements
   * around as are needed for the current page. However, the behaviour for this functionality is interesting:
   * - If a page needs more `ytd-menu-service-item-renderer` elements, existing entries are hidden, new hidden
   * entries are added then all entries are made visible.
   * - If a page needs less, all entries are hidden, the unneeded entries are removed and then all are made visible.
   * - If a page does not need more or less entries but the actions themselves change, all
   * `ytd-menu-service-item-renderer` elements are hidden, then the contained SVG of
   * some of the `ytd-menu-service-item-renderer` elements is changed and then the elements are un-hidden.
   *
   * Therefore, it is not enough to check for the visibility or add mutation of a `ytd-menu-service-item-renderer`
   * element because its contained SVG might change. So a short term buffer is needed which contains all DOM
   * mutation changes in the millisecond range. This buffer can then be checked for the existing of an SVG add mutation.
   *
   * In the case that this {@link YtdPopupContainerClicker} is connected to an oneshot observer, the oneshot
   * observer is used to populate the internal subject.
   *
   * @param clickCallback Optional: Custom callback to run on the found `svgToClick` element instead of calling
   * `HTMLElement.click()` on it.
   */
  observeAndBufferMutationChangesThenClickSvg(clickCallback?: SvgOptionFn): void {
    if (this.connectedOneshotMutationsExtractorEmitter) {
      contentScriptObserversManager.upsertOneshotObserver(this.connectedOneshotMutationsExtractorEmitter).observe();
    }

    this.subject
      .pipe(buffer(this.subject.pipe(debounceTime(10))), first())
      .subscribe((mutationChanges: YtdMenuServiceItemRendererSvgExtractor[]) => {
        this.clickTargetSvgFromMatchingMutationsElementExtractor(mutationChanges, clickCallback);
        if (this.connectedOneshotMutationsExtractorEmitter) {
          this.connectedOneshotMutationsExtractorEmitter.disconnect();
        }
        this.popupContainer.removeAttribute("hidden");
      });

    // Hide the popup container so there is no drop-down flicker when triggering a quick action.
    this.popupContainer.setAttribute("hidden", "");
  }

  /**
   * Click the {@link SvgDrawPath} related element which is defined as the target filter inside the {@link YtdMenuServiceItemRendererSvgExtractor}s.
   *
   * This method takes a list of {@link YtdMenuServiceItemRendererSvgExtractor}s and then extracts the desired SVG
   * element of each item as defined by the {@link MutationsElementExtractor}'s `targetFilter`.
   * Depending on if the SVG was added or un-hidden by the parent `ytd-menu-service-item-renderer` element, an
   * `tp-yt-paper-item` element will be passed to `clickCallback` or the `ytd-menu-service-item-renderer` element itself.
   *
   * When determining to pass a `tp-yt-paper-item` or a `ytd-menu-service-item-renderer` element, it is first checked
   * if the SVG element was added and then checked if the parent `ytd-menu-service-item-renderer` was unhidden. This
   * order is important because the parent element is always added before the SVG element.
   *
   * @param extractors List of {@link YtdMenuServiceItemRendererSvgExtractor}s to process for the click
   * @param clickCallback Optional: Custom callback to run on the found `svgToClick` element instead of calling
   * `HTMLElement.click()` on it.
   */
  private clickTargetSvgFromMatchingMutationsElementExtractor(
    extractors: YtdMenuServiceItemRendererSvgExtractor[],
    clickCallback?: SvgOptionFn
  ): void {
    const addedSvgElements = extractors
      .map((extractor) => extractor.extractSvgFromAddedMutations())
      .filter((addedSvgElement) => !!addedSvgElement);
    const svgsOfUnHiddenYtdMenuServiceItemRenderers = extractors
      .map((extractor) => extractor.extractSvgFromUnHiddenYtdMenuServiceItemRenderer())
      .filter((unHiddenYtdServiceMenuItemRenderer) => !!unHiddenYtdServiceMenuItemRenderer);

    if (addedSvgElements.length === 1) {
      const tpYtPaperItem = HtmlParentNavigator.startFrom(addedSvgElements[0])
        .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
        .consume();

      if (clickCallback) {
        clickCallback(tpYtPaperItem);
      } else {
        tpYtPaperItem.click();
      }
    } else if (svgsOfUnHiddenYtdMenuServiceItemRenderers.length === 1) {
      const matchingYtdMenuServiceItemRenderer = svgsOfUnHiddenYtdMenuServiceItemRenderers[0];
      if (clickCallback) {
        clickCallback(svgsOfUnHiddenYtdMenuServiceItemRenderers[0]);
      } else {
        matchingYtdMenuServiceItemRenderer.click();
      }
    }
  }
}
