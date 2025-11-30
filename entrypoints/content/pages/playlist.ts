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
import { ContentScriptContext } from 'wxt/utils/content-script-context';
import RemoveVideoPlaylistButton from '@/components/RemoveVideoPlaylistButton.vue';
import MoveTopBottomContainer from '@/components/MoveTopBottomContainer.vue';
import { allowYtPopupVisibility } from '@/utils/yt-popup-visibility';
import { getYtPopupFromDom } from '@/utils/yt-popup';
import ScrollToButtons from '@/components/ScrollToButtons.vue';
import { HtmlParentNavigator } from '@/utils/html-navigation/html-parent-navigator';
import { getLogger, LoggerKind } from '@/entrypoints/content/state/logger';
import {
  playlistMoveTopBottomDisabled$,
  playlistRemoveDisabled$,
  playlistScrollTopBottomDisabled$,
  playlistSearchStrings$,
} from '@/entrypoints/content/state/settings';

const logger = getLogger(LoggerKind.PLAYLIST_SCRIPT);

const contentScriptContext$ = new BehaviorSubject<ContentScriptContext | null>(null);

const contentMutation$ = new Subject<MutationRecord>();
const contentMutationObserver = new MutationObserver((mutations) => {
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
      contentMutation$.next(mutation);
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

const menuElementForSetup$ = new Subject<HTMLElement>();
const dragContainerForSetup$ = new Subject<{
  dragContainer: HTMLElement;
  menuElement: HTMLElement;
}>();

const addScrollToButtons$ = contentMutation$.pipe(
  filter(() => !playlistScrollTopBottomDisabled$.value),
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

    const scrollToButtons = createIntegratedUi(contentScriptContext$.value!, {
      anchor: playlistSideBarHeader,
      position: 'inline',
      append: 'last',
      onMount: (container) => {
        container.style.position = 'absolute';
        container.style.bottom = '0';
        container.style.right = '0';
        const app = createApp(ScrollToButtons, {
          scrollContainer,
          scrollWindow: true,
          pillLook: true,
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

const addCustomVideoItemsToDom$ = contentMutation$.pipe(
  filter((record) => record.target.nodeName === 'YTD-PLAYLIST-VIDEO-RENDERER'),
  tap((record) => {
    const menuElement = HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter('div', 'menu'))
      .consume();
    if (menuElement) {
      menuElementForSetup$.next(menuElement);
    }

    const dragContainer = HtmlTreeNavigator.startFrom(record.target as HTMLElement)
      .findFirst(new IdNavigationFilter('div', 'index-container'))
      .consume();
    if (dragContainer && menuElement) {
      dragContainerForSetup$.next({ dragContainer, menuElement });
    }
  }),
  catchError((error) => {
    contentMutationObserver.disconnect();
    return throwError(() => error);
  }),
);

const setupRemoveButton$ = menuElementForSetup$.pipe(
  filter(() => !playlistRemoveDisabled$.value),
  tap((menuElement) => {
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
  }),
);

const setupMoveButtons$ = dragContainerForSetup$.pipe(
  filter(() => !playlistMoveTopBottomDisabled$.value),
  tap(({ dragContainer, menuElement }) => {
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
    if (playlistSearchStrings$.value.removeEntry) {
      logger.debug(`Using search string "${playlistSearchStrings$.value.removeEntry}" for remove entry`);
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
        .findFirst(new TextNavigationFilter('YTD-MENU-SERVICE-ITEM-RENDERER', playlistSearchStrings$.value.removeEntry))
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
    if (playlistSearchStrings$.value.moveToTopEntry) {
      logger.debug(`Using search string "${playlistSearchStrings$.value.moveToTopEntry}" for move to top entry`);
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(
          new TextNavigationFilter('YTD-MENU-SERVICE-ITEM-RENDERER', playlistSearchStrings$.value.moveToTopEntry),
        )
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
    if (playlistSearchStrings$.value.moveToBottomEntry) {
      logger.debug(`Using search string "${playlistSearchStrings$.value.moveToBottomEntry}" for move to bottom entry`);
      clickable = HtmlTreeNavigator.startFrom(popup)
        .findFirst(
          new TextNavigationFilter('YTD-MENU-SERVICE-ITEM-RENDERER', playlistSearchStrings$.value.moveToBottomEntry),
        )
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

  const contentMutationObserverConfig: MutationObserverInit = { attributes: false, childList: true, subtree: true };
  contentMutationObserver.observe(ytdPopupManager, contentMutationObserverConfig);

  const popupContainer = HtmlTreeNavigator.startFrom(document.body)
    .findFirst(new TagNavigationFilter('ytd-popup-container'))
    .consume()!;
  const popupObserverConfig: MutationObserverInit = { attributes: true, childList: true, subtree: true };
  popupMutationObserver.observe(popupContainer, popupObserverConfig);

  const addRemoveButtonToPlaylistSubscription = addCustomVideoItemsToDom$.subscribe();
  const clickRemoveItemSubscription = clickRemoveItemInPopup$.subscribe();
  const clickMoveTopButtonSubscription = clickMoveTopButtonInPopup$.subscribe();
  const clickMoveBottomButtonSubscription = clickMoveBottomButtonInPopup$.subscribe();
  const addScrollToEndButtonSubscription = addScrollToButtons$.subscribe();
  const setupRemoveButtonSubscription = setupRemoveButton$.subscribe();
  const setupMoveButtonsSubscription = setupMoveButtons$.subscribe();

  return () => {
    contentMutationObserver.disconnect();
    popupMutationObserver.disconnect();
    addRemoveButtonToPlaylistSubscription.unsubscribe();
    clickRemoveItemSubscription.unsubscribe();
    clickMoveTopButtonSubscription.unsubscribe();
    clickMoveBottomButtonSubscription.unsubscribe();
    addScrollToEndButtonSubscription.unsubscribe();
    setupRemoveButtonSubscription.unsubscribe();
    setupMoveButtonsSubscription.unsubscribe();
  };
}
