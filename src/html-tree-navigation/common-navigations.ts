import {HtmlTreeNavigator} from "./html-tree-navigator";
import {IdNavigationFilter, TagNavigationFilter, TextContentNavigationFilter} from "./navigation-filter";
import {Ids, Tags, TextContent} from "./element-data";

export class CommonNavigations {
    static getRemoveButtons(): HTMLElement[] {
        return HtmlTreeNavigator.navigate(document.body)
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
            .filter(new IdNavigationFilter(Tags.BUTTON, Ids.YT_PL_QA_REMOVE_BUTTON))
            .find();
    }

    static getPopupMenu(): HTMLElement {
        return HtmlTreeNavigator.navigate(document.body)
            .filter(new TagNavigationFilter(Tags.YTD_APP))
            .filter(new TagNavigationFilter(Tags.YTD_POPUP_CONTAINER))
            .filter(new TagNavigationFilter(Tags.TP_YT_IRON_DROPDOWN))
            .filter(new IdNavigationFilter(Tags.DIV, Ids.CONTENT_WRAPPER))
            .filter(new TagNavigationFilter(Tags.YTD_MENU_POPUP_RENDERER))
            .filter(new IdNavigationFilter(Tags.TP_YT_PAPER_LISTBOX, Ids.ITEMS))
            .findFirst();
    }

    static getPopupDeleteEntry(popupMenu: HTMLElement): HTMLElement {
        return HtmlTreeNavigator.navigate(popupMenu)
            .filter(new TagNavigationFilter(Tags.YTD_MENU_SERVICE_ITEM_RENDERER))
            .filter(new TagNavigationFilter(Tags.TP_YT_PAPER_ITEM))
            .filter(new TagNavigationFilter(Tags.YT_FORMATTED_STRING))
            .filter(new TextContentNavigationFilter(Tags.SPAN, TextContent.REMOVE_FROM))
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
        return HtmlTreeNavigator.navigate(document.body)
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
