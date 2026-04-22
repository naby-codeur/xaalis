import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/server-api";

function cookieMaxAgeSeconds(): number {
  const raw = process.env.JWT_ACCESS_TTL ?? "15m";
  const m = /^(\d+)([smhd])$/i.exec(raw.trim());
  if (!m) return 15 * 60;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  const mult = u === "s" ? 1 : u === "m" ? 60 : u === "h" ? 3600 : 86400;
  return n * mult;
}

export async function POST(request: Request) {
  const body = await request.json();
  const base = getApiBaseUrl();

  const upstream = await fetch(`${base}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await upstream.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const accessToken = data.accessToken as string | undefined;
  const user = data.user;
  if (!accessToken || !user) {
    return NextResponse.json(
      { error: { code: "BAD_GATEWAY", message: "Invalid API response" } },
      { status: 502 },
    );
  }

  const jar = await cookies();
  jar.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAgeSeconds(),
  });

  return NextResponse.json({ user }, { status: 201 });
}
