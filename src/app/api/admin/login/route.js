import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // ইমেইল থাকলেই (ফায়ারবেস দ্বারা অথেন্টিকেট হওয়ার পর) কুকি সেট করা হবে
    if (email) {
      const response = NextResponse.json({
        success: true,
        message: "Logged in successfully",
      });

      response.cookies.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      response.cookies.set("admin_logged_in", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
