import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/server-api";
import { resolveServerAccessToken } from "@/lib/server-access-token";

async function upstreamHeaders(): Promise<HeadersInit> {
  const token = await resolveServerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const UPSTREAM_TIMEOUT_MS = 5000;

export async function GET() {
  const headers = await upstreamHeaders();
  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/auth/organization/logo`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        logoUrl: null,
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Service API indisponible. Demarrez l'API pour synchroniser le logo.",
        },
      },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    logoUrl?: string | null;
  };
  const headers = await upstreamHeaders();
  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/auth/organization/logo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ logoUrl: body.logoUrl ?? null }),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        logoUrl: null,
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Service API indisponible. Demarrez l'API pour synchroniser le logo.",
        },
      },
      { status: 503 },
    );
  }
}
