import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const productsCol = await getCollection("products");
    let product = null;

    // 1. Try querying by MongoDB ObjectId
    if (ObjectId.isValid(id)) {
      product = await productsCol.findOne({ _id: new ObjectId(id) });
    }

    // 2. Fallback: Try querying by string _id
    if (!product) {
      product = await productsCol.findOne({ _id: id });
    }

    // 3. Fallback: If products are nested inside category documents (e.g. id like '6a6c..._0')
    if (!product && id.includes("_")) {
      const [docIdStr, idxStr] = id.split("_");
      if (ObjectId.isValid(docIdStr)) {
        const parentDoc = await productsCol.findOne({ _id: new ObjectId(docIdStr) });
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

    // 4. Fallback: Search all documents for matching product inside array or flat item
    if (!product) {
      const allDocs = await productsCol.find({}).toArray();
      for (const doc of allDocs) {
        if (Array.isArray(doc.products)) {
          const matchedItem = doc.products.find(
            (p, idx) => p._id?.toString() === id || `${doc._id.toString()}_${idx}` === id
          );
          if (matchedItem) {
            product = {
              _id: id,
              name: matchedItem.name,
              brand: matchedItem.brand || "",
              genericName: matchedItem.genericName || "",
              category: doc.category || matchedItem.category || "General",
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

    const productsCol = await getCollection("products");
    if (ObjectId.isValid(id)) {
      await productsCol.updateOne({ _id: new ObjectId(id) }, { $set: updateObj });
    } else {
      await productsCol.updateOne({ _id: id }, { $set: updateObj });
    }

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

    const productsCol = await getCollection("products");
    if (ObjectId.isValid(id)) {
      await productsCol.deleteOne({ _id: new ObjectId(id) });
    } else {
      await productsCol.deleteOne({ _id: id });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
