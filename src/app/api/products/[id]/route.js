import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Admin Verification using HTTP-only Cookie (same system as the rest of the project)
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === "authenticated";
}

function normalizeProduct(id, item) {
  return {
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
  };
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(`${DB_URL}/products/${id}.json`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const data = await res.json();

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const product = normalizeProduct(id, data);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const updateObj = { updatedAt: new Date().toISOString() };

    if (body.name !== undefined) updateObj.name = body.name;
    if (body.description !== undefined)
      updateObj.description = body.description;
    if (body.price !== undefined) updateObj.price = Number(body.price);
    if (body.offerPrice !== undefined)
      updateObj.offerPrice = body.offerPrice ? Number(body.offerPrice) : null;
    if (body.stock !== undefined) updateObj.stock = Number(body.stock);
    if (body.category !== undefined) updateObj.category = body.category;
    if (body.image !== undefined) updateObj.image = body.image;
    if (body.brand !== undefined) updateObj.brand = body.brand;
    if (body.genericName !== undefined)
      updateObj.genericName = body.genericName;
    if (body.unit !== undefined) updateObj.unit = body.unit;
    if (body.prescriptionRequired !== undefined)
      updateObj.prescriptionRequired = body.prescriptionRequired;

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 },
      );
    }

    const patchRes = await fetch(`${DB_URL}/products/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateObj),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      throw new Error(`Firebase REST error ${patchRes.status}: ${errText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 },
      );
    }

    const deleteRes = await fetch(`${DB_URL}/products/${id}.json`, {
      method: "DELETE",
    });

    if (!deleteRes.ok) {
      const errText = await deleteRes.text();
      throw new Error(`Firebase REST error ${deleteRes.status}: ${errText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
