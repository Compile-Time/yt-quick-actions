import { SvgDrawPath } from "../../html-element-processing/element-data";
import { AnyFilter, SvgDrawPathNavigationFilter } from "./navigation-filter";

function drawPathToFilter(drawPath: SvgDrawPath): SvgDrawPathNavigationFilter {
  return new SvgDrawPathNavigationFilter(drawPath);
}

export const ANY_TRASH_ICON = [
  SvgDrawPath.TRASH_ICON_20230629,
  SvgDrawPath.TRASH_ICON,
];

export const ANY_VIDEO_SAVE_ICON = [
  SvgDrawPath.VIDEO_SAVE_20230629,
  SvgDrawPath.VIDEO_SAVE,
];

export const ANY_VIDEO_MORE_ACTIONS_ICON = [
  SvgDrawPath.VIDEO_MORE_ACTIONS_20230629,
  SvgDrawPath.VIDEO_MORE_ACTIONS,
];

export const ANY_WATCH_LATER_ICON = [
  SvgDrawPath.WATCH_LATER_20230629,
  SvgDrawPath.WATCH_LATER,
];

export const ANY_POPUP_CLOSE_ICON = [
  SvgDrawPath.POPUP_CLOSE_20230629,
  SvgDrawPath.POPUP_CLOSE,
];

export const ANY_TRASH_ICON_FILTER = new AnyFilter(
  ANY_TRASH_ICON.map(drawPathToFilter)
);

export const ANY_VIDEO_SAVE_ICON_FILTER = new AnyFilter(
  ANY_VIDEO_SAVE_ICON.map(drawPathToFilter)
);

export const ANY_VIDEO_MORE_ACTIONS_ICON_FILTER = new AnyFilter(
  ANY_VIDEO_MORE_ACTIONS_ICON.map(drawPathToFilter)
);

export const ANY_WATCH_LATER_ICON_FILTER = new AnyFilter(
  ANY_WATCH_LATER_ICON.map(drawPathToFilter)
);

export const ANY_POPUP_CLOSE_ICON_FILTER = new AnyFilter(
  ANY_POPUP_CLOSE_ICON.map(drawPathToFilter)
);
