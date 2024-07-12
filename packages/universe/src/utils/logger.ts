import path from "path";
import { createFile } from "./storage";

export function loggerInit() {
  // (process.env.NODE_ENV==="production")
  const fileName = path.resolve("logs", `prod-${new Date().getTime()}.log`);
  function info(...data: string[]) {
    const combineData = `INFO (${new Date().toISOString()}): ${data.join(
      " ",
    )}\n`;
    createFile(combineData, fileName);
  }
  function warn(...data: string[]) {
    const combineData = `WARN (${new Date().toISOString()}): ${data.join(
      " ",
    )}\n`;
    createFile(combineData, fileName);
  }
  function error(...data: string[]) {
    const combineData = `ERROR (${new Date().toISOString()}): ${data.join(
      " ",
    )}\n`;
    createFile(combineData, fileName);
  }
  const { log, error: err } = console;
  const result =
    process.env.NODE_ENV === "production"
      ? {
          info,
          warn,
          error,
        }
      : {
          info: log,
          warn: log,
          error: err,
        };
  return result;
}

const logger = loggerInit();
export default logger;
