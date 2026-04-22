import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import type { AuthenticatedUser } from "shared";

import { getApiBaseUrl } from "./server-api";

export const getSessionUser = cache(async (): Promise<AuthenticatedUser> => {
  const jar = await cookies();
  const token = jar.get("access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${getApiBaseUrl()}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  return res.json() as Promise<AuthenticatedUser>;
});
