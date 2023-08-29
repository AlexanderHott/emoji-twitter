import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  out: "./src/db/_migrations/",
} satisfies Config;
