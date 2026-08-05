"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

// Admin Verification using HTTP-only Cookie (same system as categoryActions.js)
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token !== "authenticated") {
    throw new Error("Unauthorized: Admin access required.");
  }

  return true;
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
    createdAt: item.createdAt || null,
  };
}

export async function getProducts() {
  try {
    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const res = await fetch(`${DB_URL}/products.json`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const productsData = await res.json();

    if (!productsData) {
      return { success: true, data: [] };
    }

    const products = Object.entries(productsData).map(([id, item]) =>
      normalizeProduct(id, item),
    );

    // Sort descending by createdAt (if present)
    products.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("getProducts error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function createProduct(data) {
  try {
    await verifyAdmin();
    const name = data.name?.trim();
    const description = data.description?.trim() || "";
    const price = Number(data.price);
    const offerPrice = data.offerPrice ? Number(data.offerPrice) : null;
    const stock = Number(data.stock) || 0;
    const category = data.category || "General";
    const image = data.image || "";
    const imageUrl = data.imageUrl || image;
    const brand = data.brand || "";
    const genericName = data.genericName || "";
    const unit = data.unit || "";
    const prescriptionRequired = data.prescriptionRequired || false;

    if (!name || isNaN(price)) {
      return {
        success: false,
        error: "Product Name and valid Price are required",
      };
    }

    const payload = {
      name,
      brand,
      genericName,
      description,
      price,
      offerPrice,
      stock,
      unit,
      category,
      image: imageUrl || image,
      prescriptionRequired,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const pushRes = await fetch(`${DB_URL}/products.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!pushRes.ok) {
      const errText = await pushRes.text();
      throw new Error(`Firebase REST error ${pushRes.status}: ${errText}`);
    }

    const pushData = await pushRes.json();
    const newKey = pushData.name;

    revalidateTag("products");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/categories");

    return {
      success: true,
      data: { _id: newKey, ...payload },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id, data) {
  try {
    await verifyAdmin();

    const updateData = { updatedAt: new Date().toISOString() };

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.genericName !== undefined)
      updateData.genericName = data.genericName;
    if (data.description !== undefined)
      updateData.description = data.description.trim();
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.offerPrice !== undefined)
      updateData.offerPrice = data.offerPrice ? Number(data.offerPrice) : null;
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.imageUrl !== undefined) updateData.image = data.imageUrl;
    if (data.prescriptionRequired !== undefined)
      updateData.prescriptionRequired = data.prescriptionRequired;

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const patchRes = await fetch(`${DB_URL}/products/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      throw new Error(`Firebase REST error ${patchRes.status}: ${errText}`);
    }

    revalidateTag("products");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id) {
  try {
    await verifyAdmin();

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const deleteRes = await fetch(`${DB_URL}/products/${id}.json`, {
      method: "DELETE",
    });

    if (!deleteRes.ok) {
      const errText = await deleteRes.text();
      throw new Error(`Firebase REST error ${deleteRes.status}: ${errText}`);
    }

    revalidateTag("products");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
