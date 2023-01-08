import {ElementWatcher} from "./element-watcher";
import {PromiseUtil} from "../../util/promise-util";
import {ElementWatcherResult} from "./element-watcher-result";

export class TimeoutElementExistsWatcher extends ElementWatcher<TimeoutElementExistsWatcher> {

    private constructor() {
        super();
    }

    static build(): TimeoutElementExistsWatcher {
        return new TimeoutElementExistsWatcher();
    }

    queryFn(elementQueryFn: () => (ElementWatcherResult | null)): TimeoutElementExistsWatcher {
        this.elementQueryFn = elementQueryFn;
        return this;
    }

    startDelayed(delayInMilliseconds: number): Promise<ElementWatcherResult> {
        return PromiseUtil.delay(delayInMilliseconds, () => this.start());
    }

    start(): Promise<ElementWatcherResult> {
        return PromiseUtil.retry<ElementWatcherResult>(() => this.runQuery(), 10, 100);
    }

    private runQuery(): Promise<ElementWatcherResult> {
        return new Promise<ElementWatcherResult>((resolve, reject) => {
            if (!this.elementQueryFn) {
                return reject(new Error('No query function was provided'));
            }

            const elementQueryResult: ElementWatcherResult = this.elementQueryFn();
            if (Object.values(elementQueryResult).every(element => !!element)) {
                return resolve(elementQueryResult);
            } else {
                return reject(new Error('Could not find element for provided query'))
            }
        });
    }

}