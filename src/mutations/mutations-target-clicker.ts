import { SummaryLike } from "./summary-like";
import { NavigationFilter } from "../html-navigation/filter/navigation-filter";

export abstract class MutationsElementExtractor {
  protected mutationSummaries: SummaryLike[];
  protected targetFilter: NavigationFilter;

  protected constructor(mutationSummaries: SummaryLike[], targetElement: NavigationFilter) {
    this.mutationSummaries = mutationSummaries;
    this.targetFilter = targetElement;
  }
}
