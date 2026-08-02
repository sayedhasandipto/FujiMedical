import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname, origin } = request.nextUrl;

  // ১. /admin/login পেজটির ওপর কোনো বাধা থাকবে না (লুপ বা ৪০৪ বন্ধ করতে)
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // ২. শুধুমাত্র /admin এবং এর সাব-রুটে ঢুকলে কুকি চেক হবে
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    // BetterAuth API এর বদলে আমাদের তৈরি করা সিকিউর admin_token চেক করা হচ্ছে
    const adminToken = request.cookies.get("admin_token")?.value;

    // টোকেন না থাকলে সরাসরি Secret Admin Login পেজে পাঠাবে
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
