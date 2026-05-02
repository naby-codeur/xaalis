import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/server-api";
import { resolveServerAccessToken } from "@/lib/server-access-token";

async function upstreamHeaders(): Promise<HeadersInit> {
  const token = await resolveServerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const headers = await upstreamHeaders();
  const response = await fetch(`${getApiBaseUrl()}/v1/contributions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const headers = await upstreamHeaders();
  const response = await fetch(`${getApiBaseUrl()}/v1/contributions/${id}`, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(data, { status: response.status });
}
