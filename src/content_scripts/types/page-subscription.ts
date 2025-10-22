import { Subscription } from "rxjs";

export interface PageSubscription {
  subscriptions: Subscription[];
  mutationObservers: MutationObserver[];
}
