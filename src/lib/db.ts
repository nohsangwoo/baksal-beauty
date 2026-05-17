import { Pool, type QueryResultRow } from "@neondatabase/serverless";

let pool: Pool | undefined;

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

function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL. Connect bsclinic-db or set DATABASE_URL first.");
  }

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  return pool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return getPool().query<T>(text, params);
}

export function toPostgresArray(values: string[]) {
  return `{${values.map((value) => `"${value.replaceAll('"', '\\"')}"`).join(",")}}`;
}
