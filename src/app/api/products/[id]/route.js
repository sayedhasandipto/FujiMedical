import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    let product = null;

    // 1. Try querying by direct document ID
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      product = {
        _id: docSnap.id,
        ...docSnap.data(),
      };
    }

    // 2. Fallback: If products are nested inside category documents (e.g. id like '6a6c..._0')
    if (!product && id.includes("_")) {
      const [docIdStr, idxStr] = id.split("_");
      const parentDocRef = doc(db, "products", docIdStr);
      const parentDocSnap = await getDoc(parentDocRef);
      if (parentDocSnap.exists()) {
        const parentDoc = parentDocSnap.data();
        if (parentDoc && Array.isArray(parentDoc.products)) {
          const itemIdx = Number(idxStr);
          const item = parentDoc.products[itemIdx];
          if (item) {
            product = {
              _id: id,
              name: item.name || "Unnamed Product",
              brand: item.brand || "",
              genericName: item.genericName || "",
              category: parentDoc.category || item.category || "General",
              price: Number(item.price) || 0,
              offerPrice: item.offerPrice ? Number(item.offerPrice) : null,
              stock: Number(item.stock) || 0,
              unit: item.unit || "",
              description: item.description || "",
              prescriptionRequired: item.prescriptionRequired || false,
              image: item.image || "",
            };
          }
        }
      }
    }

    // 3. Fallback: Search all documents for matching product inside array or flat item
    if (!product) {
      const productsSnapshot = await getDocs(collection(db, "products"));
      for (const docSnap of productsSnapshot.docs) {
        const d = docSnap.data();
        if (Array.isArray(d.products)) {
          const matchedItem = d.products.find(
            (p, idx) => p._id?.toString() === id || `${docSnap.id}_${idx}` === id
          );
          if (matchedItem) {
            product = {
              _id: id,
              name: matchedItem.name,
              brand: matchedItem.brand || "",
              genericName: matchedItem.genericName || "",
              category: d.category || matchedItem.category || "General",
              price: Number(matchedItem.price) || 0,
              offerPrice: matchedItem.offerPrice ? Number(matchedItem.offerPrice) : null,
              stock: Number(matchedItem.stock) || 0,
              unit: matchedItem.unit || "",
              description: matchedItem.description || "",
              prescriptionRequired: matchedItem.prescriptionRequired || false,
              image: matchedItem.image || "",
            };
            break;
          }
        }
      }
    }

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        _id: product._id.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const updateObj = { updatedAt: new Date() };

    if (body.name !== undefined) updateObj.name = body.name;
    if (body.description !== undefined) updateObj.description = body.description;
    if (body.price !== undefined) updateObj.price = Number(body.price);
    if (body.offerPrice !== undefined) updateObj.offerPrice = body.offerPrice ? Number(body.offerPrice) : null;
    if (body.stock !== undefined) updateObj.stock = Number(body.stock);
    if (body.category !== undefined) updateObj.category = body.category;
    if (body.image !== undefined) updateObj.image = body.image;

    const docRef = doc(db, "products", id);
    await updateDoc(docRef, updateObj);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
