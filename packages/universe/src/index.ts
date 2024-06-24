import EnvironmentVariables from "./environment";

export function add(a: number, b: number) {
  return a + b;
}

export const environment = EnvironmentVariables.getInstance();
