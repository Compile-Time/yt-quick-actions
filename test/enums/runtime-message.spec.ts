import {RuntimeMessage, RuntimeMessageUtils} from "../../src/enums/runtime-message";

describe('RuntimeMessageUtils', () => {
    it('should return all runtime messages not given', () => {
        const messages = [RuntimeMessage.NAVIGATED_TO_VIDEO];

        const expectedMessages = [
            RuntimeMessage.NAVIGATED_TO_HOME_PAGE,
            RuntimeMessage.NAVIGATED_TO_VIDEO_IN_PLAYLIST,
            RuntimeMessage.NAVIGATED_TO_PLAYLIST
        ];
        const result = RuntimeMessageUtils.getNotGivenValues(messages);
        for (const expectedMessage of expectedMessages) {
            expect(result).toContain(expectedMessage);
        }
    });
});