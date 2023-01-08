import {ElementWatcherResult} from "./element-watcher-result";

export abstract class ElementWatcher<T extends ElementWatcher<T>> {

    protected elementQueryFn: (() => ElementWatcherResult | null);

    abstract queryFn(elementQueryFn: () => ElementWatcherResult | null): T

    abstract start(): Promise<ElementWatcherResult>;

}