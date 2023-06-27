/**
 * Interface that represents a `Summary` like object to make testing easier.
 */
export interface SummaryLike {
  added: Node[];
  removed: Node[];
}

export interface YtdPopupContainerMutationSummary {
  addedSvgs: SummaryLike[];
  ytdMenuServiceItemRendererHiddenAttribute: SummaryLike;
}
