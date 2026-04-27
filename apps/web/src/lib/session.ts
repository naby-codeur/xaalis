import { cookies } from "next/headers";
import { cache } from "react";

import { getDevBypassAuthenticatedUser, type AuthenticatedUser } from "shared";

import { getApiBaseUrl } from "./server-api";

export const getSessionUser = cache(async (): Promise<AuthenticatedUser> => {
  const jar = await cookies();
  const token = jar.get("access_token")?.value;
  if (!token) {
    return getDevBypassAuthenticatedUser();
  }

  const res = await fetch(`${getApiBaseUrl()}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return getDevBypassAuthenticatedUser();
  }

  return res.json() as Promise<AuthenticatedUser>;
});
