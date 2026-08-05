// src/proxy.js
// Layer 1: Proxy-level route guard for all /admin routes
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── EXCEPTION: /admin/login is always accessible (prevents redirect loop) ──
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // ── PROTECTED: all /admin routes require a valid admin_token cookie ──
  const adminToken = request.cookies.get("admin_token")?.value;

  if (!adminToken || adminToken !== "authenticated") {
    // Hard redirect — no layout, no children rendered at all
    const loginUrl = new URL("/admin/login", request.nextUrl.origin);

    const response = NextResponse.redirect(loginUrl);

    // Wipe any stale/tampered cookie immediately
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("admin_logged_in", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Exact matcher per requirements: covers /admin and every sub-path
  matcher: ["/admin", "/admin/:path*"],
};
