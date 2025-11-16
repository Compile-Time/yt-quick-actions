import { BehaviorSubject, catchError, debounceTime, filter, first, map, of, Subject, tap, throwError } from 'rxjs';
import { DisconnectFn } from '@/utils/types/disconnectable';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
  TextNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { Ids, SvgDrawPath } from '@/utils/html-element-processing/element-data';
import {
  SETTING_LOG_LEVELS,
  SETTING_SEARCH_STRINGS,
  SettingLogLevels,
  SettingSearchStrings,
} from '@/utils/storage/settings-data';
import { createLogger } from '@/utils/logging/log-provider';
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import RemoveVideoPlaylistButton from '@/components/RemoveVideoPlaylistButton.vue';
import MoveTopBottomContainer from '@/components/MoveTopBottomContainer.vue';
import { allowYtPopupVisibility } from '@/utils/yt-popup-visibility';
import { getYtPopupFromDom } from '@/utils/yt-popup';
import ScrollToContainerEndButton from '@/components/ScrollToContainerEndButton.vue';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';

const logger = createLogger('playlist');
storage.watch<SettingLogLevels>(SETTING_LOG_LEVELS, (logLevels) => {
  if (logLevels?.playlist) {
    logger.setLevel(logLevels.playlist);
  }
});

let searchStrings: SettingSearchStrings['playlist'] = {
  removeEntry: undefined,
  moveToTopEntry: undefined,
  moveToBottomEntry: undefined,
};
storage.watch<SettingSearchStrings>(SETTING_SEARCH_STRINGS, (settingSearchStrings) => {
  logger.debug('Setting search strings changed: ', settingSearchStrings);
  if (settingSearchStrings?.playlist) {
    searchStrings = settingSearchStrings.playlist;
  }
});
storage.getItem<SettingSearchStrings>(SETTING_SEARCH_STRINGS).then((settingSearchStrings) => {
  logger.debug('Loaded setting search strings: ', settingSearchStrings);
  if (settingSearchStrings?.playlist) {
    searchStrings = settingSearchStrings.playlist;
  }
});

const contentScriptContext$ = new BehaviorSubject<ContentScriptContext | null>(null);

const videoListMutationSubject = new Subject<MutationRecord>();
const videoListMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // A button is added to the DOM by the extension which can be caught by the observer causing an infinite loop.
    if (
      Array.from(mutation.addedNodes).every((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          return (
            element.id !== Ids.QA_FLEX_CONTAINER_MOVE_BUTTONS &&
            element.id !== Ids.QA_REMOVE_BUTTON &&
            element.getAttribute('data-v-app') === null
          );
        }
        return true;
      })
    ) {
      videoListMutationSubject.next(mutation);
    }
  });
});

const popupMutation$ = new Subject<MutationRecord>();
const popupMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName !== 'style') {
      popupMutation$.next(mutation);
    }
  });
});
const popupReadyAndHidden$ = popupMutation$.pipe(
  tap(() => {
    hideYtPopup();
  }),
  debounceTime(750),
);

const removeButtonClicked$ = new BehaviorSubject(false);
const moveTopButtonClicked$ = new BehaviorSubject(false);
const moveBottomButtonClicked$ = new BehaviorSubject(false);

const addScrollToEndButton$ = videoListMutationSubject.pipe(
  filter((record) => record.target.nodeName === 'YTD-PLAYLIST-VIDEO-RENDERER'),
  first(),
  tap((record: MutationRecord) => {
    const playlistSideBarHeader = document.evaluate(
      '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-playlist-header-renderer/div/div[2]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue! as HTMLElement;
    playlistSideBarHeader.style.position = 'relative';

    const scrollContainer = HtmlParentNavigator.startFrom(record.target as HTMLElement)
      .find(new IdNavigationFilter('div', 'primary'))
      .consume();
    logger.debug('Search for scroll container yielded: ', scrollContainer);

    const scrollToBottomButton = createIntegratedUi(contentScriptContext$.value!, {
      anchor: playlistSideBarHeader,
      position: 'inline',
      append: 'last',
      onMount: (container) => {
        container.style.position = 'absolute';
        container.style.bottom = '0';
        container.style.right = '0';
        const app = createApp(ScrollToContainerEndButton, {
          scrollContainer,
        });
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        app?.unmount();
      },
    });
    scrollToBottomButton.mount();
  }),
);

const addCustomButtonsToDom$ = videoListMutationSubject.pipe(
  filter((record) => record.target.nodeName === 'YTD-PLAYLIST-VIDEO-RENDERER'),
  tap((record) => {
    const menuElement = HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter('div', 'menu'))
      .consume();
    if (menuElement) {
      const optionsButton = HtmlTreeNavigator.startFrom(menuElement)
        .findFirst(new IdNavigationFilter('button', 'button'))
        .consume()!;

      const removeButton = createIntegratedUi(contentScriptContext$.value!, {
        anchor: menuElement.parentElement,
        position: 'inline',
        onMount: (container) => {
          const app = createApp(RemoveVideoPlaylistButton, {
            optionsButton,
            removeButtonClickedSubject: removeButtonClicked$,
          });
          app.mount(container);
          return app;
        },
        onRemove: (app) => {
          app?.unmount();
        },
      });

      removeButton.mount();
    }

    const dragContainer = HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter('div', 'index-container'))
      .consume();
    if (dragContainer && menuElement) {
      dragContainer.style.position = 'relative';
      const optionsButton = HtmlTreeNavigator.startFrom(menuElement)
        .findFirst(new IdNavigationFilter('button', 'button'))
        .consume()!;

      const moveToTopOrBottomContainer = createIntegratedUi(contentScriptContext$.value!, {
        anchor: dragContainer,
        position: 'inline',
        onMount: (container) => {
          container.style.position = 'absolute';
          const app = createApp(MoveTopBottomContainer, {
            optionsButton,
            moveTopButtonClickedSubject: moveTopButtonClicked$,
            moveBottomButtonClickedSubject: moveBottomButtonClicked$,
          });
          app.mount(container);
          return app;
        },
        onRemove: (app) => {
          app?.unmount();
        },
      });
      moveToTopOrBottomContainer.mount();
    }
  }),
  catchError((error) => {
    videoListMutationObserver.disconnect();
    return throwError(() => error);
  }),
);

/**
 * Try to click the remove button as early as possible, so there is no popup flash in YouTube.
 *
 * Implementation details:
 * - We check with a behavior subject if the remove button was clicked, so the popup menu can be opened for other
 *   actions manually.
 * - We rely on the MutationObserver to detect if the popup is in a state where we can click on the remove button.
 *   We listen to the SVG element for this since other elements yield unreliable results.
 * - The span mutation records are windowed into new observables so that we can immediately click the remove button
 *   and stop listening to further span records - `first()`. This also helps with isolating the remove
 *   operation for multiple videos since they will end up in new subscriptions.
 * - The DOM element for the popup container is "reloaded" with an XPath query because mutation records can have
 *   stale references/data.
 * - Finally, set the state of the behavior subject to false so that the dialog is usable for other actions again.
 */
const clickRemoveItemInPopup$ = popupReadyAndHidden$.pipe(
  filter(() => removeButtonClicked$.value),
  first(),
  map(() => {
    const popup = getYtPopupFromDom();

    let clickable;
    if (searchStrings.removeEntry) {
      logger.debug(`Using search string "${searchStrings.removeEntry}" for remove entry`);
      /*
      It's sadly not simple enough to just look for text inside a span tag.
      Therefore, below are the relevant tags for the menu items. These were taken with the help of console.log statements.

      YTD-MENU-SERVICE-ITEM-RENDERER: Add to queue content
      YTD-MENU-NAVIGATION-ITEM-RENDERER: Save to playlist
      YTD-MENU-SERVICE-ITEM-RENDERER: Remove from Watch later
      YTD-MENU-SERVICE-ITEM-DOWNLOAD-RENDERER: Download
      YTD-MENU-SERVICE-ITEM-RENDERER: Share
      YTD-MENU-SERVICE-ITEM-RENDERER: Move to top
      YTD-MENU-SERVICE-ITEM-RENDERER: Move to bottom
       */
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(new TextNavigationFilter('YTD-MENU-SERVICE-ITEM-RENDERER', searchStrings.removeEntry))
        .consume();
    } else {
      logger.debug('Using default icon search for remove entry');
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.TRASH_ICON))
        .intoParentNavigator()
        .find(new TagNavigationFilter('tp-yt-paper-item'))
        .consume();
    }

    logger.debug('Search for remove entry in popup yielded: ', clickable);

    if (clickable) {
      clickable.click();
    }

    return popup;
  }),
  catchError((err) => {
    logger.error('Error while trying to click the remove entry in popup: ', err);
    popupMutationObserver.disconnect();
    allowYtPopupVisibility();
    return of(undefined);
  }),
  tap((popup) => {
    removeButtonClicked$.next(false);

    if (popup) {
      allowYtPopupVisibility(popup);
      clickRemoveItemInPopup$.subscribe();
    }
  }),
);

const clickMoveTopButtonInPopup$ = popupReadyAndHidden$.pipe(
  filter(() => moveTopButtonClicked$.value),
  first(),
  map(() => {
    // "Reload" the DOM element for its children.
    const popup = getYtPopupFromDom();

    let clickable;
    if (searchStrings.moveToTopEntry) {
      logger.debug(`Using search string "${searchStrings.moveToTopEntry}" for move to top entry`);
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(new TextNavigationFilter('YTD-MENU-SERVICE-ITEM-RENDERER', searchStrings.moveToTopEntry))
        .consume();
    } else {
      logger.debug('Using default icon search for move to top entry');
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_TOP))
        .intoParentNavigator()
        .find(new TagNavigationFilter('tp-yt-paper-item'))
        .consume();
    }

    logger.debug('Search for move to top entry in popup yielded: ', clickable);

    if (clickable) {
      clickable.click();
    }

    return popup;
  }),
  catchError((err) => {
    console.error('Error while trying to click the move to top entry in popup: ', err);
    allowYtPopupVisibility();

    popupMutationObserver.disconnect();
    return of(null);
  }),
  tap((popup) => {
    moveTopButtonClicked$.next(false);

    if (popup) {
      allowYtPopupVisibility(popup);
      clickMoveTopButtonInPopup$.subscribe();
    }
  }),
);

const clickMoveBottomButtonInPopup$ = popupReadyAndHidden$.pipe(
  filter(() => moveBottomButtonClicked$.value),
  first(),
  map(() => {
    const popup = getYtPopupFromDom();

    let clickable;
    if (searchStrings.moveToBottomEntry) {
      logger.debug(`Using search string "${searchStrings.moveToBottomEntry}" for move to bottom entry`);
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(new TextNavigationFilter('YTD-MENU-SERVICE-ITEM-RENDERER', searchStrings.moveToBottomEntry))
        .consume();
    } else {
      logger.debug('Using default icon search for move to bottom entry');
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.PLAYLIST_MOVE_TO_BOTTOM))
        .intoParentNavigator()
        .find(new TagNavigationFilter('tp-yt-paper-item'))
        .consume();
    }

    logger.debug('Search for move to bottom entry in popup yielded: ', clickable);
    if (clickable) {
      clickable.click();
    }

    return popup;
  }),
  catchError((err) => {
    logger.error('Error while trying to click the move to bottom entry in popup: ', err);
    allowYtPopupVisibility();

    popupMutationObserver.disconnect();
    return of(null);
  }),
  tap((popup) => {
    moveBottomButtonClicked$.next(false);

    if (popup) {
      allowYtPopupVisibility(popup);
      clickMoveBottomButtonInPopup$.subscribe();
    }
  }),
);

export function initPlaylistObservers(ctx: ContentScriptContext): DisconnectFn {
  contentScriptContext$.next(ctx);

  // Avoid listening to the whole DOM by using the ytd-page-manager element.
  const ytdPopupManager = document.evaluate(
    '/html/body/ytd-app/div[1]/ytd-page-manager',
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLElement;

  const videoListObserverConfig: MutationObserverInit = { attributes: false, childList: true, subtree: true };
  videoListMutationObserver.observe(ytdPopupManager, videoListObserverConfig);

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter('ytd-popup-container'))
    .consume()!;
  const popupObserverConfig: MutationObserverInit = { attributes: true, childList: true, subtree: true };
  popupMutationObserver.observe(popupContainer, popupObserverConfig);

  const addRemoveButtonToPlaylistSubscription = addCustomButtonsToDom$.subscribe();
  const clickRemoveItemSubscription = clickRemoveItemInPopup$.subscribe();
  const clickMoveTopButtonSubscription = clickMoveTopButtonInPopup$.subscribe();
  const clickMoveBottomButtonSubscription = clickMoveBottomButtonInPopup$.subscribe();
  const addScrollToEndButtonSubscription = addScrollToEndButton$.subscribe();

  return () => {
    videoListMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    addRemoveButtonToPlaylistSubscription.unsubscribe();
    clickRemoveItemSubscription.unsubscribe();
    clickMoveTopButtonSubscription.unsubscribe();
    clickMoveBottomButtonSubscription.unsubscribe();
    addScrollToEndButtonSubscription.unsubscribe();
  };
}
