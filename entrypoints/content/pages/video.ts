import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  of,
  shareReplay,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { DisconnectFn } from '@/utils/types/disconnectable';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { SvgDrawPath } from '@/utils/html-element-processing/element-data';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import { createLogger } from '@/utils/logging/log-provider';
import {
  SETTING_LOG_LEVELS,
  SETTING_SEARCH_STRINGS,
  SettingLogLevels,
  SettingSearchStrings,
} from '@/utils/storage/settings-data';
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import WatchLaterVideoButton from '@/components/WatchLaterVideoButton.vue';

const logger = createLogger('video');
storage.watch<SettingLogLevels>(SETTING_LOG_LEVELS, (logLevels) => {
  if (logLevels?.watchVideo) {
    logger.setLevel(logLevels.watchVideo);
  }
});

let searchStrings: SettingSearchStrings['watchVideo'] = {
  watchLaterEntry: undefined,
  videoSaveButton: undefined,
};
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Setting search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.watchVideo) {
    searchStrings = settingSearchStrings.watchVideo;
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded setting search strings: ', settingSearchStrings);
  if (settingSearchStrings?.watchVideo) {
    searchStrings = settingSearchStrings.watchVideo;
  }
});

const contentScriptContext$ = new BehaviorSubject<ContentScriptContext | null>(null);

const contentMutation$ = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (Array.from(mutation.addedNodes).every((node) => node.nodeName !== 'BUTTON')) {
      contentMutation$.next(mutation);
    }
  });
});

const popupMutationSubject = new Subject<MutationRecord>();
const popupMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // We manipulate the style in some cases, and we generally don't check for it in any use case, so we can
    // ignore it.
    if (mutation.attributeName !== 'style') {
      popupMutationSubject.next(mutation);
    }
  });
});

const watchLaterButtonClickedSubject = new BehaviorSubject<boolean>(false);
const saveVideoInOptionsClickedSubject = new BehaviorSubject<boolean>(false);

const topLevelComputedButtonsMutations$ = contentMutation$.pipe(
  filter(
    (record) => record.target.nodeName === 'DIV' && (record.target as HTMLElement).id === 'top-level-buttons-computed',
  ),
  debounceTime(400),
  map((record) => record.target as HTMLElement),
  tap((record) => logger.debug('Matching top level buttons computed mutation found: ', record)),
);
const moreOptionsMutations$ = contentMutation$.pipe(
  filter((record) => {
    const ytButton = record.target as HTMLElement;
    return HtmlParentNavigator.startFrom(ytButton)
      .find(new IdNavigationFilter('yt-button-shape', 'button-shape'))
      .exists();
  }),
  debounceTime(400),
  map((record) => record.target as HTMLElement),
  tap((record) => logger.debug('Matching More options button mutation found: ', record)),
);

const createWatchLaterButton$ = combineLatest({
  topLevelButtonsComputed: topLevelComputedButtonsMutations$,
  moreOptionsButton: moreOptionsMutations$,
}).pipe(
  // There may be multiple changes to the top level buttons or more options element, so we debounce the changes.
  debounceTime(400),
  // After the button is set up in the DOM, we don't need the subscription anymore.
  first(),
  tap(({ topLevelButtonsComputed, moreOptionsButton }) => {
    const saveToPlaylistButton = HtmlTreeNavigator.startFrom(topLevelButtonsComputed.parentElement!)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
      .intoParentNavigator()
      .find(new TagNavigationFilter('button'))
      .consume();
    logger.debug('Search for save to playlist button yielded: ', saveToPlaylistButton);

    let popupTrigger;
    let subjectTrigger;

    if (saveToPlaylistButton) {
      popupTrigger = saveToPlaylistButton;
      subjectTrigger = saveVideoInOptionsClickedSubject;
    } else {
      popupTrigger = moreOptionsButton.children[0] as HTMLElement;
      subjectTrigger = watchLaterButtonClickedSubject;
    }

    const watchLaterButton = createIntegratedUi(contentScriptContext$.value!, {
      anchor: topLevelButtonsComputed,
      position: 'inline',
      onMount: (container) => {
        const app = createApp(WatchLaterVideoButton, {
          popupTrigger,
          subjectTrigger,
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
  tap(() => {
    contentMutationObserver.disconnect();
  }),
  catchError((error) => {
    logger.error('Error occurred while creating watch later buttons', error);
    contentMutationObserver.disconnect();
    return throwError(() => error);
  }),
);

const clickPopupVideoSaveButton$ = popupMutationSubject.pipe(
  filter(() => watchLaterButtonClickedSubject.value && !saveVideoInOptionsClickedSubject.value),
  filter((record) => record.target.nodeName === 'TP-YT-IRON-DROPDOWN'),
  tap((record) => {
    const popup = record.target as HTMLElement;
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: hidden;`);
  }),
  debounceTime(300),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const tpYtIronDropdown = document.evaluate(
      '/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown',
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;

    const button = HtmlTreeNavigator.startFrom(tpYtIronDropdown as HTMLElement)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
      .intoParentNavigator()
      .find(new TagNavigationFilter('tp-yt-paper-item'))
      .consume()!;
    logger.debug('Search for save to playlist entry in popup yielded: ', button);

    if (button) {
      button.click();
    }
    saveVideoInOptionsClickedSubject.next(true);
  }),
  catchError((error) => {
    logger.error('Error occurred while trying to click the save to playlist entry in the popup', error);
    popupMutationObserver.disconnect();

    const popup = document.evaluate(
      '/html/body/ytd-app/ytd-popup-container',
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: visible;`);

    return throwError(() => error);
  }),
  tap(() => {
    clickPopupVideoSaveButton$.subscribe();
  }),
);

const clickPopupWatchLaterPlaylist$ = popupMutationSubject.pipe(
  filter(() => saveVideoInOptionsClickedSubject.value),
  filter((record) => record.target.nodeName === 'TP-YT-IRON-DROPDOWN'),
  tap((record) => {
    const popup = record.target as HTMLElement;
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: hidden;`);
  }),
  debounceTime(600),
  first(),
  tap(() => {
    // "Reload" the DOM element for its children.
    const popupContainer = document.evaluate(
      '/html/body/ytd-app/ytd-popup-container',
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;

    const ytListItem = HtmlTreeNavigator.startFrom(popupContainer)
      .findFirst(new TagNavigationFilter('yt-list-item-view-model'))
      .consume();
    logger.debug('Search for watch later playlist in popup yielded: ', ytListItem);

    if (ytListItem) {
      ytListItem.click();
    }
  }),
  catchError((err) => {
    logger.error('Error occurred while trying to click the watch later playlist in the popup', err);
    popupMutationObserver.disconnect();

    const popup = document.evaluate(
      '/html/body/ytd-app/ytd-popup-container',
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: visible;`);

    return of(null);
  }),
  tap((record) => {
    watchLaterButtonClickedSubject.next(false);
    saveVideoInOptionsClickedSubject.next(false);

    if (!record) {
      return;
    }

    const popup = record.target as HTMLElement;
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: visible;`);
    clickPopupWatchLaterPlaylist$.subscribe();
  }),
);

const ytAppReady$ = contentMutation$.pipe(
  filter((record) => record.target.nodeName === 'YTD-APP'),
  shareReplay({
    bufferSize: 1,
    refCount: true,
  }),
);

const setupPopupMutationObserver$ = ytAppReady$.pipe(
  tap(() => {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
      .findFirst(new TagNavigationFilter('ytd-popup-container'))
      .consume()!;
    const popupObserverConf = { attributes: true, childList: false, subtree: true };
    popupMutationObserver.observe(popupContainer, popupObserverConf);
  }),
);

export function initWatchVideo(ctx: ContentScriptContext): DisconnectFn {
  contentScriptContext$.next(ctx);

  const contentObserverConf = { attributes: false, childList: true, subtree: true };
  contentMutationObserver.observe(document.body, contentObserverConf);

  const setupPopupMutationObserver = setupPopupMutationObserver$.subscribe();
  const createWatchLaterButtonSubscription = createWatchLaterButton$.subscribe();
  const clickPopupVideoSaveSubscription = clickPopupVideoSaveButton$.subscribe();
  const clickPopupWatchLaterPlaylistSubscription = clickPopupWatchLaterPlaylist$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    setupPopupMutationObserver.unsubscribe();
    createWatchLaterButtonSubscription.unsubscribe();
    clickPopupVideoSaveSubscription.unsubscribe();
    clickPopupWatchLaterPlaylistSubscription.unsubscribe();
  };
}
