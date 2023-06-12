import { OneshotObserver, PageObserver } from "./observer-types";

/**
 * Manage active mutation observers inside the same page context.
 *
 * Because of how YouTube is designed the DOM changes very little when navigating between pages. This can
 * cause mutation observers of one page to still be active in a different page. To prevent such an event
 * this class is designed to keep track of all observer instances and provide an option to disconnect them all.
 *
 * Usage note: Mutation observers created in a content script can not be managed from a background script
 * because content script and background scripts both run in separate contexts. Therefore, an instance of
 * this manager must be created for both the content script and background script.
 */
export class ActiveObserversManager {
  private backgroundObservers: PageObserver[] = [];
  private oneshotObservers: OneshotObserver[] = [];

  /**
   * Track a mutation observer as an oneshot observer.
   *
   * An oneshot observer is an observer that runs under a specific condition and disconnects after the
   * condition has been fulfilled. An example usage might be to determine if the content of a dialog has
   * changed so that an action is performed for the correct element.
   *
   * If a different reference to an observer but the same oneshot id is provided, then the previous referenced
   * observer will be disconnected.
   *
   * @param oneshotObserver - A {@link OneshotObserver} to track
   */
  upsertOneshotObserver(oneshotObserver: OneshotObserver): PageObserver {
    const existingOneshotObserver = this.oneshotObservers.find((oneshotOb) => oneshotOb.equals(oneshotObserver));
    if (existingOneshotObserver) {
      existingOneshotObserver.disconnect();
      this.oneshotObservers = this.oneshotObservers.filter((oneshotOb) => !oneshotOb.equals(existingOneshotObserver));
    }
    this.oneshotObservers.push(oneshotObserver);
    return oneshotObserver;
  }

  /**
   * Track a mutation observer as a background observer.
   *
   * Background observers are long-running mutation observers watching specific DOM changes inside a
   * page context.
   *
   * @param observer - A {@link PageObserver} to track
   */
  addBackgroundObserver(observer: PageObserver): PageObserver {
    this.backgroundObservers.push(observer);
    return observer;
  }

  /**
   * Disconnect all currently tracked oneshot and background observers.
   *
   * Before running the next page code ensure that this method gets called before to stop any
   * existing mutation observers.
   */
  disconnectAll(): void {
    const observers: PageObserver[] = [...this.backgroundObservers, ...this.oneshotObservers.map((oneshotOb) => oneshotOb)];
    observers.forEach((observer) => observer.disconnect());

    this.oneshotObservers = [];
    this.backgroundObservers = [];
  }
}
