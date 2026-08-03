import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Admin Cookie Checker
async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === "authenticated";
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = [];
    querySnapshot.forEach((docSnap) => {
      categories.push({
        _id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    // 1. Verify admin token from cookie
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 },
      );
    }

    const newCategory = {
      name,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "categories"), newCategory);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: docRef.id,
          ...newCategory,
          createdAt: newCategory.createdAt.toISOString(),
          updatedAt: newCategory.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
