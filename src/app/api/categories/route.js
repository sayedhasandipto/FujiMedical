import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

// Admin cookie check
async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === "authenticated";
}

// GET /api/categories — cached with Next.js ISR (60 seconds) & revalidation tags
export async function GET() {
  try {
    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 }
      );
    }

    // Fetch concurrently using Promise.all to prevent waterfall blocking
    const [catRes, prodRes] = await Promise.all([
      fetch(`${DB_URL}/categories.json`, {
        next: { revalidate: 60, tags: ["categories"] },
      }),
      fetch(`${DB_URL}/products.json`, {
        next: { revalidate: 60, tags: ["products"] },
      }),
    ]);

    const categoryMap = new Map();

    if (catRes.ok) {
      const catData = await catRes.json();
      if (catData) {
        Object.entries(catData).forEach(([id, data]) => {
          categoryMap.set(data.name?.trim().toLowerCase(), {
            _id: id,
            name: data.name,
            description: data.description || "",
            createdAt: data.createdAt || null,
          });
        });
      }
    }

    // Derive categories from cached products fallback
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      if (prodData) {
        Object.values(prodData).forEach((data, index) => {
          if (data.category) {
            const key = data.category.trim().toLowerCase();
            if (!categoryMap.has(key)) {
              categoryMap.set(key, {
                _id: `derived_${index}`,
                name: data.category,
                description: `Products in ${data.category}`,
              });
            }
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: [...categoryMap.values()],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/categories — admin only
export async function POST(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    if (!DB_URL) {
      return NextResponse.json(
        { success: false, error: "Database URL not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = {
      name,
      description: description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(`${DB_URL}/categories.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });

    if (!res.ok) {
      throw new Error(`Firebase REST error: ${res.status}`);
    }

    const result = await res.json();

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.name, ...newCategory },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
