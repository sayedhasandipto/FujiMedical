import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const updateObj = { updatedAt: new Date() };
    if (body.name !== undefined) updateObj.name = body.name;
    if (body.description !== undefined) updateObj.description = body.description;

    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, updateObj);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
