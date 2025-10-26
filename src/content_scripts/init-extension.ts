import { fromEvent } from "rxjs";
import { initHomeObserver } from "./pages/home";
import { initPlaylistObservers } from "./pages/playlist";
import { DisconnectFn } from "./types/disconnectable";
import { initWatchVideo } from "./pages/video";
import { initWatchingPlaylist } from "./pages/watching-playlist";

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
  if (pathAndQueryParams.includes("watch") && pathAndQueryParams.includes("list=WL")) {
    disconnectFns.push(initWatchingPlaylist());
    disconnectFns.push(initWatchVideo());
  } else if (pathAndQueryParams.includes("list=WL")) {
    disconnectFns.push(initPlaylistObservers());
  } else if (pathAndQueryParams.includes("watch")) {
    disconnectFns.push(initWatchVideo());
  } else if (pathAndQueryParams.includes("subscriptions")) {
    disconnectFns.push(initHomeObserver());
  } else if (pathAndQueryParams === "/") {
    disconnectFns.push(initHomeObserver());
  }
}

fromEvent(document, "yt-navigate-start").subscribe(() => {
  setupPageSubscription();
});

fromEvent(document, "DOMContentLoaded").subscribe(() => {
  setupPageSubscription();
});
