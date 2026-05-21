export type AdminSection = "dashboard" | "users" | "services" | "blog" | "inquire";

export type AdminRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
};

export type ListResponse<T> = {
  source: "database" | "fallback";
  items: T[];
};

export const emptyRecord: AdminRecord = {
  id: "",
  title: "",
  subtitle: "",
  status: "draft",
  meta: "",
  imageUrl: "",
  tags: [],
};

export function getEmptyRecord(tab: "users" | "inquire"): AdminRecord {
  if (tab === "users") {
    return {
      ...emptyRecord,
      status: "active",
      meta: "Patient",
      tags: ["manual"],
    };
  }

  return emptyRecord;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.error ?? "Request failed.");
  }

  return json as T;
}

export function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitComma(value: string) {
  return value
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
}
