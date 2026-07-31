import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const productsCol = await getCollection("products");
    const products = await productsCol.find({}).sort({ createdAt: -1 }).toArray();
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

    const productsCol = await getCollection("products");
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

    const result = await productsCol.insertOne(newProduct);
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newProduct } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
