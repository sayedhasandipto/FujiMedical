import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const categoriesCol = await getCollection("categories");
    const categories = await categoriesCol.find({}).toArray();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const categoriesCol = await getCollection("categories");
    const newCategory = {
      name,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await categoriesCol.insertOne(newCategory);
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newCategory } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
