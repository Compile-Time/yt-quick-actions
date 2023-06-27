import { NavigationFilter } from "../html-navigation/filter/navigation-filter";

export abstract class MutationsElementExtractor<T> {
  protected mutationSummaries: T;
  protected targetFilter: NavigationFilter;

  protected constructor(mutationSummaries: T, targetElement: NavigationFilter) {
    this.mutationSummaries = mutationSummaries;
    this.targetFilter = targetElement;
  }
}
