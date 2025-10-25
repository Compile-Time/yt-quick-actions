import { Observable, Subject, Subscription } from "rxjs";

export class PageObserver {
  subscription: Subscription;
  private readonly subject: Subject<MutationRecord>;
  private readonly observer: MutationObserver;

  constructor(mutationSubject: Subject<MutationRecord>) {
    this.subject = mutationSubject;
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.subject.next(mutation);
      });
    });
  }

  observe(observerConfig: MutationObserverInit, node: Node, sideEffect: Observable<unknown>): PageSubscription {
    this.observer.observe(node, observerConfig);
    this.subscription = sideEffect.subscribe();

    return new PageSubscription(this.subscription, this.observer);
  }
}

export class PageSubscription {
  private readonly subjectSubscription: Subscription;
  private readonly observer: MutationObserver;

  constructor(subjectSubscription: Subscription, observer: MutationObserver) {
    this.subjectSubscription = subjectSubscription;
    this.observer = observer;
  }

  disconnect() {
    this.subjectSubscription.unsubscribe();
    this.observer.disconnect();
  }
}
