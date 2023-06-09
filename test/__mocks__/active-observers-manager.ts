export const mockDisconnect = jest.fn();
export const mockObserve = jest.fn();
const mock = jest.fn().mockImplementation(() => {
  return {
    disconnect: mockDisconnect,
    observer: mockObserve,
  };
});

export default mock;
