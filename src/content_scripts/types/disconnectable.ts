export function disonnectable(disconnectFn: () => void): Disconnectable {
  return {
    disconnect: disconnectFn,
  };
}

export interface Disconnectable {
  disconnect: () => void;
}
