import {IntervalRunner} from "../src/interval-runner";

describe('IntervalRunner', () => {
    it('should stop interval when stop is called in callback', (done) => {
        const interval = new IntervalRunner(2);
        interval.start(250, runningInterval => {
            runningInterval.stop();
            expect(runningInterval.isNotRunning()).toBeTrue();
            done();
        });
    })

    it('should stop interval when iteration limit is reached', (done) => {
        const interval = new IntervalRunner(2);
        interval.registerIterationLimitReachedCallback(() => {
            expect(interval.isNotRunning()).toBeTrue();
            done();
        });
        interval.start(250, runningInterval => {
            expect(runningInterval.isRunning()).toBeTrue();
        });
    });
});