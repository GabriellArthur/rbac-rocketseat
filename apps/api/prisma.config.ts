import { defineConfig } from "@prisma/client";
import { env } from "@saas/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
