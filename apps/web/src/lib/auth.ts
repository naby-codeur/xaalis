import { cookies } from "next/headers";

const ACCESS_COOKIE = "access_token";

export async function readAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}
