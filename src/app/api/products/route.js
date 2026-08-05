import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

// Admin cookie check
async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === "authenticated";
}

// GET /api/products — cached with Next.js ISR (60 seconds) & revalidation tags
export async function GET() {
  try {
    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 }
      );
    }

    // Cached fetching using Next.js native fetch caching
    const res = await fetch(`${DB_URL}/products.json`, {
      next: { revalidate: 60, tags: ["products"] },
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const data = await res.json();

    if (!data) {
      return NextResponse.json({ success: true, data: [] });
    }

    const products = Object.entries(data).map(([id, item]) => ({
      _id: id,
      name: item.name || "Unnamed Product",
      brand: item.brand || "",
      genericName: item.genericName || "",
      category: item.category || "General",
      price: Number(item.price) || 0,
      offerPrice: item.offerPrice ? Number(item.offerPrice) : null,
      stock: Number(item.stock) || 0,
      unit: item.unit || "",
      description: item.description || "",
      prescriptionRequired: item.prescriptionRequired || false,
      image: item.image || "",
      createdAt: item.createdAt || null,
    }));

    products.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products — admin only
export async function POST(req) {
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

    const body = await req.json();
    const { name, description, price, offerPrice, stock, category, image } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 }
      );
    }

    const newProduct = {
      name,
      description: description || "",
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      stock: Number(stock) || 0,
      category: category || "General",
      image: image || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(`${DB_URL}/products.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const result = await res.json();

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.name, ...newProduct },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
