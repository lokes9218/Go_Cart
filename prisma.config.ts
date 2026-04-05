import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma CLI (db push/migrate/studio) uses this URL to connect.
    // Keep it in .env (DATABASE_URL), not in schema.prisma (Prisma ORM v7).
    url: process.env.DATABASE_URL ?? "",
  },
});
