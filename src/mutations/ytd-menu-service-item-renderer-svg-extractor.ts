import { HtmlTreeNavigator } from "../html-navigation/html-tree-navigator";
import {
  AnyFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../html-navigation/filter/navigation-filter";
import { Tags } from "../html-element-processing/element-data";
import { SummaryLike, YtdPopupContainerMutationSummary } from "./summary-like";
import { MutationsElementExtractor } from "./mutations-target-clicker";

/**
 * Convenience class aggregating {@link SummaryLike} changes and providing extraction methods for a given
 * `svgTargetFilter`.
 */
export class YtdMenuServiceItemRendererSvgExtractor extends MutationsElementExtractor<YtdPopupContainerMutationSummary> {
  constructor(
    targetFilter: AnyFilter<SvgDrawPathNavigationFilter>,
    mutationSummaries: YtdPopupContainerMutationSummary
  ) {
    super(mutationSummaries, targetFilter);
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

    return svgPathElements.length === 1 ? svgPathElements[0] : undefined;
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
