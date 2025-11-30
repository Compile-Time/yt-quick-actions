import {
  BehaviorSubject,
  catchError,
  concatAll,
  debounceTime,
  filter,
  first,
  map,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
  windowCount,
} from 'rxjs';
import { DisconnectFn } from '@/utils/types/disconnectable';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';
import {
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
  TextNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import { SvgDrawPath } from '@/utils/html-element-processing/element-data';
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import WatchLaterHomeButton from '@/components/WatchLaterHomeButton.vue';
import { getTpYtIronDropDownFromDom } from '@/utils/yt-popup';
import { homeSearchStrings$, homeWatchLaterDisabled$ } from '@/entrypoints/content/state/settings';
import { getLogger, LoggerKind } from '@/entrypoints/content/state/logger';

const logger = getLogger(LoggerKind.HOME_SCRIPT);

const contentScriptContext$ = new BehaviorSubject<ContentScriptContext | null>(null);
const queueWatchLaterClick$ = new Subject<HTMLElement>();

const contentMutation$ = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      !Array.from(mutation.addedNodes).some((node) => {
        const element = node as HTMLElement;
        return (
          node.nodeName === 'DIV' &&
          (element.id === 'qa-watch-later-home-button-container' || element.getAttribute('data-v-app') !== null)
        );
      })
    ) {
      contentMutation$.next(mutation);
    }
  });
});

const popupMutation$ = new Subject<MutationRecord>();
const popupMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // We manipulate the style in some cases, and we generally don't check for it in any use case, so we can
    // ignore it.
    if (mutation.attributeName !== 'style') {
      popupMutation$.next(mutation);
    }
  });
});

const watchLaterButtonClicked$ = new BehaviorSubject<boolean>(false);

const createWatchLaterButtons$ = contentMutation$.pipe(
  filter(() => !homeWatchLaterDisabled$.value),
  filter((mutationRecord) => {
    return mutationRecord.target.nodeName === 'DIV' && (mutationRecord.target as HTMLElement).id === 'content';
  }),
  filter((mutationRecord) => {
    return HtmlParentNavigator.startFrom(mutationRecord.target as HTMLElement)
      .find(new TagNavigationFilter('YTD-RICH-SECTION-RENDERER'))
      .notExists();
  }),
  filter((mutationRecord) =>
    HtmlTreeNavigator.startFrom(mutationRecord.target as HTMLElement)
      .findFirst(new TagNavigationFilter('ytd-ad-slot-renderer'))
      .notExists(),
  ),
  tap((mutationRecord) => {
    const divContent = mutationRecord.target as HTMLElement;
    const optionsButton = HtmlTreeNavigator.startFrom(divContent)
      .filter(new TagNavigationFilter('BUTTON-VIEW-MODEL'))
      .findFirst(new TagNavigationFilter('BUTTON'))
      .consume()!;
    logger.debug('Search for more options button yielded: ', optionsButton);

    divContent.setAttribute('style', 'position: relative;');
    const watchLaterButton = createIntegratedUi(contentScriptContext$.value!, {
      anchor: divContent,
      position: 'overlay',
      onMount: (container) => {
        container.style.height = '100%';
        const app = createApp(WatchLaterHomeButton, {
          optionsButton,
          watchLaterClickSubject: queueWatchLaterClick$,
        });
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        app?.unmount();
      },
    });
    watchLaterButton.mount();
  }),
  catchError((error) => {
    logger.error('Error occurred while creating watch later buttons', error);
    contentMutationObserver.disconnect();
    return throwError(() => error);
  }),
);

/**
 * Click the watch later button in the popup.
 *
 * Implementation details:
 * - We check with a behavior subject if the watch later button was clicked, so the popup can still be used the
 *   normal way
 * - The popup container visibility is set to hidden to prevent the popup from flashing in YouTube. It is necessary
 *   to debounce the changes of the mutation observer, or else the process of clicking the watch later button might
 *   fail. Adding a debounce operation, however, makes the popup flash.
 * - Because the popup is being hidden, and we are listening to attribute changes with a mutation observer, we need
 *   to exclude changes caused by the style attribute, or we are stuck in a loop.
 * - We are only interested in the first change that manages to go through the filters, so we use the first()
 *   operator. This means we need to manually re-subscribe onto the subject afterward. There may be better approaches,
 *   but this keeps the code simple.
 */
const clickPopupWatchLaterButton$ = popupMutation$.pipe(
  filter(() => watchLaterButtonClicked$.value),
  filter((record) => record.target.nodeName === 'TP-YT-IRON-DROPDOWN'),
  tap((record) => {
    const popup = record.target as HTMLElement;
    popup.style.visibility = 'hidden';
  }),
  debounceTime(300),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const popupContainer = getTpYtIronDropDownFromDom();

    let clickable: HTMLElement | null;
    if (homeSearchStrings$.value.watchLaterEntry) {
      logger.debug(`Using custom search string "${homeSearchStrings$.value.watchLaterEntry}" for watch later action`);
      clickable = HtmlTreeNavigator.startFrom(popupContainer)
        .findFirst(new TextNavigationFilter('span', homeSearchStrings$.value.watchLaterEntry))
        .intoParentNavigator()
        .find(new TagNavigationFilter('yt-list-item-view-model'))
        .consume();
    } else {
      logger.debug('Using default icon search for watch later action');
      clickable = HtmlTreeNavigator.startFrom(popupContainer)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.WATCH_LATER_HOME_PAGE))
        .intoParentNavigator()
        .find(new TagNavigationFilter('yt-list-item-view-model'))
        .consume();
    }

    logger.debug('Search for watch later entry in popup yielded: ', clickable);

    if (clickable) {
      clickable.click();
    }
  }),
  catchError((error) => {
    logger.error('Error occurred while trying to click the watch later button in the popup', error);
    popupMutationObserver.disconnect();
    const popup = getTpYtIronDropDownFromDom();
    popup.style.visibility = 'visible';

    return of(null);
  }),
  tap((record) => {
    watchLaterButtonClicked$.next(false);

    if (!record) {
      return;
    }

    const popup = record.target as HTMLElement;
    popup.style.visibility = 'visible';
  }),
);

/**
 * Queue watch later clicks with `windowCount` to prevent buggy behavior.
 *
 * `windowCount` creates a window of observables until the specific count is reached. We use this to put each
 * button click into a new observable and concat them with `concatAll`. `concatAll` subscribes to each observable
 * sequentially, so the next watch later action will only be performed after the previous one is finished. This
 * ensures that the popup content is properly synced with the video the button was clicked on.
 */
const processQueuedWatchLaterClick$ = queueWatchLaterClick$.pipe(
  windowCount(1),
  map((window) =>
    window.pipe(
      switchMap((optionsButton) => {
        watchLaterButtonClicked$.next(true);
        optionsButton.click();
        return clickPopupWatchLaterButton$;
      }),
    ),
  ),
  concatAll(),
);

export function initHomeObserver(ctx: ContentScriptContext): DisconnectFn {
  contentScriptContext$.next(ctx);

  // Avoid listening to the whole DOM by using the ytd-page-manager element.
  const ytdPageManager = document.evaluate(
    '/html/body/ytd-app/div[1]/ytd-page-manager',
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLElement;

  const contentObserverConf = { attributes: false, childList: true, subtree: true };
  contentMutationObserver.observe(ytdPageManager, contentObserverConf);

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter('ytd-popup-container'))
    .consume()!;
  const popupObserverConf = { attributes: true, childList: true, subtree: true };
  popupMutationObserver.observe(popupContainer, popupObserverConf);

  const createWatchLaterButtonSubscription = createWatchLaterButtons$.subscribe();
  const queueWatchLaterClicksSubscription = processQueuedWatchLaterClick$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    createWatchLaterButtonSubscription.unsubscribe();
    queueWatchLaterClicksSubscription.unsubscribe();
  };
}
