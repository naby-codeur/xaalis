import { isWebDevAuthBypassEnabled } from "./dev-auth-bypass";
import { getApiBaseUrl } from "./server-api";
import {
  refreshDevBypassAccessToken,
  resolveServerAccessToken,
} from "./server-access-token";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message?: string };

const UPSTREAM_TIMEOUT_MS = 5000;

async function bearerHeaders(): Promise<HeadersInit> {
  let token = await resolveServerAccessToken();
  if (!token && isWebDevAuthBypassEnabled()) {
    const t2 = await refreshDevBypassAccessToken();
    if (t2) token = t2;
  }
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/** GET JSON vers l’API core (Bearer depuis cookie ou dev-login). */
export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  const headers = await bearerHeaders();
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    return { ok: false, status: 503, message };
  }

  if (res.status === 401 && isWebDevAuthBypassEnabled()) {
    const t2 = await refreshDevBypassAccessToken();
    if (t2) {
      try {
        res = await fetch(url, {
          headers: { Authorization: `Bearer ${t2}` },
          cache: "no-store",
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "fetch failed";
        return { ok: false, status: 503, message };
      }
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, status: res.status, message: text || res.statusText };
  }

  try {
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, status: res.status, message: "Invalid JSON" };
  }
}
