export enum PageEvent {
  NAVIGATED_TO_PLAYLIST = "navigated-to-playlist",
  NAVIGATED_TO_VIDEO = "navigated-to-video",
  NAVIGATED_TO_HOME_PAGE = "navigated-to-home-page",
  NAVIGATED_TO_SUBSCRIPTION = "navigated-to-subscription",
  NAVIGATED_TO_VIDEO_IN_PLAYLIST = "navigated-to-video-in-playlist",
}

export class PageEventUtils {
  static getNotGivenValues(pageEvents: PageEvent[]): PageEvent[] {
    return Object.values(PageEvent).filter(
      (value) => !pageEvents.includes(value)
    );
  }
}
