export class IntervalRunner {
    id: NodeJS.Timer = undefined;

    start(interval: number, callback: (runningInterval: RunningInterval) => void): void {
        if (this.notRunning()) {
            this.id = setInterval(() => {
                callback(new RunningInterval(this));
            }, interval);
        }
    }

    notRunning(): boolean {
        return !this.id;
    }

    stop(): void {
        clearInterval(this.id);
        this.id = undefined;
    }
}

export class RunningInterval {
    constructor(private intervalRunner: IntervalRunner) {
    }

    stop(): void {
        this.intervalRunner.stop();
    }
}