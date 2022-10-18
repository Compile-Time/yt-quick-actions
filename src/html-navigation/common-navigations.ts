import {
    IdAndTextContentNavigationFilter,
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "./navigation-filter";
import {Ids, Tags, TextContent} from "./element-data";
import {HtmlTreeNavigator} from "./html-tree-navigator";

export class CommonNavigations {
    static getPlaylistMenuButtons(): HTMLElement[] {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
            .find(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON));
    }

    static getPopupContainer(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER));
    }

    static getPopupMenu(): HTMLElement {
        return HtmlTreeNavigator.startFrom(document.body)
            .findFirst(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS));
    }
    static getVideoFlexibleItemButtons(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .findFirst(new IdNavigationFilter(Tags.DIV, Ids.FLEXIBLE_ITEM_BUTTONS));
    }

    static getPlaylistAddPopupContainerTrigger(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.TEXT, TextContent.SAVE));
    }

    static getPlaylistAddWatchLaterEntry(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_ADD_TO_PLAYLIST_RENDERER))
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER))
            .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_CHECKBOX, Ids.CHECKBOX))
            .findFirst(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.LABEL, TextContent.WATCH_LATER));
    }

    static getHomePageVideoRow(): HTMLElement[] {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
            .find(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW));
    }

    static getHomePageVideoWatchLaterMenuEntry(): HTMLElement {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
            .findFirst(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.SAVE_TO_WATCH_LATER));
    }
}
