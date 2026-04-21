import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET too short"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET too short"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),

  API_PORT: z.coerce.number().int().positive().default(4000),
  API_HOST: z.string().default("0.0.0.0"),
  CORS_ORIGINS: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }
  return parsed.data;
}
