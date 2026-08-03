import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function GET() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = [];
    productsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        _id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString()) : null,
        updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : new Date(data.updatedAt).toISOString()) : null,
      });
    });

    products.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, offerPrice, stock, category, image } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ success: false, error: "Name and price are required" }, { status: 400 });
    }

    const newProduct = {
      name,
      description: description || "",
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      stock: Number(stock) || 0,
      category: category || "",
      image: image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "products"), newProduct);
    return NextResponse.json({ success: true, data: { _id: docRef.id, ...newProduct } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
