import { MutationSummary } from "mutation-summary";

export interface MutationObserverArgs {
  targetNode: Node;
  initOptions: MutationObserverInit;
}

export class PageObserver {
  protected readonly observer: MutationObserver | MutationSummary;
  protected readonly mutationObserverArgs?: MutationObserverArgs;
  protected disconnected: boolean;

  constructor(
    observerProvider: (disconnectFn: () => void) => MutationObserver | MutationSummary,
    mutationObserverArgs?: MutationObserverArgs
  ) {
    this.observer = observerProvider(() => this.disconnect());
    this.mutationObserverArgs = mutationObserverArgs;
    this.disconnected = false;
  }

  disconnect(): void {
    // Disconnected MutationSummary observers will throw an error when disconnecting from them again.
    if (!this.disconnected) {
      // The disconnect method exists both on a MutationSummary and MutationObserver.
      this.observer.disconnect();
      this.disconnected = true;
    }
  }

  observe(): void {
    this.disconnected = false;
    if (this.isMutationSummary(this.observer)) {
      this.observer.reconnect();
    } else {
      this.observer.observe(this.mutationObserverArgs.targetNode, this.mutationObserverArgs.initOptions);
    }
  }

  private isMutationSummary(observer: MutationObserver | MutationSummary): observer is MutationSummary {
    return (observer as MutationSummary).reconnect !== undefined;
  }
}

export class OneshotObserver extends PageObserver {
  constructor(
    private readonly id: string,
    observerProvider: (disconnectFn: () => void) => MutationObserver | MutationSummary,
    mutationObserverArgs?: MutationObserverArgs
  ) {
    super(observerProvider, mutationObserverArgs);
  }

  equals(other: OneshotObserver): boolean {
    return this.id === other.id;
  }
}
