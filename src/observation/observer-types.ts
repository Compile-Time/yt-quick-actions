import {MutationSummary} from "mutation-summary";

export interface MutationObserverArgs {
    targetNode: Node,
    initOptions: MutationObserverInit
}

export class PageObserver {
    constructor(private readonly observer: MutationObserver | MutationSummary,
                private readonly mutationObserverArgs?: MutationObserverArgs) {
    }

    disconnect(): void {
        // `disconnect()` exists on both types of `observer`.
        this.observer.disconnect();
    }

    observe(): void {
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
    constructor(private readonly id: string,
                observer: MutationObserver | MutationSummary,
                mutationObserverArgs?: MutationObserverArgs) {
        super(observer, mutationObserverArgs);
    }

    equals(other: OneshotObserver): boolean {
        return this.id === other.id;
    }
}