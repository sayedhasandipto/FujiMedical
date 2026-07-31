"use server";

import { getCollection } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session.user;
}

function extractProductsFromDocs(docs) {
  const allProducts = [];
  docs.forEach((doc) => {
    if (Array.isArray(doc.products)) {
      doc.products.forEach((item, itemIdx) => {
        allProducts.push({
          _id: item._id ? item._id.toString() : `${doc._id.toString()}_${itemIdx}`,
          name: item.name || "Unnamed Product",
          brand: item.brand || "",
          genericName: item.genericName || "",
          category: doc.category || item.category || "General",
          price: Number(item.price) || 0,
          offerPrice: item.offerPrice ? Number(item.offerPrice) : null,
          stock: Number(item.stock) || 0,
          unit: item.unit || "",
          description: item.description || "",
          prescriptionRequired: item.prescriptionRequired || false,
          image: item.image || "",
          parentDocId: doc._id.toString(),
        });
      });
    } else if (doc.name) {
      allProducts.push({
        ...doc,
        _id: doc._id.toString(),
        category: doc.category || "General",
        price: Number(doc.price) || 0,
        stock: Number(doc.stock) || 0,
      });
    }
  });
  return allProducts;
}

export async function getProducts() {
  try {
    try {
      const res = await fetch(`${SERVER_URL}/api/products`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { success: true, data: json.data };
      }
    } catch (serverErr) {
      console.warn("Express server unreachable, falling back to direct DB access:", serverErr.message);
    }

    const productsCol = await getCollection("products");
    const docs = await productsCol.find({}).toArray();
    const products = extractProductsFromDocs(docs);

    return {
      success: true,
      data: products,
    };
  } catch (error) {
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

    if (!name || isNaN(price)) {
      return { success: false, error: "Product Name and valid Price are required" };
    }

    const payload = { name, description, price, offerPrice, stock, category, image };

    try {
      const res = await fetch(`${SERVER_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        revalidatePath("/admin/products");
        revalidatePath("/");
        revalidatePath("/categories");
        return { success: true, data: json.data };
      }
    } catch (serverErr) {
      console.warn("Express server POST failed, falling back to DB:", serverErr.message);
    }

    const productsCol = await getCollection("products");
    const categoryDoc = await productsCol.findOne({ category, products: { $exists: true } });

    if (categoryDoc) {
      await productsCol.updateOne(
        { _id: categoryDoc._id },
        { $push: { products: payload } }
      );
    } else {
      await productsCol.insertOne({ ...payload, createdAt: new Date() });
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id, data) {
  try {
    await verifyAdmin();
    try {
      const res = await fetch(`${SERVER_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        revalidatePath("/admin/products");
        revalidatePath("/");
        revalidatePath("/categories");
        return { success: true };
      }
    } catch (serverErr) {
      console.warn("Express server PUT failed:", serverErr.message);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id) {
  try {
    await verifyAdmin();
    try {
      const res = await fetch(`${SERVER_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        revalidatePath("/admin/products");
        revalidatePath("/");
        revalidatePath("/categories");
        return { success: true };
      }
    } catch (serverErr) {
      console.warn("Express server DELETE failed, falling back to DB:", serverErr.message);
    }

    const productsCol = await getCollection("products");
    if (id.includes("_")) {
      const [docIdStr, idxStr] = id.split("_");
      const doc = await productsCol.findOne({ _id: new ObjectId(docIdStr) });
      if (doc && Array.isArray(doc.products)) {
        doc.products.splice(Number(idxStr), 1);
        await productsCol.updateOne({ _id: new ObjectId(docIdStr) }, { $set: { products: doc.products } });
      }
    } else {
      await productsCol.deleteOne({ _id: new ObjectId(id) });
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
