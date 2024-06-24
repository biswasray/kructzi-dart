import { ERROR_STATUS_CODES } from "../utils/status_codes";
import { CustomError } from "./custom_error";

/**
 * PlatformError
 *
 * @alias PlatformError
 */
export class PlatformError extends CustomError<string[] | object[]> {
  /**
   * @summary create PlatformError object to throw.
   * - Example: `throw new PlatformError("Not Found", { messages: "Page not found", resource: "/user" });`
   * @param status {String} type of HTTP response status --
   * 'Bad Request' | 'Unauthorized' | 'Payment Required' | 'Forbidden' | 'Not Found' | 'Proxy Authentication Required' | 'Request Timeout' | 'Internal Server Error' | 'Not Implemented' | 'Bad Gateway' | 'Service Unavailable'.
   * Explore more status codes https://github.com/biswasray/platform-error/blob/master/utils/status_codes.ts
   * @param options {Object} extra meassages or resource related to error
   * `{ messages?: string[]; resource?: string }`
   */
  constructor(
    status: keyof typeof ERROR_STATUS_CODES,
    options?: { messages?: string | string[]; resource?: string } | object[],
  ) {
    if (options instanceof Array) {
      options;
      super(ERROR_STATUS_CODES[status], options);
      return;
    }
    let messages: string[] = [];
    if (typeof options?.messages === "string") {
      messages = [status, options?.messages];
    } else {
      messages = [status, ...(options?.messages ?? [])];
    }
    if (options?.resource) {
      messages.push(options.resource);
    }
    super(ERROR_STATUS_CODES[status], messages);
  }
}
