import { debounceTime, filter, map, sample, Subject, Subscription } from "rxjs";
import { PageSubscription } from "../types/page-subscription";
import { HtmlParentNavigator } from "../../html-navigation/html-parent-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../html-navigation/filter/navigation-filter";
import { QaHtmlElements } from "../../html-element-processing/qa-html-elements";
import { HtmlTreeNavigator } from "../../html-navigation/html-tree-navigator";
import { SvgDrawPath } from "../../html-element-processing/element-data";

const contentMutationSubject = new Subject<MutationRecord>();
const popupMutationSubject = new Subject<MutationRecord>();
const watchLaterClickSubject = new Subject<void>();

function createDialogTriggerSubscription(): Subscription {
  return contentMutationSubject
    .pipe(
      filter((mutationRecord) => {
        return mutationRecord.target.nodeName === "YTD-RICH-ITEM-RENDERER";
      }),
      filter((mutationRecord) => {
        return HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
          .find(new TagNavigationFilter("YTD-RICH-SECTION-RENDERER"))
          .notExists();
      }),
      filter((mutationRecord) =>
        HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
          .findFirst(new TagNavigationFilter("ytd-ad-slot-renderer"))
          .notExists()
      )
    )
    .subscribe({
      next: (mutationRecord) => {
        const div = HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
          .findFirst(new IdNavigationFilter("DIV", "content"))
          .consume();
        const optionsButton = HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
          .filter(new TagNavigationFilter("BUTTON-VIEW-MODEL"))
          .findFirst(new TagNavigationFilter("BUTTON"))
          .consume();

        const qaButton = QaHtmlElements.watchLaterHomeVideoButton(() => {
          optionsButton.click();
          watchLaterClickSubject.next();
        });
        div.appendChild(qaButton.completeHtmlElement);
      },
    });
}

function createWatchLaterClickSubscription() {
  return popupMutationSubject
    .pipe(
      map((mutationRecord) =>
        HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
          .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
          .consume()
      ),
      filter((svg) => !!svg),
      sample(watchLaterClickSubject.pipe(debounceTime(200)))
    )
    .subscribe({
      next: (svg) => {
        HtmlParentNavigator.startFrom(svg).find(new TagNavigationFilter("YT-LIST-ITEM-VIEW-MODEL")).consume().click();
      },
    });
}

export function initHomeObserverNew(): PageSubscription {
  const contentObserverConf = { attributes: false, childList: true, subtree: true };
  const contentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      contentMutationSubject.next(mutation);
    });
  });
  contentObserver.observe(document.body, contentObserverConf);

  const popupObserverConf = { attributes: true, childList: false, subtree: true };
  const popupObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      popupMutationSubject.next(mutation);
    });
  });
  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter("YTD-POPUP-CONTAINER"))
    .consume();
  popupObserver.observe(popupContainer, popupObserverConf);

  return {
    mutationObservers: [contentObserver, popupObserver],
    subscriptions: [
      createDialogTriggerSubscription(),
      createWatchLaterClickSubscription()
    ],
  };
}
