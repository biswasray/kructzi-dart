import { config as processConfig } from "dotenv";
import { z } from "zod";

export const ProcessEnv = z.object({
  POSTGRESDB_HOST: z.string(),
  POSTGRESDB_USER: z.string(),
  POSTGRESDB_ROOT_PASSWORD: z.string(),
  POSTGRESDB_DATABASE: z.string(),
  POSTGRESDB_PORT: z.string(),

  NODE_PORT: z.string(),

  NEXT_PORT: z.string(),

  JWT_TOKEN_KEY: z.string(),
  CRYPTO_KEY: z.string(),
  CRYPTO_IV: z.string(),
  SESSION_SECRET: z.string(),

  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_KEY: z.string(),
  AWS_ACCOUNT_ID: z.string(),
});

export type IProcessEnv = z.infer<typeof ProcessEnv>;

export default class EnvironmentVariables implements IProcessEnv {
  POSTGRESDB_HOST!: string;
  POSTGRESDB_USER!: string;
  POSTGRESDB_ROOT_PASSWORD!: string;
  POSTGRESDB_DATABASE!: string;
  POSTGRESDB_PORT!: string;

  NODE_PORT!: string;

  NEXT_PORT!: string;

  JWT_TOKEN_KEY!: string;
  CRYPTO_KEY!: string;
  CRYPTO_IV!: string;
  SESSION_SECRET!: string;

  AWS_ACCESS_KEY!: string;
  AWS_SECRET_KEY!: string;
  AWS_ACCOUNT_ID!: string;

  static assertEnvironment(value: unknown): asserts value is IProcessEnv {
    ProcessEnv.parse(value);
  }
  private constructor() {
    const { parsed = process.env, error } = processConfig();
    if (error instanceof Error) {
      throw error;
    }
    EnvironmentVariables.assertEnvironment(parsed);
    const config = parsed;
    for (const k in config) {
      const key = k as keyof IProcessEnv;
      this[key] = config[key];
    }
  }

  static instance: EnvironmentVariables | null = null;
  static getInstance() {
    if (!EnvironmentVariables.instance) {
      EnvironmentVariables.instance = new EnvironmentVariables();
    }
    return EnvironmentVariables.instance;
  }
}
