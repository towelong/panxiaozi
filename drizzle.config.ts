import { config } from 'dotenv'
import { defineConfig } from "drizzle-kit";

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
