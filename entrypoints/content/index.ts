import { initWatchingPlaylist } from '@/entrypoints/content/pages/watching-playlist';
import { initWatchVideo } from '@/entrypoints/content/pages/video';
import { initPlaylistObservers } from '@/entrypoints/content/pages/playlist';
import { initHomeObserver } from '@/entrypoints/content/pages/home';
import { DisconnectFn } from '@/utils/types/disconnectable';
import './fa-brands-400.ttf';
import './fa-brands-400.woff2';
import './fa-solid-900.ttf';
import './fa-solid-900.woff2';
import './fontawesome.min.css';
import './solid.min.css';
import './yt-quick-actions.css';

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
    const disconnectFns: DisconnectFn[] = [];

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
      disconnectFns.forEach((fn) => {
        fn();
      });

      const pathAndQueryParams = `${location.pathname}${location.search}`;
      if (pathAndQueryParams.includes('watch') && pathAndQueryParams.includes('list=WL')) {
        disconnectFns.push(initWatchingPlaylist(ctx));
        disconnectFns.push(initWatchVideo(ctx, CurrentPage.WATCH_VIDEO));
      } else if (pathAndQueryParams.includes('list=WL')) {
        disconnectFns.push(initPlaylistObservers(ctx));
      } else if (pathAndQueryParams.includes('watch')) {
        disconnectFns.push(initWatchVideo(ctx, CurrentPage.WATCH_VIDEO));
      } else if (pathAndQueryParams.includes('subscriptions')) {
        disconnectFns.push(initHomeObserver(ctx));
      } else if (pathAndQueryParams === '/') {
        disconnectFns.push(initHomeObserver(ctx));
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
