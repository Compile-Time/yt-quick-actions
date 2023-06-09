import { PageEvent, PageEventUtils } from "../../src/enums/page-event";

describe("PageEventUtils", () => {
  it("should return all page events not given", () => {
    const messages = [PageEvent.NAVIGATED_TO_VIDEO];

    const expectedMessages = [
      PageEvent.NAVIGATED_TO_HOME_PAGE,
      PageEvent.NAVIGATED_TO_VIDEO_IN_PLAYLIST,
      PageEvent.NAVIGATED_TO_PLAYLIST,
    ];
    const result = PageEventUtils.getNotGivenValues(messages);
    for (const expectedMessage of expectedMessages) {
      expect(result).toContain(expectedMessage);
    }
  });
});
