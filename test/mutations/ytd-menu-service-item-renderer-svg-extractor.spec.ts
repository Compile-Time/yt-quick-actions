import { YtdMenuServiceItemRendererSvgExtractor } from "../../src/mutations/ytd-menu-service-item-renderer-svg-extractor";
import { SvgDrawPath } from "../../src/html-element-processing/element-data";
import { SvgDrawPathNavigationFilter } from "../../src/html-navigation/filter/navigation-filter";
import { setupYtdMenuServiceItemRendererSample } from "../setup-data/dom-elements";

describe("YtdMenuServiceItemRendererSvgExtractor", () => {
  describe("extractSvgFromAddedMutations", () => {
    it("should return null from mutations with no added SVG path", () => {
      const { path, ytdMenuServiceItemRenderer } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("class", "valid");
      path.setAttribute("d", SvgDrawPath.VIDEO_SAVE);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [ytdMenuServiceItemRenderer], removed: [] },
          { added: [], removed: [] },
        ]
      );
      expect(extractor.extractSvgFromAddedMutations()).toBeNull();
    });

    it("should extract SVG path from mutations with added SVG path matching filter", () => {
      const { path } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("class", "valid");
      path.setAttribute("d", SvgDrawPath.VIDEO_SAVE);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [path], removed: [] },
          { added: [], removed: [] },
        ]
      );
      expect(extractor.extractSvgFromAddedMutations()).toEqual(path);
    });

    it("should return null from mutations with added SVG path not matching filter", () => {
      const { path } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("class", "valid");
      path.setAttribute("d", SvgDrawPath.WATCH_LATER);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [path], removed: [] },
          { added: [], removed: [] },
        ]
      );
      expect(extractor.extractSvgFromAddedMutations()).toBeNull();
    });

    it("should return null from mutations with added SVG path where class attribute is empty", () => {
      const { path } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("class", "");
      path.setAttribute("d", SvgDrawPath.VIDEO_SAVE);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [path], removed: [] },
          { added: [], removed: [] },
        ]
      );
      expect(extractor.extractSvgFromAddedMutations()).toBeNull();
    });
  });

  describe("extractSvgFromUnHiddenYtdMenuServiceItemRenderer", () => {
    it("should return null from mutations with no un-hidden ytd-menu-service-item-renderer", () => {
      const { path } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("d", SvgDrawPath.VIDEO_SAVE);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [path], removed: [] },
          { added: [], removed: [] },
        ]
      );
      expect(extractor.extractSvgFromUnHiddenYtdMenuServiceItemRenderer()).toBeNull();
    });

    it("should extract ytd-menu-service-item-renderer from mutations with un-hidden ytd-menu-service-item-renderer matching filter", () => {
      const { path, ytdMenuServiceItemRenderer } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("d", SvgDrawPath.VIDEO_SAVE);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [], removed: [] },
          { added: [], removed: [ytdMenuServiceItemRenderer] },
        ]
      );
      expect(extractor.extractSvgFromUnHiddenYtdMenuServiceItemRenderer()).toEqual(ytdMenuServiceItemRenderer);
    });

    it("should return null from mutations with un-hidden ytd-menu-service-item-renderer not matching filter", () => {
      const { path, ytdMenuServiceItemRenderer } = setupYtdMenuServiceItemRendererSample();

      path.setAttribute("d", SvgDrawPath.WATCH_LATER);

      const extractor = new YtdMenuServiceItemRendererSvgExtractor(
        new SvgDrawPathNavigationFilter(SvgDrawPath.VIDEO_SAVE),
        [
          { added: [], removed: [] },
          { added: [], removed: [ytdMenuServiceItemRenderer] },
        ]
      );
      expect(extractor.extractSvgFromUnHiddenYtdMenuServiceItemRenderer()).toBeNull();
    });
  });
});
