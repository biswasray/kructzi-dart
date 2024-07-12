import type { Request, Response, NextFunction } from "express";
import { CustomError } from "./errors/custom_error";
import { PlatformError } from "./errors/platform_error";
import { IErrorLoggerFunction } from "./interfaces/errors";

export type {
  IErrorLoggerFunction,
  IErrorSerialized,
  IServerError,
} from "./interfaces/errors";
export { ERROR_STATUS_CODES, STATUS_CODES } from "./utils/status_codes";

export { CustomError };
export default PlatformError;

/**
 * @description ExpressErrorHandler is express middleware handler factory function to serialize `PlatformError`.
 * - Example: `app.use(ExpressErrorHandler(true));`.
 * - Note: Use `express-async-errors` package before use this handler.
 * - Note: Use this handler at last of Express application routing.
 * @param logger {Boolean | Function} Print error on console if `logger` is `true` or pass the error instance on `logger` if function provided.
 * @default logger = false
 * @returns {Object} express middleware handler.
 */
export const ExpressErrorHandler =
  (
    logger: boolean | IErrorLoggerFunction = false,
    onError?: (error: Error) => void,
  ) =>
  (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    if (logger) {
      if (typeof logger === "function") {
        logger(error);
      } else {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
    if (error instanceof Error) {
      onError?.(error);
    }
    if (error instanceof CustomError) {
      response.status(error.statusCode).json({
        status: false,
        errors: error.serialize(),
      });
    } else {
      response.status(500).json({
        status: false,
        errors: [
          {
            message: error.message || "Something unexpected happened!",
          },
        ],
      });
    }
    return _next();
  };
