import { YtdPopupContainerClicker } from "../../src/mutations/ytd-popup-container-clicker";
import { SvgDrawPath } from "../../src/html-element-processing/element-data";
import { YtdMenuServiceItemRendererSvgExtractor } from "../../src/mutations/ytd-menu-service-item-renderer-svg-extractor";
import { SvgDrawPathNavigationFilter } from "../../src/html-navigation/filter/navigation-filter";
import { setupYtdMenuServiceItemRendererSample } from "../setup-data/dom-elements";

describe("YtdPopupContainerClicker", () => {
  describe("observeAndBufferMutationChangesThenClickSvg", () => {
    it("should click the tp-yt-paper-element when the SVG is initialized (added or changed)", (done) => {
      const popupContainer = document.createElement("div");
      const ytdPopupContainerClicker = new YtdPopupContainerClicker(
        popupContainer
      );
      ytdPopupContainerClicker.observeAndBufferMutationChangesThenClickSvg();
      const svgTargetFilter = new SvgDrawPathNavigationFilter(
        SvgDrawPath.WATCH_LATER
      );

      const { path, ytdMenuServiceItemRenderer, tpYtPaperItem } =
        setupYtdMenuServiceItemRendererSample();

      tpYtPaperItem.addEventListener("click", () => {
        done();
      });
      path.setAttribute("class", "valid");
      path.setAttribute("d", SvgDrawPath.WATCH_LATER);

      ytdPopupContainerClicker.pushMutationsExtractor(
        new YtdMenuServiceItemRendererSvgExtractor(svgTargetFilter, [
          { added: [ytdMenuServiceItemRenderer], removed: [] },
          { added: [], removed: [] },
        ])
      );
      ytdPopupContainerClicker.pushMutationsExtractor(
        new YtdMenuServiceItemRendererSvgExtractor(svgTargetFilter, [
          { added: [path], removed: [] },
          { added: [], removed: [] },
        ])
      );
    }, 1000);

    it("should click the ytd-menu-service-item-renderer when the SVG is unhidden", (done) => {
      const popupContainer = document.createElement("div");
      const ytdPopupContainerClicker = new YtdPopupContainerClicker(
        popupContainer
      );
      ytdPopupContainerClicker.observeAndBufferMutationChangesThenClickSvg();
      const svgTargetFilter = new SvgDrawPathNavigationFilter(
        SvgDrawPath.WATCH_LATER
      );

      const { path, ytdMenuServiceItemRenderer } =
        setupYtdMenuServiceItemRendererSample();

      ytdMenuServiceItemRenderer.addEventListener("click", () => {
        done();
      });
      path.setAttribute("class", "valid");
      path.setAttribute("d", SvgDrawPath.WATCH_LATER);

      ytdPopupContainerClicker.pushMutationsExtractor(
        new YtdMenuServiceItemRendererSvgExtractor(svgTargetFilter, [
          { added: [], removed: [] },
          { added: [], removed: [ytdMenuServiceItemRenderer] },
        ])
      );
    }, 1000);
  });
});
