import { YtdPopupContainerClicker } from "../../src/mutations/ytd-popup-container-clicker";
import { SvgDrawPath } from "../../src/html-element-processing/element-data";
import { YtdMenuServiceItemRendererSvgExtractor } from "../../src/mutations/ytd-menu-service-item-renderer-svg-extractor";
import { SvgDrawPathNavigationFilter } from "../../src/html-navigation/filter/navigation-filter";

describe("YtdPopupContainerClicker", () => {
  describe("observeAndBufferMutationChangesThenClickSvg", () => {
    it("should click", (done) => {
      const popupContainer = document.createElement("div");

      const ytdPopupContainerClicker = new YtdPopupContainerClicker(
        popupContainer
      );

      ytdPopupContainerClicker.observeAndBufferMutationChangesThenClickSvg();

      const svgTargetFilter = new SvgDrawPathNavigationFilter(
        SvgDrawPath.WATCH_LATER
      );

      const ytdMenuServiceItemRenderer = document.createElement(
        "ytd-menu-service-item-renderer"
      );
      const tpYtPaperItem = document.createElement("tp-yt-paper-item");
      const ytIcon = document.createElement("yt-icon");
      const svg = document.createElement("svg");
      const g = document.createElement("g");
      const path = document.createElement("path");

      tpYtPaperItem.addEventListener("click", () => {
        done();
      });

      path.setAttribute("class", "valid");
      path.setAttribute("d", SvgDrawPath.WATCH_LATER);

      g.appendChild(path);
      svg.appendChild(g);
      ytIcon.appendChild(svg);
      tpYtPaperItem.appendChild(ytIcon);
      ytdMenuServiceItemRenderer.appendChild(tpYtPaperItem);
      popupContainer.appendChild(ytdMenuServiceItemRenderer);

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
    }, 2000);
  });
});
