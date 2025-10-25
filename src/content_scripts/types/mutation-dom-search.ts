import { ReplaySubject } from "rxjs";

export class MutationDomSearch {
  private readonly subject = new ReplaySubject<Node>(1);
  private readonly observer: MutationObserver;

  constructor(targetNodeName: string) {
    this.observer = new MutationObserver((mutations, observerRef) => {
      for (const mutation of mutations) {
        if (mutation.target.nodeName === targetNodeName) {
          this.subject.next(mutation.target);
          observerRef.disconnect();
        }
      }
    });
  }

  search() {
    const observerConfig: MutationObserverInit = { attributes: false, childList: true, subtree: true };
    this.observer.observe(document.body, observerConfig);
    return this.subject;
  }
}
