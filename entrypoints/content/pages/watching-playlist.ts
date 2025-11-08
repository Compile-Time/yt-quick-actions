import { DisconnectFn } from '@/utils/types/disconnectable';
import { BehaviorSubject, catchError, debounceTime, filter, first, map, of, Subject, tap } from 'rxjs';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from '@/utils/html-navigation/filter/navigation-filter';
import { HtmlTreeNavigator } from '@/utils/html-navigation/html-tree-navigator';
import { Ids, SvgDrawPath } from '@/utils/html-element-processing/element-data';
import { createLogger } from '@/utils/logging/log-provider';
import { SETTING_LOG_LEVELS, SettingLogLevels } from '@/utils/storage/settings-data';
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import RemoveVideoPlaylistButton from '@/components/RemoveVideoPlaylistButton.vue';
import { NodeTypes } from '@vue/compiler-core';

const logger = createLogger('watching-playlist');
storage.watch<SettingLogLevels>(SETTING_LOG_LEVELS, (logLevels) => {
  if (logLevels) {
    logger.setLevel(logLevels.watchPlaylist);
  }
});

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

const createRemoveButtons$ = contentMutationSubject.pipe(
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
    const popup = document.evaluate(
      '/html/body/ytd-app/ytd-popup-container',
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: hidden;`);
    return popup;
  }),
  debounceTime(300),
  first(),
  map(() => {
    // "Reload" the DOM element for its children.
    const popup = document.evaluate(
      '/html/body/ytd-app/ytd-popup-container',
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;

    const button = HtmlTreeNavigator.startFrom(popup)
      .findFirst(new SvgDrawPathNavigationFilter(SvgDrawPath.TRASH_ICON))
      .intoParentNavigator()
      .find(new TagNavigationFilter('tp-yt-paper-item'))
      .consume();
    logger.debug('Search for remove entry in popup yielded: ', button);

    if (button) {
      button.click();
    }

    return popup;
  }),
  catchError((err) => {
    logger.error('Error occurred while trying to click the remove entry in the popup', err);
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
  tap((popup) => {
    if (!popup) {
      return;
    }

    clickPopupRemoveButton$.subscribe();
    removeButtonClicked$.next(false);
    popup.setAttribute('style', `${popup.getAttribute('style')} visibility: visible;`);
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

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    createRemoveButtonSubscription.unsubscribe();
    clickPopupRemoveButtonSubscription.unsubscribe();
  };
}
