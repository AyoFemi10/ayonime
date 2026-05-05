const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export { API_BASE };

export function apiFetch(path: string, init: Record<string, any> = {}): Promise<Response> {
  return fetch(`${API_BASE}${path}`, init);
}
