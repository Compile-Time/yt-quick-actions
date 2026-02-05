import { filter, MonoTypeOperatorFunction, pipe } from 'rxjs';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import { AttributesNavigationFilter, TagNavigationFilter } from '@/utils/html-navigation/filter/navigation-filter';
import { homeWatchLaterDisabled$, subscriptionWatchLaterDisabled$ } from '@/entrypoints/content/state/settings';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';

import { CurrentPage } from '@/utils/types/current-page';

export function testIfWatchLaterButtonShouldBeCreated(): MonoTypeOperatorFunction<
  [MutationRecord, CurrentPage | null]
> {
  return pipe(
    filter(
      ([, currentPage]) =>
        (!homeWatchLaterDisabled$.value && currentPage === CurrentPage.HOME) ||
        (!subscriptionWatchLaterDisabled$.value && currentPage === CurrentPage.SUBSCRIPTIONS),
    ),
    filter(([mutationRecord]) => {
      return mutationRecord.target.nodeName === 'DIV' && (mutationRecord.target as HTMLElement).id === 'content';
    }),
    filter(([mutationRecord, currentPage]) => {
      return (
        HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
          .find(new TagNavigationFilter('YTD-RICH-SECTION-RENDERER'))
          .notExists() ||
        (HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
          .find(new TagNavigationFilter('YTD-RICH-SECTION-RENDERER'))
          .exists() &&
          HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
            .findFirst(new TagNavigationFilter('YTM-SHORTS-LOCKUP-VIEW-MODEL-V2'))
            .notExists()) ||
        (currentPage === CurrentPage.HOME &&
          HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
            .find(new TagNavigationFilter('YTD-RICH-SECTION-RENDERER'))
            .exists() &&
          HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
            .findFirst(new TagNavigationFilter('YTM-SHORTS-LOCKUP-VIEW-MODEL-V2'))
            .notExists() &&
          HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
            .find(new AttributesNavigationFilter('DIV', { id: 'contents-container', class: 'ytd-rich-shelf-renderer' }))
            .exists())
      );
    }),
    filter(([mutationRecord]) =>
      HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
        .findFirst(new TagNavigationFilter('ytd-ad-slot-renderer'))
        .notExists(),
    ),
  );
}
