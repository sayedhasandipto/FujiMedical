"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { ref, get, push, update, remove, set } from "firebase/database";

import { db } from "@/lib/firebase";

// Admin Verification using HTTP-only Cookie
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token !== "authenticated") {
    throw new Error("Unauthorized");
  }

  return true;
}

export async function getCategories() {
  try {
    const categoriesRef = ref(db, "categories");
    const productsRef = ref(db, "products");

    const [categoriesSnap, productsSnap] = await Promise.all([
      get(categoriesRef),
      get(productsRef),
    ]);

    const categoryMap = new Map();

    if (categoriesSnap.exists()) {
      const categoriesData = categoriesSnap.val();

      Object.entries(categoriesData).forEach(([id, data]) => {
        categoryMap.set(data.name.trim().toLowerCase(), {
          _id: id,
          name: data.name,
          description: data.description || "",
          createdAt: data.createdAt || null,
        });
      });
    }

    if (productsSnap.exists()) {
      const productsData = productsSnap.val();

      Object.values(productsData).forEach((data, index) => {
        if (data.category) {
          const key = data.category.trim().toLowerCase();

          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              _id: `temp_${index}`,
              name: data.category,
              description: `Products in ${data.category}`,
            });
          }
        }
      });
    }

    return {
      success: true,
      data: [...categoryMap.values()],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function createCategory(data) {
  try {
    await verifyAdmin();

    const name = data.name?.trim();
    const description = data.description?.trim() || "";

    if (!name) {
      return {
        success: false,
        error: "Category name is required",
      };
    }

    const categoriesRef = ref(db, "categories");
    const newCategoryRef = push(categoriesRef);

    await set(newCategoryRef, {
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");

    return {
      success: true,
      data: {
        _id: newCategoryRef.key,
        name,
        description,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateCategory(id, data) {
  try {
    await verifyAdmin();

    const categoryRef = ref(db, `categories/${id}`);

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined)
      updateData.description = data.description.trim();

    await update(categoryRef, updateData);

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteCategory(id) {
  try {
    await verifyAdmin();

    await remove(ref(db, `categories/${id}`));

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
