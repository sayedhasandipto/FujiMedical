import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { cookies } from "next/headers";
import { ref, get, update, remove } from "firebase/database";

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

    const productRef = ref(db, `products/${id}`);

    const getPromise = get(productRef);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database read timed out")), 8000),
    );

    const snapshot = await Promise.race([getPromise, timeoutPromise]);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const product = normalizeProduct(id, snapshot.val());

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

    await update(ref(db, `products/${id}`), updateObj);

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

    await remove(ref(db, `products/${id}`));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
