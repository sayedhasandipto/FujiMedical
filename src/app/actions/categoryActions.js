"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

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
    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${DB_URL}/categories.json`, { cache: "no-store" }),
      fetch(`${DB_URL}/products.json`, { cache: "no-store" }),
    ]);

    if (!categoriesRes.ok) {
      throw new Error(`Firebase categories REST error: ${categoriesRes.status}`);
    }
    if (!productsRes.ok) {
      throw new Error(`Firebase products REST error: ${productsRes.status}`);
    }

    const categoriesData = await categoriesRes.json();
    const productsData = await productsRes.json();

    const categoryMap = new Map();

    if (categoriesData) {
      Object.entries(categoriesData).forEach(([id, data]) => {
        categoryMap.set(data.name.trim().toLowerCase(), {
          _id: id,
          name: data.name,
          description: data.description || "",
          createdAt: data.createdAt || null,
        });
      });
    }

    if (productsData) {
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

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const payload = {
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pushRes = await fetch(`${DB_URL}/categories.json`, {
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

    revalidateTag("categories");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");

    return {
      success: true,
      data: {
        _id: newKey,
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

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined)
      updateData.description = data.description.trim();

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const patchRes = await fetch(`${DB_URL}/categories/${id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      throw new Error(`Firebase REST error ${patchRes.status}: ${errText}`);
    }

    revalidateTag("categories");
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

    const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    if (!DB_URL) {
      return { success: false, error: "Firebase database URL not configured" };
    }

    const deleteRes = await fetch(`${DB_URL}/categories/${id}.json`, {
      method: "DELETE",
    });

    if (!deleteRes.ok) {
      const errText = await deleteRes.text();
      throw new Error(`Firebase REST error ${deleteRes.status}: ${errText}`);
    }

    revalidateTag("categories");
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
