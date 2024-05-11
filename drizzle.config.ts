import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.toml",
    dbName: "oboe",
  },
} satisfies Config;
