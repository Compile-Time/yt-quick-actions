import { initPlaylistObservers } from "./pages/playlist";
import { initVideoObservers } from "./pages/video";
import { initWatchingPlaylistObservers } from "./pages/watching-playlist";
import { initHomeOrSubscriptionsObservers } from "./pages/home-or-subscriptions";
import { contentScriptObserversManager } from "./init-globals";

/**
 * Initialize the relevant observers for the current YouTube page based on location path.
 *
 * This method is used by event listeners for the "yt-navigate-start" event and the "DOMContentLoaded" event. The
 * reason we need both listeners is the following: On the first ever load of YouTube the "DOMContentLoaded" event is
 * triggered. Afterward, the "DOMContentLoaded" event is never triggered again. Therefore, we need to listen to the
 * "yt-navigate-start" event to react to navigation changes inside of YouTube.
 *
 * Note that the order of the path checking if statements is important. More explicit statements should go before broad
 * statements.
 */
function init() {
  contentScriptObserversManager.disconnectAll();

  const pathAndQueryParams = `${location.pathname}${location.search}`;
  if (
    pathAndQueryParams.includes("watch") &&
    pathAndQueryParams.includes("list=WL")
  ) {
    initWatchingPlaylistObservers();
    initVideoObservers();
  } else if (pathAndQueryParams.includes("watch")) {
    initVideoObservers();
  } else if (
    pathAndQueryParams.includes("playlist") &&
    pathAndQueryParams.includes("list=WL")
  ) {
    initPlaylistObservers();
  } else if (pathAndQueryParams.includes("subscriptions")) {
    initHomeOrSubscriptionsObservers();
  } else if (pathAndQueryParams === "/") {
    initHomeOrSubscriptionsObservers();
  }
}

document.addEventListener("yt-navigate-start", () => {
  init();
});

document.addEventListener("DOMContentLoaded", () => {
  init();
});
