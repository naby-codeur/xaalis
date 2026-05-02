import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/server-api";
import { resolveServerAccessToken } from "@/lib/server-access-token";

async function upstreamHeaders(): Promise<HeadersInit> {
  const token = await resolveServerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  const headers = await upstreamHeaders();
  const response = await fetch(`${getApiBaseUrl()}/v1/organization/users`, {
    headers,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}
