export class PromiseUtil {
  /**
   * Retry a promise for X {@link numberOfRetries} and with X {@link delayMilliseconds}.
   *
   * @param callbackPromise - A function that returns a {@link Promise}
   * @param numberOfRetries - The amount of times a retry should be performed before finally reporting an error
   * @param delayMilliseconds - The amount of milliseconds to wait in each retry cycle
   */
  static retry<T>(
    callbackPromise: () => Promise<T>,
    numberOfRetries: number,
    delayMilliseconds: number
  ) {
    return new Promise<T>(function (resolve, reject) {
      let finalError: Error;
      const attempt = () => {
        if (numberOfRetries === 0) {
          reject(finalError);
        } else {
          callbackPromise()
            .then(resolve)
            .catch((error) => {
              numberOfRetries--;
              finalError = error;
              setTimeout(() => {
                attempt();
              }, delayMilliseconds);
            });
        }
      };
      attempt();
    });
  }

  /**
   * Delay the execution of a promise for X {@link delayMilliseconds}.
   *
   * @param callbackPromise - A function that returns a {@link Promise}
   * @param delayMilliseconds - The amount of milliseconds to wait before executing {@link callbackPromise}
   */
  static delay<T>(
    delayMilliseconds: number,
    callbackPromise: () => Promise<T>
  ) {
    return new Promise((resolve) =>
      setTimeout(resolve, delayMilliseconds)
    ).then(callbackPromise);
  }
}
