import EnvironmentVariables from "./environment";

export const environment = EnvironmentVariables.getInstance();

export * from "./constants";
export * from "./interfaces";
export * from "./platform-error";
export { default as PlatformError } from "./platform-error";
export * from "./schemas";
export * from "./threadverse";
export * from "./utils";
