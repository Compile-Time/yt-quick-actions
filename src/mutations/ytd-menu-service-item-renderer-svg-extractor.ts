import { HtmlTreeNavigator } from "../html-navigation/html-tree-navigator";
import {
  AnyFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../html-navigation/filter/navigation-filter";
import { Tags } from "../html-element-processing/element-data";
import { YtdPopupContainerMutationSummary } from "./summary-like";
import { MutationsElementExtractor } from "./mutations-target-clicker";

/**
 * Convenience class aggregating {@link YtdPopupContainerMutationSummary} changes and providing extraction methods for a given
 * `svgTargetFilter`.
 */
export class YtdMenuServiceItemRendererSvgExtractor extends MutationsElementExtractor<YtdPopupContainerMutationSummary> {
  constructor(
    svgTargetFilter: AnyFilter<SvgDrawPathNavigationFilter>,
    mutationSummaries: YtdPopupContainerMutationSummary
  ) {
    super(mutationSummaries, svgTargetFilter);
  }

  extractSvgFromAddedMutations(): HTMLElement | undefined {
    const svgPathElements = this.mutationSummaries.addedSvgs
      .map((addedSvgMutation) => {
        const svgPathSummaryElement = addedSvgMutation.added
          .map((node) => node as HTMLElement)
          // The class attribute is non-empty on valid path elements.
          .filter((pathElement) => !!pathElement.getAttribute("class"))
          .filter((pathElement) => this.targetFilter.applySingle(pathElement));
        return svgPathSummaryElement.length === 1
          ? svgPathSummaryElement[0]
          : undefined;
      })
      .filter((svgPathElement) => !!svgPathElement);

    // Usually, `svgPathElements` should only contain a single element under the assumption that we are looking for
    // a specific SVG of the current YouTube UI version. However, in the case that we should find more than one element
    // that fits our filter the first element is used as well.
    return svgPathElements.length > 0 ? svgPathElements[0] : undefined;
  }

  extractSvgFromUnHiddenYtdMenuServiceItemRenderer(): HTMLElement | undefined {
    const ytdMenuServiceItemRenderer =
      this.mutationSummaries.ytdMenuServiceItemRendererHiddenAttribute.removed
        .map((node) => node as HTMLElement)
        .filter((node) =>
          HtmlTreeNavigator.startFrom(node)
            .filter(new TagNavigationFilter(Tags.YT_ICON))
            .findFirst(this.targetFilter)
            .exists()
        );
    return ytdMenuServiceItemRenderer.length === 1
      ? ytdMenuServiceItemRenderer[0]
      : undefined;
  }
}
