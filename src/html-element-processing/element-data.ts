export enum Tags {
  BUTTON = "button",
  DIV = "div",
  PATH = "path",
  SPAN = "span",
  TP_YT_PAPER_CHECKBOX = "tp-yt-paper-checkbox",
  TP_YT_PAPER_ITEM = "tp-yt-paper-item",
  TP_YT_PAPER_LISTBOX = "tp-yt-paper-listbox",
  YTD_ADD_TO_PLAYLIST_RENDERER = "ytd-add-to-playlist-renderer",
  YTD_BUTTON_RENDERER = "ytd-button-renderer",
  YTD_MENU_RENDERER = "ytd-menu-renderer",
  YTD_PLAYLIST_ADD_TO_OPTION_RENDERER = "ytd-playlist-add-to-option-renderer",
  YTD_PLAYLIST_PANEL_VIDEO_RENDERER = "ytd-playlist-panel-video-renderer",
  YTD_PLAYLIST_VIDEO_LIST_RENDERER = "ytd-playlist-video-list-renderer",
  YTD_PLAYLIST_VIDEO_RENDERER = "ytd-playlist-video-renderer",
  YTD_POPUP_CONTAINER = "ytd-popup-container",
  YTD_RICH_GRID_MEDIA = "ytd-rich-grid-media",
  YTD_VIDEO_RENDERER = "ytd-video-renderer",
  YTD_WATCH_FLEXY = "ytd-watch-flexy",
  YTD_WATCH_METADATA = "ytd-watch-metadata",
  YT_BUTTON_SHAPE = "yt-button-shape",
  YT_ICON = "yt-icon",
  YT_ICON_BUTTON = "yt-icon-button",
}

export enum Ids {
  ACTIONS = "actions",
  BUTTON = "button",
  BUTTON_SHAPE = "button-shape",
  CHECKBOX = "checkbox",
  DISMISSIBLE = "dismissible",
  HEADER = "header",
  ITEMS = "items",
  PLAYLISTS = "playlists",
  PLAYLIST_ITEMS = "playlist-items",
  QA_FLEX_CONTAINER = "yt-qa-flex-container",
  QA_HOME_WATCH_LATER = "yt-qa-home-watch-later",
  QA_REMOVE_BUTTON = "yt-qa-remove-button",
  QA_VIDEO_WATCH_LATER = "yt-qa-video-watch-later",
}

export enum AttributeNames {
  D = "d",
}

export enum SvgDrawPath {
  // @formatter:off
  TRASH_ICON = "M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5a2 2 0 00-2 2h18a2 2 0 00-2-2ZM6 19V7H4v12a4 4 0 004" +
    " 4h8a4 4 0 004-4V7h-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2Zm4-11a1 1 0 00-1 1v8a1 1 0 102 0V9a1 1 0 00-1-1Zm4 0a1 1 0 00-1 1v8a1 1 0 002 0V9a1 1 0 00-1-1Z",
  TRASH_ICON_20251023 = "M11,17H9V8h2V17z M15,8h-2v9h2V8z M19,4v1h-1v16H6V5H5V4h4V3h6v1H19z M17,5H7v15h10V5z",
  TRASH_ICON_20230629 = "M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z",
  VIDEO_SAVE = "M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 3a1 1 0 00-1 1v5.565l.485.292 3.33 2a1 1 0 001.03-1.714L13 11.435V7a1 1 0 00-1-1Z",
  VIDEO_SAVE_20251022 = "M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z",
  VIDEO_SAVE_20230629 = "M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z",
  VIDEO_MORE_ACTIONS = "M7.5,12c0,0.83-0.67,1.5-1.5,1.5S4.5,12.83,4.5,12s0.67-1.5,1.5-1.5S7.5,11.17,7.5,12z M12,10.5c-0.83,0-1.5,0.67-1.5,1.5 s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S12.83,10.5,12,10.5z M18,10.5c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5 S18.83,10.5,18,10.5z",
  VIDEO_MORE_ACTIONS_20230629 = "M7.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm4.5-1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z",
  WATCH_LATER = "M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z",
  WATCH_LATER_20230629 = "M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z",
  POPUP_CLOSE = "M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z",
  POPUP_CLOSE_20230629 = "m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z",
  // @formatter:on
}
