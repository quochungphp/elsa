import { rootLogger } from "./rootLogger";
import { waitTime } from "./wait-time";

export const retry = async <T>(
  func: () => Promise<T>,
  timeRecall = 200,
  loop = 3
): Promise<{ response: T; retryAttempt: number; error?: any }> => {
  let retry = 0;
  do {
    retry++;
    try {
      const response = await func();
      return {
        response,
        retryAttempt: retry,
      };
    } catch (error) {
      let shouldRetry = false;
      if (error.response && error.response.status) {
        const status = error.response.status;
        const statusRegex = new RegExp("5[0-9][0-9]");
        shouldRetry = statusRegex.test(String(status));
      }
      await waitTime(timeRecall);
      rootLogger.error(
        `retryAttempt: ${retry} on error = ${JSON.stringify(error)}`
      );
      if (retry === loop || !shouldRetry) {
        return {
          response: <T>undefined,
          retryAttempt: retry,
          error,
        };
      }
    }
  } while (retry <= loop);

  return {
    response: <T>null,
    retryAttempt: retry,
    error: null,
  };
};
