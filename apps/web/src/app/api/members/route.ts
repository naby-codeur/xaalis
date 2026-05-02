import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/server-api";
import { resolveServerAccessToken } from "@/lib/server-access-token";

async function upstreamHeaders(): Promise<HeadersInit> {
  const token = await resolveServerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const UPSTREAM_TIMEOUT_MS = 5000;

function networkErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown upstream error";
  return NextResponse.json(
    {
      error: "Upstream API unavailable",
      message,
      upstream: `${getApiBaseUrl()}/v1/members`,
    },
    { status: 503 },
  );
}

export async function GET() {
  try {
    const headers = await upstreamHeaders();
    const response = await fetch(`${getApiBaseUrl()}/v1/members`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return networkErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const headers = await upstreamHeaders();
    const response = await fetch(`${getApiBaseUrl()}/v1/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return networkErrorResponse(error);
  }
}
