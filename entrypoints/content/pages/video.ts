import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  merge,
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
  TextNavigationFilter,
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
import { getTpYtIronDropDownFromDom, getYtPopupFromDom } from '#imports';
import { CurrentPage } from '@/entrypoints/content';

const logger = createLogger('video');
storage.watch<SettingLogLevels>(SETTING_LOG_LEVELS, (logLevels) => {
  if (logLevels?.watchVideo) {
    logger.setLevel(logLevels.watchVideo);
  }
});

let watchVideoSearchStrings: SettingSearchStrings['watchVideo'] = {
  watchLaterEntry: undefined,
  videoSaveButton: undefined,
};
let watchPlaylistSearchStrings: SettingSearchStrings['watchPlaylist'] = {
  watchLaterEntry: undefined,
  removeEntry: undefined,
  videoSaveButton: undefined,
};

storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Watch video search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.watchVideo) {
    watchVideoSearchStrings = settingSearchStrings.watchVideo;
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded watch video search strings: ', settingSearchStrings);
  if (settingSearchStrings?.watchVideo) {
    watchVideoSearchStrings = settingSearchStrings.watchVideo;
  }
});
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Watch playlist search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.watchPlaylist) {
    watchPlaylistSearchStrings = settingSearchStrings.watchPlaylist;
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded watch playlist search strings: ', settingSearchStrings);
  if (settingSearchStrings?.watchPlaylist) {
    watchPlaylistSearchStrings = settingSearchStrings.watchPlaylist;
  }
});

const contentScriptContext$ = new BehaviorSubject<ContentScriptContext | null>(null);
const currentPage$ = new BehaviorSubject<CurrentPage | null>(null);

const contentMutation$ = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (Array.from(mutation.addedNodes).every((node) => node.nodeName !== 'BUTTON')) {
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
const saveVideoInOptionsClicked$ = new BehaviorSubject<boolean>(false);

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
    let saveToPlaylistButton: HTMLElement | null;
    const videoSaveSearchString =
      currentPage$.value === CurrentPage.WATCHING_PLAYLIST
        ? watchPlaylistSearchStrings.videoSaveButton
        : watchVideoSearchStrings.videoSaveButton;

    if (videoSaveSearchString) {
      logger.debug(`Using custom search string "${videoSaveSearchString}" for save to playlist button`);
      saveToPlaylistButton = HtmlTreeNavigator.startFrom(topLevelButtonsComputed.parentElement!)
        .findFirst(new TextNavigationFilter('button', videoSaveSearchString))
        .consume();
    } else {
      logger.debug('Using default icon search for save to playlist button');
      saveToPlaylistButton = HtmlTreeNavigator.startFrom(topLevelButtonsComputed.parentElement!)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
        .intoParentNavigator()
        .find(new TagNavigationFilter('button'))
        .consume();
    }
    logger.debug('Search for save to playlist button yielded: ', saveToPlaylistButton);

    let popupTrigger;
    let subjectTrigger;

    if (saveToPlaylistButton) {
      popupTrigger = saveToPlaylistButton;
      subjectTrigger = saveVideoInOptionsClicked$;
    } else {
      popupTrigger = moreOptionsButton.children[0] as HTMLElement;
      subjectTrigger = watchLaterButtonClicked$;
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

const clickPopupVideoSaveButton$ = popupMutation$.pipe(
  filter(() => watchLaterButtonClicked$.value && !saveVideoInOptionsClicked$.value),
  filter((record) => record.target.nodeName === 'TP-YT-IRON-DROPDOWN'),
  tap((record) => {
    hideYtPopup();
  }),
  debounceTime(300),
  first(),
  tap(() => {
    const tpYtIronDropdown = getTpYtIronDropDownFromDom();
    const videoSaveSearchString =
      currentPage$.value === CurrentPage.WATCHING_PLAYLIST
        ? watchPlaylistSearchStrings.videoSaveButton
        : watchVideoSearchStrings.videoSaveButton;

    let clickable: HTMLElement | null;
    if (videoSaveSearchString) {
      logger.debug(`Using custom search string "${videoSaveSearchString}" for save entry in popup`);
      clickable = HtmlTreeNavigator.startFrom(tpYtIronDropdown)
        .findFirst(new TextNavigationFilter('tp-yt-paper-item', videoSaveSearchString))
        .consume();
    } else {
      logger.debug('Using default icon search for save entry in popup');
      clickable = HtmlTreeNavigator.startFrom(tpYtIronDropdown as HTMLElement)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE))
        .intoParentNavigator()
        .find(new TagNavigationFilter('tp-yt-paper-item'))
        .consume();
    }
    logger.debug('Search for save to playlist entry in popup yielded: ', clickable);

    if (clickable) {
      clickable.click();
    }
    saveVideoInOptionsClicked$.next(true);
  }),
  map(() => false),
  catchError((error) => {
    logger.error('Error occurred while trying to click the save to playlist entry in the popup', error);
    popupMutationObserver.disconnect();

    return of(true);
  }),
  tap((errored) => {
    allowYtPopupVisibility();
    watchLaterButtonClicked$.next(false);

    if (errored) {
      return;
    }

    clickPopupVideoSaveButton$.subscribe();
  }),
);

const clickPopupWatchLaterPlaylist$ = popupMutation$.pipe(
  filter(() => saveVideoInOptionsClicked$.value),
  filter((record) => record.target.nodeName === 'TP-YT-IRON-DROPDOWN'),
  tap((record) => {
    hideYtPopup();
  }),
  debounceTime(600),
  first(),
  tap(() => {
    const popupContainer = getYtPopupFromDom();
    const watchLaterSearchString =
      currentPage$.value === CurrentPage.WATCHING_PLAYLIST
        ? watchPlaylistSearchStrings.watchLaterEntry
        : watchVideoSearchStrings.watchLaterEntry;

    let clickable: HTMLElement | null;
    if (watchLaterSearchString) {
      logger.debug(`Using custom search string "${watchLaterSearchString}" for watch later playlist`);
      clickable = HtmlTreeNavigator.startFrom(popupContainer)
        .findFirst(new TextNavigationFilter('span', watchLaterSearchString))
        .consume();
    } else {
      logger.debug('Using default icon search for watch later playlist');
      clickable = HtmlTreeNavigator.startFrom(popupContainer)
        .findFirst(new TagNavigationFilter('yt-list-item-view-model'))
        .consume();
    }
    logger.debug('Search for watch later playlist in popup yielded: ', clickable);

    if (clickable) {
      clickable.click();
    }
  }),
  map(() => false),
  catchError((err) => {
    logger.error('Error occurred while trying to click the watch later playlist in the popup', err);
    popupMutationObserver.disconnect();

    return of(true);
  }),
  tap((errored) => {
    watchLaterButtonClicked$.next(false);
    saveVideoInOptionsClicked$.next(false);
    allowYtPopupVisibility();

    if (errored) {
      return;
    }

    clickPopupWatchLaterPlaylist$.subscribe();
  }),
);

const ytPopupFoundDuringInit$ = new BehaviorSubject<HTMLElement | null>(null);
const ytPopupReady$ = merge([
  contentMutation$.pipe(
    filter((record) => record.target.nodeName === 'YTD-APP'),
    map((record) => record.target as unknown as HTMLElement),
  ),
  ytPopupFoundDuringInit$,
]).pipe(
  filter((element) => !!element),
  map(() => true),
  shareReplay({
    bufferSize: 1,
    refCount: true,
  }),
);

const setupPopupMutationObserver$ = ytPopupReady$.pipe(
  tap(() => {
    const popupContainer = HtmlTreeNavigator.startFrom(document.body)
      .findFirst(new TagNavigationFilter('ytd-popup-container'))
      .consume()!;
    const popupObserverConf = { attributes: true, childList: false, subtree: true };
    popupMutationObserver.observe(popupContainer, popupObserverConf);
  }),
);

export function initWatchVideo(ctx: ContentScriptContext, currentPage: CurrentPage): DisconnectFn {
  contentScriptContext$.next(ctx);
  currentPage$.next(currentPage);

  const contentObserverConf = { attributes: false, childList: true, subtree: true };
  contentMutationObserver.observe(document.body, contentObserverConf);

  const popupContainer = getYtPopupFromDom();
  if (popupContainer) {
    ytPopupFoundDuringInit$.next(popupContainer);
  }

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
