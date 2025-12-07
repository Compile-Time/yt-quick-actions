import { initWatchingPlaylist } from '@/entrypoints/content/pages/watching-playlist';
import { initWatchVideo } from '@/entrypoints/content/pages/video';
import { initPlaylistObservers } from '@/entrypoints/content/pages/playlist';
import { initHomeObserver } from '@/entrypoints/content/pages/home';
import { CleanupFn } from '@/utils/types/cleanup';
import './fa-brands-400.ttf';
import './fa-brands-400.woff2';
import './fa-solid-900.ttf';
import './fa-solid-900.woff2';
import './fontawesome.min.css';
import './solid.min.css';
import './yt-quick-actions.css';
import {
  featuresStorageUnwatch,
  homeScriptDisabled$,
  playlistScriptDisabled$,
  searchStringStorageUnwatch,
  videoScriptDisabled$,
  watchingPlaylistScriptDisabled$,
} from '@/entrypoints/content/state/settings';

export enum CurrentPage {
  HOME = 'HOME',
  WATCHING_PLAYLIST = 'WATCHING_PLAYLIST',
  WATCH_VIDEO = 'WATCH_VIDEO',
  PLAYLIST = 'PLAYLIST',
}

export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  runAt: 'document_start',
  main(ctx) {
    const cleanupFns: CleanupFn[] = [];

    /**
     * Initialize the relevant observers for the current YouTube page based on the location path.
     *
     * This method is used by for the "yt-navigate-start" event and the "DOMContentLoaded" event. The reason we need
     * both listeners is the following: On the first ever load of YouTube, the "DOMContentLoaded" event is triggered.
     * Afterward, the "DOMContentLoaded" event is never triggered again. Therefore, we need to listen to the
     * "yt-navigate-start" event to react to navigation changes inside YouTube.
     *
     * Note that the order of the path checking if statements is important. More explicit statements should go before broad
     * statements.
     */
    function setupPageSubscription(): void {
      cleanupFns.forEach((fn) => {
        fn();
      });

      if (ctx.isInvalid) {
        // Extension is updated, uninstalled or disabled during runtime.
        featuresStorageUnwatch();
        searchStringStorageUnwatch();
        return;
      }

      const pathAndQueryParams = `${location.pathname}${location.search}`;
      if (pathAndQueryParams.includes('watch') && pathAndQueryParams.includes('list=WL')) {
        if (!videoScriptDisabled$.value) {
          cleanupFns.push(initWatchVideo(ctx, CurrentPage.WATCHING_PLAYLIST));
        }
        if (!watchingPlaylistScriptDisabled$.value) {
          cleanupFns.push(initWatchingPlaylist(ctx));
        }
      } else if (!playlistScriptDisabled$.value && pathAndQueryParams.includes('list=WL')) {
        cleanupFns.push(initPlaylistObservers(ctx));
      } else if (!videoScriptDisabled$.value && pathAndQueryParams.includes('watch')) {
        cleanupFns.push(initWatchVideo(ctx, CurrentPage.WATCH_VIDEO));
      } else if (!homeScriptDisabled$.value && pathAndQueryParams.includes('subscriptions')) {
        cleanupFns.push(initHomeObserver(ctx));
      } else if (!homeScriptDisabled$.value && pathAndQueryParams === '/') {
        cleanupFns.push(initHomeObserver(ctx));
      }
    }

    ctx.addEventListener(document, 'yt-navigate-start', () => {
      setupPageSubscription();
    });

    ctx.addEventListener(document, 'DOMContentLoaded', () => {
      setupPageSubscription();
    });
  },
});
