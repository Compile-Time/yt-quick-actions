import {HtmlTreeNavigator} from "./html-tree-navigator";
import {IdNavigationFilter, TagNavigationFilter} from "./navigation-filter";
import {RELEVANT_IDS} from "./relevant-elements";

export function getRemoveButtons(): HTMLElement[] {
    const removeButtons: HTMLElement[] = HtmlTreeNavigator.navigate(document.body)
        .filter(new TagNavigationFilter('ytd-app'))
        .filter(new IdNavigationFilter('div', 'content'))
        .filter(new IdNavigationFilter('ytd-page-manager', 'page-manager'))
        .filter(new TagNavigationFilter('ytd-browse'))
        .filter(new TagNavigationFilter('ytd-two-column-browse-results-renderer'))
        .filter(new IdNavigationFilter('div', 'primary'))
        .filter(new TagNavigationFilter('ytd-section-list-renderer'))
        .filter(new IdNavigationFilter('div', 'contents'))
        .filter(new TagNavigationFilter('ytd-item-section-renderer'))
        .filter(new IdNavigationFilter('div', 'contents'))
        .filter(new TagNavigationFilter('ytd-playlist-video-list-renderer'))
        .filter(new IdNavigationFilter('div', 'contents'))
        .filter(new TagNavigationFilter('ytd-playlist-video-renderer'))
        .filter(new IdNavigationFilter('button', RELEVANT_IDS.YT_PL_QA_REMOVE_BUTTON))
        .find();

    return removeButtons;
}