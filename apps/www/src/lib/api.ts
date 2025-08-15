// apps/www/src/lib/api.ts
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000")
  .replace(/\/+$/g, "");

export async function api(path: string, init?: RequestInit) {
  const isAbsolute = /^https?:\/\//i.test(path);
  const isLocalApi = path.startsWith("/api/");
  const url = isAbsolute ? path : isLocalApi
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("nevilinq_token") : null;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (typeof data === "object" && data && (data.detail || (data as any).message)) || res.statusText;
    throw new Error(`API ${res.status} ${message}`);
  }
  return data;
}
