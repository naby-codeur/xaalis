import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/server-api";
import { resolveServerAccessToken } from "@/lib/server-access-token";

async function upstreamHeaders(): Promise<HeadersInit> {
  const token = await resolveServerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  const headers = await upstreamHeaders();
  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/contributions`, {
      headers,
      cache: "no-store",
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        items: [],
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Service API indisponible. Demarrez l'API pour charger les cotisations.",
        },
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const headers = await upstreamHeaders();
  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: "Service API indisponible. Demarrez l'API avant de creer une cotisation.",
        },
      },
      { status: 503 },
    );
  }
}
