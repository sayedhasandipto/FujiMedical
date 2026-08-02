import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_SECRET_PASSWORD;

    if (password && password === correctPassword) {
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

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid Password" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
