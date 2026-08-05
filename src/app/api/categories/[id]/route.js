import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

// ── Admin cookie check ────────────────────────────────────────────────────────
async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === "authenticated";
}

// ── PUT /api/categories/[id] — admin only ────────────────────────────────────
export async function PUT(req, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const updateObj = { updatedAt: new Date().toISOString() };
    if (body.name !== undefined) updateObj.name = body.name.trim();
    if (body.description !== undefined) updateObj.description = body.description.trim();

    const res = await fetch(`${DB_URL}/categories/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateObj),
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ── DELETE /api/categories/[id] — admin only ─────────────────────────────────
export async function DELETE(req, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const res = await fetch(`${DB_URL}/categories/${id}.json`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
