import { DisconnectFn } from '@/utils/types/disconnectable';
import { BehaviorSubject, catchError, debounceTime, filter, first, map, of, Subject, tap } from 'rxjs';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
  TextNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import { Ids, SvgDrawPath } from '@/utils/html-element-processing/element-data';
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import RemoveVideoPlaylistButton from '@/components/RemoveVideoPlaylistButton.vue';
import { NodeTypes } from '@vue/compiler-core';
import { getYtPopupFromDom, hideYtPopup } from '#imports';
import ScrollToButtons from '@/components/ScrollToButtons.vue';
import { getLogger, LoggerKind } from '@/entrypoints/content/state/logger';
import {
  watchPlaylistRemoveDisabled$,
  watchPlaylistScrollTopBottomDisabled$,
  watchPlaylistSearchStrings$,
} from '@/entrypoints/content/state/settings';

const logger = getLogger(LoggerKind.WATCHING_PLAYLIST_SCRIPT);

const contentScriptContext$ = new BehaviorSubject<ContentScriptContext | null>(null);

const contentMutationSubject = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (Array.from(mutation.addedNodes).every((node) => node.nodeName !== 'BUTTON')) {
      contentMutationSubject.next(mutation);
    }
  });
});

const popupMutationSubject = new Subject<MutationRecord>();
const popupMutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const pushMutation =
      mutation.attributeName !== 'style' &&
      Array.from(mutation.addedNodes).every((node) => {
        if (node.nodeType === NodeTypes.ELEMENT) {
          const element = node as HTMLElement;
          return element.id !== Ids.QA_REMOVE_BUTTON && element.getAttribute('data-v-app') === null;
        }
        return true;
      });
    if (pushMutation) {
      popupMutationSubject.next(mutation);
    }
  });
});

const removeButtonClicked$ = new BehaviorSubject<boolean>(false);

const addScrollToButtons$ = contentMutationSubject.pipe(
  filter(() => !watchPlaylistScrollTopBottomDisabled$.value),
  tap((record) => {
    logger.debug('Mutation record: ', record);
  }),
  filter(
    (record) =>
      record.target.nodeName === 'DIV' &&
      record.target.nodeType === NodeTypes.ELEMENT &&
      (record.target as HTMLElement).id === 'index-container',
  ),
  first(),
  tap((record: MutationRecord) => {
    const playlistContainer = HtmlParentNavigator.startFrom(record.target as HTMLElement)
      .find(new IdNavigationFilter('div', 'container'))
      .intoParentNavigator(true)
      .find(new IdNavigationFilter('div', 'container'))
      .consume();
    logger.debug('Search for playlist container yielded: ', playlistContainer);

    const scrollContainer = HtmlTreeNavigator.startFrom(playlistContainer)
      .findFirst(new IdNavigationFilter('div', 'items'))
      .consume();
    logger.debug('Search for scroll container yielded: ', scrollContainer);

    const actionContainer = HtmlTreeNavigator.startFrom(playlistContainer)
      .findFirst(new IdNavigationFilter('div', 'top-level-buttons-computed'))
      .consume();
    logger.debug('Search for action container yielded: ', actionContainer);

    const scrollToButtons = createIntegratedUi(contentScriptContext$.value!, {
      anchor: actionContainer,
      position: 'inline',
      append: 'last',
      onMount: (container) => {
        const app = createApp(ScrollToButtons, {
          scrollContainer,
        });
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        app?.unmount();
      },
    });
    scrollToButtons.mount();
  }),
);

const createRemoveButtons$ = contentMutationSubject.pipe(
  filter(() => !watchPlaylistRemoveDisabled$.value),
  filter((record) => record.target.nodeName === 'DIV' && (record.target as HTMLElement).id === 'menu'),
  filter((record) =>
    HtmlParentNavigator.startFrom(record.target as HTMLElement)
      .find(new IdNavigationFilter('div', 'items'))
      .exists(),
  ),
  tap((record) => {
    const menuElement = record.target as HTMLElement;
    const optionsButton = HtmlTreeNavigator.startFrom(menuElement)
      .findFirst(new IdNavigationFilter('button', 'button'))
      .consume()!;
    logger.debug('Search for more options button yielded: ', optionsButton);

    const removeButton = createIntegratedUi(contentScriptContext$.value!, {
      anchor: menuElement.parentElement!,
      position: 'inline',
      onMount: (container) => {
        container.setAttribute('style', 'display: flex; align-items: center');
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
  }),
);

const clickPopupRemoveButton$ = popupMutationSubject.pipe(
  filter(() => removeButtonClicked$.value),
  filter((record) => record.target.nodeName === 'TP-YT-IRON-DROPDOWN'),
  tap(() => {
    hideYtPopup();
  }),
  debounceTime(300),
  first(),
  map(() => {
    const popup = getYtPopupFromDom();

    let clickable: HTMLElement | null;
    if (watchPlaylistSearchStrings$.value.removeEntry) {
      logger.debug(`Using search string "${watchPlaylistSearchStrings$.value.removeEntry}" for remove entry`);
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(
          new TextNavigationFilter('ytd-menu-service-item-renderer', watchPlaylistSearchStrings$.value.removeEntry),
        )
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
  }),
  catchError((err) => {
    logger.error('Error occurred while trying to click the remove entry in the popup', err);
    popupMutationObserver.disconnect();

    return of(true);
  }),
  tap((errored) => {
    removeButtonClicked$.next(false);
    allowYtPopupVisibility();

    if (errored) {
      return;
    }

    clickPopupRemoveButton$.subscribe();
  }),
);

export function initWatchingPlaylist(ctx: ContentScriptContext): DisconnectFn {
  contentScriptContext$.next(ctx);

  // Avoid listening to the whole DOM by using the ytd-page-manager element.
  const ytdPageManager = document.evaluate(
    '//*[@id="page-manager"]',
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
  const popupObserverConf = { attributes: true, childList: false, subtree: true };
  popupMutationObserver.observe(popupContainer, popupObserverConf);

  const createRemoveButtonSubscription = createRemoveButtons$.subscribe();
  const clickPopupRemoveButtonSubscription = clickPopupRemoveButton$.subscribe();
  const addScrollToEndButtonSubscription = addScrollToButtons$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    createRemoveButtonSubscription.unsubscribe();
    clickPopupRemoveButtonSubscription.unsubscribe();
    addScrollToEndButtonSubscription.unsubscribe();
  };
}
