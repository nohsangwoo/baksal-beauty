import { Pool } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schema";

type Database = NeonDatabase<typeof schema> & { $client: Pool };

let pool: Pool | undefined;
let database: Database | undefined;

export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    ""
  );
}

export function hasDatabaseConnection() {
  return Boolean(getDatabaseUrl());
}

export function getDb() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL. Connect bsclinic-db or set DATABASE_URL first.");
  }

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  if (!database) {
    database = drizzle(pool, { schema }) as Database;
  }

  return database;
}

export async function executeSchemaSql(schemaSql: string) {
  await getDb().execute(sql.raw(schemaSql));
}

export async function closeDatabase() {
  await pool?.end();
  pool = undefined;
  database = undefined;
}
