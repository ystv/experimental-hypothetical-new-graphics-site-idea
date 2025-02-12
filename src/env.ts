import { exit } from "process";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  AUTH_SECRET:
    process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
});

export function validateEnv(
  env?: unknown,
): NodeJS.ProcessEnv | z.infer<typeof envSchema> {
  if (process.env.SKIP_ENV_VALIDATION === "1") return process.env;
  const envResult = envSchema.safeParse(env ?? process.env);
  if (!envResult.success) {
    console.error("Error: Bad env configuration");
    for (const error of envResult.error.issues) {
      console.error(
        `   variable ${error.path.join(".")} ${error.code}, ${error.message}`,
      );
    }
    exit(1);
  }
  return envResult.data;
}

export const env = validateEnv();
