import { YtdMenuServiceItemRendererSvgExtractor } from "./ytd-menu-service-item-renderer-svg-extractor";
import { HtmlParentNavigator } from "../html-navigation/html-parent-navigator";
import { TagNavigationFilter } from "../html-navigation/filter/navigation-filter";
import { Tags } from "../html-element-processing/element-data";
import { SvgOptionFn } from "./ytd-popup-container-clicker";

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
export function clickTargetSvgFromMatchingMutationsElementExtractor(
  extractors: YtdMenuServiceItemRendererSvgExtractor[],
  clickCallback?: SvgOptionFn
): void {
  const addedSvgElements = extractors
    .map((extractor) => extractor.extractSvgFromAddedMutations())
    .filter((addedSvgElement) => !!addedSvgElement);
  const svgsOfunHiddenYtdMenuServiceItemRenderers = extractors
    .map((extractor) =>
      extractor.extractSvgFromUnHiddenYtdMenuServiceItemRenderer()
    )
    .filter(
      (unHiddenYtdServiceMenuItemRenderer) =>
        !!unHiddenYtdServiceMenuItemRenderer
    );

  if (addedSvgElements.length === 1) {
    const tpYtPaperItem = HtmlParentNavigator.startFrom(addedSvgElements[0])
      .find(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
      .consume();

    if (clickCallback) {
      clickCallback(tpYtPaperItem);
    } else {
      tpYtPaperItem.click();
    }
  } else if (svgsOfunHiddenYtdMenuServiceItemRenderers.length === 1) {
    const matchingYtdMenuServiceItemRenderer =
      svgsOfunHiddenYtdMenuServiceItemRenderers[0];
    if (clickCallback) {
      clickCallback(svgsOfunHiddenYtdMenuServiceItemRenderers[0]);
    } else {
      matchingYtdMenuServiceItemRenderer.click();
    }
  }
}
