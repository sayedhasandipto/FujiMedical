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

export async function getCategories() {
  try {
    try {
      const res = await fetch(`${SERVER_URL}/api/categories`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { success: true, data: json.data };
      }
    } catch (serverErr) {
      console.warn("Express server unreachable, falling back to direct DB access:", serverErr.message);
    }

    const categoriesCol = await getCollection("categories");
    const productsCol = await getCollection("products");

    const categoriesFromCol = await categoriesCol.find({}).toArray();
    const productDocs = await productsCol.find({}).toArray();

    const categoryMap = new Map();

    categoriesFromCol.forEach((c) => {
      if (c.name) {
        categoryMap.set(c.name.trim().toLowerCase(), {
          _id: c._id.toString(),
          name: c.name.trim(),
          description: c.description || "",
        });
      }
    });

    productDocs.forEach((doc, idx) => {
      if (doc.category) {
        const catName = doc.category.trim();
        const key = catName.toLowerCase();
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            _id: doc._id ? doc._id.toString() : `cat_${idx}`,
            name: catName,
            description: `Products in ${catName}`,
          });
        }
      }
    });

    return {
      success: true,
      data: Array.from(categoryMap.values()),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createCategory(data) {
  try {
    await verifyAdmin();
    const name = data.name?.trim();
    const description = data.description?.trim() || "";

    if (!name) return { success: false, error: "Category name is required" };

    try {
      const res = await fetch(`${SERVER_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        const json = await res.json();
        revalidatePath("/admin/categories");
        revalidatePath("/admin/products");
        revalidatePath("/categories");
        return { success: true, data: json.data };
      }
    } catch (serverErr) {
      console.warn("Express server POST failed, falling back to DB:", serverErr.message);
    }

    const categoriesCol = await getCollection("categories");
    const newCategory = { name, description, createdAt: new Date(), updatedAt: new Date() };
    const result = await categoriesCol.insertOne(newCategory);

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");

    return {
      success: true,
      data: { _id: result.insertedId.toString(), ...newCategory },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id, data) {
  try {
    await verifyAdmin();
    const categoriesCol = await getCollection("categories");

    const updateObj = { updatedAt: new Date() };
    if (data.name !== undefined) updateObj.name = data.name.trim();
    if (data.description !== undefined) updateObj.description = data.description.trim();

    await categoriesCol.updateOne({ _id: new ObjectId(id) }, { $set: updateObj });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id) {
  try {
    await verifyAdmin();
    const categoriesCol = await getCollection("categories");
    await categoriesCol.deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
