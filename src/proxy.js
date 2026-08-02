import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname, origin } = request.nextUrl;

  // Exclude /admin/login from admin protection to prevent loops
  const isAdminRoute = (pathname === "/admin" || pathname.startsWith("/admin/")) && pathname !== "/admin/login";

  if (isAdminRoute) {
    try {
      const response = await fetch(`${origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session status");
      }

      const session = await response.json();

      // BetterAuth returns null or an object without session if unauthenticated
      if (!session || !session.session) {
        return NextResponse.redirect(new URL("/admin/login", origin));
      }

      // Admin access validation
      if (session.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", origin));
      }
    } catch (error) {
      console.error("Proxy authentication check failed:", error);
      return NextResponse.redirect(new URL("/admin/login", origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
