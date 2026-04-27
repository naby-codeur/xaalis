import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  void request;
  // Auth temporairement desactivee: acces direct a toutes les routes.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/projects/:path*",
    "/reports/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
