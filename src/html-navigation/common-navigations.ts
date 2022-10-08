import {HtmlTreeNavigator} from "./html-tree-navigator";
import {
    IdAndTextContentNavigationFilter,
    IdNavigationFilter,
    TagNavigationFilter,
    TextContentNavigationFilter
} from "./navigation-filter";
import {Ids, Tags, TextContent} from "./element-data";

export class CommonNavigations {
    static getRemoveButtons(): HTMLElement[] {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new IdNavigationFilter(Tags.YTD_PAGE_MANAGER, Ids.PAGE_MANAGER))
            .filter(new TagNavigationFilter(Tags.YTD_BROWSE))
            .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY))
            .filter(new TagNavigationFilter(Tags.YTD_SECTION_LIST_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_ITEM_SECTION_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
            .filter(new IdNavigationFilter(Tags.BUTTON, Ids.YT_QUICK_ACTIONS_REMOVE_BUTTON))
            .find();
    }

    static getPopupContainer(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
            .findFirst();
    }

    static getPopupMenu(): HTMLElement {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
            .filter(new TagNavigationFilter(Tags.TP_YT_IRON_DROPDOWN))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT_WRAPPER))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_POPUP_RENDERER))
            .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
            .findFirst();
    }

    static getPopupDeleteEntry(popupMenu: HTMLElement): HTMLElement {
        return HtmlTreeNavigator.startFrom(popupMenu)
            .filter(new TagNavigationFilter(Tags.YTD_MENU_SERVICE_ITEM_RENDERER))
            .filter(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
            .filter(new TagNavigationFilter(Tags.YT_FORMATTED_STRING))
            .filter(new TextContentNavigationFilter(Tags.SPAN, TextContent.REMOVE_FROM))
            .findFirst();
    }

    static getVideoFlexibleItemButtons(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new IdNavigationFilter(Tags.YTD_PAGE_MANAGER, Ids.PAGE_MANAGER))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.COLUMNS))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY_INNER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.BELOW))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.ABOVE_THE_FOLD))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.TOP_ROW))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS_INNER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.MENU))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.FLEXIBLE_ITEM_BUTTONS))
            .findFirst()
    }

    static getPlaylistAddPopupContainerTrigger(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new IdNavigationFilter(Tags.YTD_PAGE_MANAGER, Ids.PAGE_MANAGER))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_FLEXY))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.COLUMNS))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY_INNER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.BELOW))
            .filter(new TagNavigationFilter(Tags.YTD_WATCH_METADATA))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.ABOVE_THE_FOLD))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.TOP_ROW))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.ACTIONS_INNER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.MENU))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.FLEXIBLE_ITEM_BUTTONS))
            .filter(new TagNavigationFilter(Tags.YTD_BUTTON_RENDERER))
            .filter(new TagNavigationFilter(Tags.A))
            .filter(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.TEXT, TextContent.SAVE))
            .findFirst();
    }

    static getPlaylistAddWatchLaterEntry(): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
            .filter(new TagNavigationFilter(Tags.TP_YT_PAPER_DIALOG))
            .filter(new TagNavigationFilter(Tags.YTD_ADD_TO_PLAYLIST_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PLAYLISTS))
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_ADD_TO_OPTION_RENDERER))
            .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_CHECKBOX, Ids.CHECKBOX))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CHECKBOX_LABEL_CAMEL_CASE))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CHECKBOX_CONTAINER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CHECKBOX_LABEL))
            .filter(new IdAndTextContentNavigationFilter(Tags.YT_FORMATTED_STRING, Ids.LABEL, TextContent.WATCH_LATER))
            .findFirst()
    }

    static getHomePageVideoRow(): HTMLElement[] {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new IdNavigationFilter(Tags.YTD_PAGE_MANAGER, Ids.PAGE_MANAGER))
            .filter(new TagNavigationFilter(Tags.YTD_BROWSE))
            .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY))
            .filter(new TagNavigationFilter(Tags.YTD_RICH_GRID_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_RICH_GRID_ROW))
            .find();
    }

    static getHomePageVideoWatchLaterMenuEntry(): HTMLElement {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
            .filter(new TagNavigationFilter(Tags.TP_YT_IRON_DROPDOWN))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT_WRAPPER))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_POPUP_RENDERER))
            .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_SERVICE_ITEM_RENDERER))
            .filter(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
            .filter(new TextContentNavigationFilter(Tags.YT_FORMATTED_STRING, TextContent.SAVE_TO_WATCH_LATER))
            .findFirst();
    }

    static getHomePageVideoMenuButton(homePageVideo: HTMLElement): HTMLElement | undefined {
        return HtmlTreeNavigator.startFrom(homePageVideo)
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new TagNavigationFilter(Tags.YTD_RICH_GRID_MEDIA))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.DISMISSIBLE))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.DETAILS))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.MENU))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .filter(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
            .findFirst();
    }

    static getPlaylistItemsMenuButtons(): HTMLElement[] {
        return this.getPlaylistItemMenuButtonPath().find();
    }

    static getFirstPlaylistItemMenuButton(): HTMLElement {
        return this.getPlaylistItemMenuButtonPath().findFirst();
    }

    static getLastPlaylistItemMenuButton(): HTMLElement {
        return this.getPlaylistItemMenuButtonPath().findLast();
    }

    private static getPlaylistItemMenuButtonPath(): HtmlTreeNavigator {
        return HtmlTreeNavigator.startFrom(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT))
            .filter(new IdNavigationFilter(Tags.YTD_PAGE_MANAGER, Ids.PAGE_MANAGER))
            .filter(new TagNavigationFilter(Tags.YTD_BROWSE))
            .filter(new TagNavigationFilter(Tags.YTD_TWO_COLUMN_BROWSE_RESULTS_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.PRIMARY))
            .filter(new TagNavigationFilter(Tags.YTD_SECTION_LIST_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_ITEM_SECTION_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_LIST_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENTS))
            .filter(new TagNavigationFilter(Tags.YTD_PLAYLIST_VIDEO_RENDERER))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.MENU))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_RENDERER))
            .filter(new IdNavigationFilter(Tags.YT_ICON_BUTTON, Ids.BUTTON))
    }
}
