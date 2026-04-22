import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Aligné sur `WEB_ROUTES` dans `shared` (évite d’importer tout le package en Edge). */
const LOGIN = "/login";
const REGISTER = "/register";
const DASHBOARD = "/dashboard";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(DASHBOARD)) {
    if (!token) {
      return NextResponse.redirect(new URL(LOGIN, request.url));
    }
  }

  if ((pathname === LOGIN || pathname === REGISTER) && token) {
    return NextResponse.redirect(new URL(DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
