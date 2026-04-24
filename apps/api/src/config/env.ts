import { loadEnv } from "config";

export const env = loadEnv();

export type Env = typeof env;
