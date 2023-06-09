import { Summary } from "mutation-summary";
import { HtmlTreeNavigator } from "../html-navigation/html-tree-navigator";
import {
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../html-navigation/filter/navigation-filter";
import { Tags } from "../html-element-processing/element-data";

/**
 * Convenience class aggregating {@link Summary} changes and providing extraction methods for a given
 * `svgTargetFilter`.
 *
 * Currently only used for the {@link YtdPopupContainerClicker} class but can be expanded to allow all types of {@link NavigationFilter}.
 */
export class MutationsElementExtractor {
  private mutationSummaries: Summary[];
  private svgTargetFilter: SvgDrawPathNavigationFilter;

  constructor(
    svgTargetFilter: SvgDrawPathNavigationFilter,
    mutationSummaries: Summary[]
  ) {
    this.mutationSummaries = mutationSummaries;
    this.svgTargetFilter = svgTargetFilter;
  }

  extractSvgFromAddedMutations(): HTMLElement {
    const svgPathSummaryElement = this.mutationSummaries[0].added
      .map((node) => node as HTMLElement)
      // The class attribute is non-empty on valid path elements.
      .filter((pathElement) => !!pathElement.getAttribute("class"))
      .filter((pathElement) => this.svgTargetFilter.applySingle(pathElement));
    return svgPathSummaryElement.length === 1 ? svgPathSummaryElement[0] : null;
  }

  extractSvgFromUnHiddenYtdMenuServiceItemRenderer(): HTMLElement {
    const ytdMenuServiceItemRenderer = this.mutationSummaries[1].removed
      .map((node) => node as HTMLElement)
      .filter((node) =>
        HtmlTreeNavigator.startFrom(node)
          .filter(new TagNavigationFilter(Tags.YT_ICON))
          .findFirst(this.svgTargetFilter)
          .exists()
      );
    return ytdMenuServiceItemRenderer.length === 1
      ? ytdMenuServiceItemRenderer[0]
      : null;
  }
}
