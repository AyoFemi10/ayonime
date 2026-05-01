const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export { API_BASE };

export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  if (API_KEY) headers["x-api-key"] = API_KEY;

  return fetch(`${API_BASE}${path}`, { ...init, headers });
}
