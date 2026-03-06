import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page
  if (pathname === "/panel/login") {
    return NextResponse.next();
  }

  // Protect all /panel/* routes
  if (pathname.startsWith("/panel")) {
    // Check for auth token in cookie or as a fallback check the header
    const token =
      request.cookies.get("rankeao_panel_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const loginUrl = new URL("/panel/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
