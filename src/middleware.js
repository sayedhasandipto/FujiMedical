import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  // Routes that require authentication
  const protectedRoutes = ["/checkout", "/profile", "/orders"];

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  ) || isAdminRoute;

  if (isProtected) {
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
        const loginUrl = new URL("/login", origin);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Admin access validation
      if (isAdminRoute && session.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", origin));
      }
    } catch (error) {
      console.error("Middleware authentication check failed:", error);
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
