import { HtmlTreeNavigator } from "../html-navigation/html-tree-navigator";
import { SvgDrawPathNavigationFilter, TagNavigationFilter } from "../html-navigation/filter/navigation-filter";
import { Tags } from "../html-element-processing/element-data";
import { SummaryLike } from "./summary-like";
import { MutationsElementExtractor } from "./mutations-target-clicker";

/**
 * Convenience class aggregating {@link SummaryLike} changes and providing extraction methods for a given
 * `svgTargetFilter`.
 */
export class YtdMenuServiceItemRendererSvgExtractor extends MutationsElementExtractor {
  constructor(svgTargetFilter: SvgDrawPathNavigationFilter, mutationSummaries: SummaryLike[]) {
    super(mutationSummaries, svgTargetFilter);
  }

  extractSvgFromAddedMutations(): HTMLElement {
    const svgPathSummaryElement = this.mutationSummaries[0].added
      .map((node) => node as HTMLElement)
      // The class attribute is non-empty on valid path elements.
      .filter((pathElement) => !!pathElement.getAttribute("class"))
      .filter((pathElement) => this.targetFilter.applySingle(pathElement));
    return svgPathSummaryElement.length === 1 ? svgPathSummaryElement[0] : null;
  }

  extractSvgFromUnHiddenYtdMenuServiceItemRenderer(): HTMLElement {
    const ytdMenuServiceItemRenderer = this.mutationSummaries[1].removed
      .map((node) => node as HTMLElement)
      .filter((node) =>
        HtmlTreeNavigator.startFrom(node)
          .filter(new TagNavigationFilter(Tags.YT_ICON))
          .findFirst(this.targetFilter)
          .exists()
      );
    return ytdMenuServiceItemRenderer.length === 1 ? ytdMenuServiceItemRenderer[0] : null;
  }
}
