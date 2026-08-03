"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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
          _id: item._id
            ? item._id.toString()
            : `${doc._id}_${itemIdx}`,
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
          parentDocId: doc._id,
        });
      });
    } else if (doc.name) {
      allProducts.push({
        ...doc,
        _id: doc._id,
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
    const productsSnapshot = await getDocs(collection(db, "products"));
    const docs = [];
    productsSnapshot.forEach((docSnap) => {
      docs.push({
        _id: docSnap.id,
        ...docSnap.data(),
      });
    });

    // Sort descending by createdAt
    docs.sort((a, b) => {
      const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
      const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      return dateB - dateA;
    });

    const products = extractProductsFromDocs(docs);

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

    if (!name || isNaN(price)) {
      return {
        success: false,
        error: "Product Name and valid Price are required",
      };
    }

    const payload = {
      name,
      description,
      price,
      offerPrice,
      stock,
      category,
      image,
      imageUrl,
    };

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
      console.warn(
        "Express server POST failed, falling back to DB:",
        serverErr.message,
      );
    }

    const q = query(collection(db, "products"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    let categoryDoc = null;
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      if (Array.isArray(d.products)) {
        categoryDoc = { _id: docSnap.id, ...d };
      }
    });

    if (categoryDoc) {
      const categoryDocRef = doc(db, "products", categoryDoc._id);
      await updateDoc(categoryDocRef, {
        products: arrayUnion(payload),
      });
    } else {
      await addDoc(collection(db, "products"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
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
      console.warn(
        "Express server DELETE failed, falling back to DB:",
        serverErr.message,
      );
    }

    if (id.includes("_")) {
      const [docIdStr, idxStr] = id.split("_");
      const docRef = doc(db, "products", docIdStr);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (Array.isArray(d.products)) {
          const products = [...d.products];
          products.splice(Number(idxStr), 1);
          await updateDoc(docRef, { products });
        }
      }
    } else {
      await deleteDoc(doc(db, "products", id));
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
