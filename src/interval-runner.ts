export class IntervalRunner {
    private readonly iterationLimit: number;

    private timerId: NodeJS.Timer = undefined;
    private passedIterations: number = 0;
    private iterationLimitReachedCallback: () => void;

    constructor(iterationLimit: number = 10) {
        this.iterationLimit = iterationLimit;
    }

    start(interval: number, callback: (runningInterval: RunningInterval) => void): void {
        if (this.isNotRunning()) {
            this.timerId = setInterval(() => {
                callback(new RunningInterval(this));
                this.updatePassedIterations();
                this.stopIfIterationLimitReached();
            }, interval);
        }
    }

    registerIterationLimitReachedCallback(callback: () => void): void {
        this.iterationLimitReachedCallback = callback;
    }

    isRunning(): boolean {
        return !!this.timerId;
    }

    isNotRunning(): boolean {
        return !this.timerId;
    }

    stop(): void {
        clearInterval(this.timerId);
        this.timerId = undefined;
    }

    private updatePassedIterations(): void {
        this.passedIterations += 1;
    }

    private stopIfIterationLimitReached(): void {
        if (this.passedIterations === this.iterationLimit) {
            this.stop();
            this.iterationLimitReachedCallback();
        }
    }
}

export class RunningInterval {
    constructor(private intervalRunner: IntervalRunner) {
    }

    stop(): void {
        this.intervalRunner.stop();
    }

    isRunning(): boolean {
        return this.intervalRunner.isRunning();
    }

    isNotRunning(): boolean {
        return this.intervalRunner.isNotRunning();
    }
}