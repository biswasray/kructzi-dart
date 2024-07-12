import { IErrorSerialized } from "../interfaces/errors";

/**
 * CustomError
 *
 * @alias CustomError
 */
export class CustomError<
  T extends string[] | Record<string, unknown> | object[],
> extends Error {
  statusCode = 500;
  errors: T | undefined;
  /**
   * @summary create CustomError object to throw.
   * - Example: `throw new CustomError(402, ["Something is wrong!"]);`
   * @param statusCode {Number} custom status code.
   * @param errors {Object} array or object of messages for CustomError.
   */
  constructor(statusCode: number, errors: T) {
    super(Object.values(errors).join(" ") || "Custom error occurred");
    this.statusCode = statusCode || this.statusCode;
    this.errors = errors;
  }
  /**
   * Serialize `CustomError` to JSON format for server response
   * @returns {Object} JSON object of error messages
   */
  serialize(): IErrorSerialized[] {
    const result: IErrorSerialized[] = [];
    if (
      this.errors instanceof Array &&
      (this.errors as object[]).every(
        (e: unknown) => typeof e === "object" && e && "message" in e,
      )
    ) {
      return this.errors as IErrorSerialized[];
    }
    for (const i in this.errors)
      result.push({ message: this.errors[i] } as IErrorSerialized);
    return result;
  }
}
