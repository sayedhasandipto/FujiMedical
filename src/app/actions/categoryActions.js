"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

async function verifyAdmin() {
  const reqHeaders = await headers();

  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getCategories() {
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const productsSnapshot = await getDocs(collection(db, "products"));

    const categoryMap = new Map();

    categoriesSnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      categoryMap.set(data.name.trim().toLowerCase(), {
        _id: docSnap.id,
        name: data.name,
        description: data.description || "",
      });
    });

    productsSnapshot.forEach((docSnap, index) => {
      const data = docSnap.data();

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

    const docRef = await addDoc(collection(db, "categories"), {
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");

    return {
      success: true,
      data: {
        _id: docRef.id,
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

    const categoryRef = doc(db, "categories", id);

    const updateData = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name.trim();

    if (data.description !== undefined)
      updateData.description = data.description.trim();

    await updateDoc(categoryRef, updateData);

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

    await deleteDoc(doc(db, "categories", id));

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
