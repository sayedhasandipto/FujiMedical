import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Helper function to verify admin httpOnly cookie
async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === "authenticated";
}

// GET all products
export async function GET() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = [];
    productsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        _id: docSnap.id,
        ...data,
        createdAt: data.createdAt
          ? data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : new Date(data.createdAt).toISOString()
          : null,
        updatedAt: data.updatedAt
          ? data.updatedAt.toDate
            ? data.updatedAt.toDate().toISOString()
            : new Date(data.updatedAt).toISOString()
          : null,
      });
    });

    products.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - Add a new product (admin only)
export async function POST(req) {
  try {
    // 1. Verify admin token from cookie
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name, description, price, offerPrice, stock, category, image } =
      body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 },
      );
    }

    const newProduct = {
      name,
      description: description || "",
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      stock: Number(stock) || 0,
      category: category || "",
      image: image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "products"), newProduct);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: docRef.id,
          ...newProduct,
          createdAt: newProduct.createdAt.toISOString(),
          updatedAt: newProduct.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
