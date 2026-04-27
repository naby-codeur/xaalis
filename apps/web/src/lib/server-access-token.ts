import { cookies } from "next/headers";

import { isWebDevAuthBypassEnabled } from "./dev-auth-bypass";
import { getApiBaseUrl } from "./server-api";

async function fetchDevLoginAccessToken(): Promise<string | null> {
  const res = await fetch(`${getApiBaseUrl()}/v1/auth/dev-login`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json().catch(() => ({}))) as {
    accessToken?: string;
  };
  return data.accessToken ?? null;
}

/**
 * Jeton Bearer pour appels serveur vers l’API : cookie `access_token`, ou
 * `POST /v1/auth/dev-login` si bypass dev actif (sans persister le cookie).
 */
export async function resolveServerAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const fromCookie = jar.get("access_token")?.value;
  if (fromCookie) return fromCookie;

  if (!isWebDevAuthBypassEnabled()) return null;

  return fetchDevLoginAccessToken();
}

/** Nouveau jeton dev (ex. cookie obsolète + bypass actif). */
export async function refreshDevBypassAccessToken(): Promise<string | null> {
  if (!isWebDevAuthBypassEnabled()) return null;
  return fetchDevLoginAccessToken();
}
