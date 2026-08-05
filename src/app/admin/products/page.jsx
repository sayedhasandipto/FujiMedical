"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/actions/productActions";
import { getCategories } from "@/app/actions/categoryActions";
import { uploadImageToImgbb } from "@/app/actions/imageActions";
import {
  FiPlus,
  FiBox,
  FiCheck,
  FiX,
  FiSearch,
  FiLoader,
  FiUploadCloud,
  FiImage,
  FiPercent,
  FiDollarSign,
  FiLayers,
  FiAlertTriangle,
  FiTrash2,
} from "react-icons/fi";
import ProductList from "@/component/ProductList";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // holds the product being deleted
  const [deleting, setDeleting] = useState(false);

  // Image Upload Mode: 'file' | 'url'
  const [imageMode, setImageMode] = useState("file");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    stock: "",
    category: "",
    image: "",
  });

  const loadData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    if (prodRes.success) setProducts(prodRes.data);
    if (catRes.success) setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      offerPrice: "",
      stock: "10",
      category: categories[0]?.name || "",
      image: "",
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price !== undefined ? String(product.price) : "",
      offerPrice:
        product.offerPrice !== null && product.offerPrice !== undefined
          ? String(product.offerPrice)
          : "",
      stock: product.stock !== undefined ? String(product.stock) : "0",
      category: product.category || categories[0]?.name || "",
      image: product.image || "",
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    setImageFile(file);
    setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      setErrorMsg("Valid positive price is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Upload image to ImgBB (free hosting, no CORS issues since it
      //    runs through our server action instead of the browser directly)
      let imageUrl = form.image || "";
      if (imageMode === "file" && imageFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);

        const uploadRes = await uploadImageToImgbb(imgFormData);

        if (!uploadRes.success) {
          throw new Error(uploadRes.error || "Image upload failed");
        }

        imageUrl = uploadRes.url;
      }

      // 2. Build the canonical product object
      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        offerPrice: form.offerPrice ? Number(form.offerPrice) : null,
        category: form.category || "General",
        description: form.description?.trim() || "",
        stock: Number(form.stock) || 0,
        imageUrl,
        image: imageUrl,
        createdAt: Date.now(),
      };

      if (editingProduct) {
        // For edits: still delegate to Server Action
        const submissionForm = { ...form, image: imageUrl, imageUrl };
        const res = await updateProduct(editingProduct._id, submissionForm);
        setSubmitting(false);
        if (res.success) {
          setShowModal(false);
          setImageFile(null);
          loadData();
        } else {
          setErrorMsg(res.error || "Failed to update product.");
        }
      } else {
        // 3. Call the server action to create the product
        const res = await createProduct(productData);
        setSubmitting(false);
        if (res.success) {
          setShowModal(false);
          setImageFile(null);
          setForm({
            name: "",
            description: "",
            price: "",
            offerPrice: "",
            stock: "10",
            category: categories[0]?.name || "",
            image: "",
          });
          loadData();
        } else {
          setErrorMsg(res.error || "Failed to create product.");
        }
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg("Error: " + err.message);
    }
  };

  // Opens the custom confirmation modal instead of native confirm()
  const handleDeleteClick = (product) => {
    setErrorMsg("");
    setDeleteTarget(product);
  };

  // Runs after the user confirms inside the modal
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setErrorMsg("");
    const res = await deleteProduct(deleteTarget._id);
    setDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      loadData();
    } else {
      setErrorMsg(res.error || "Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCat =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiBox className="text-emerald-400" /> Product Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Add, update, or remove products, configure pricing, stock levels &
            categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-95 shrink-0"
        >
          <FiPlus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <FiSearch className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <FiLayers className="text-slate-400 w-5 h-5 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <FiLoader className="w-6 h-6 animate-spin text-emerald-400" />
          <span>Loading inventory...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <FiBox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-300">
            No products found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search query or add a new product.
          </p>
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteClick}
        />
      )}


      {/* Add / Edit Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiBox className="text-emerald-400" />
                {editingProduct ? "Edit Product Details" : "Create New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Stethoscope, Surgical Gloves Box"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed specs, features, and medical applications..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Price, Offer Price, Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Offer / Discount Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="79.99 (Optional)"
                    value={form.offerPrice}
                    onChange={(e) =>
                      setForm({ ...form, offerPrice: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-400 mt-1">
                    No categories found. Create categories first in Category
                    Management.
                  </p>
                )}
              </div>

              {/* Image Upload Capability */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Product Image
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`px-3 py-1 rounded-lg transition font-medium ${
                        imageMode === "file"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-3 py-1 rounded-lg transition font-medium ${
                        imageMode === "url"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageMode === "file" ? (
                  <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-slate-950/50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <FiUploadCloud className="w-8 h-8 text-emerald-400" />
                      <span className="text-sm font-medium text-slate-300">
                        Click to upload product image
                      </span>
                      <span className="text-xs text-slate-500">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                )}

                {/* Preview */}
                {form.image && (
                  <div className="mt-4 flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="flex-1 truncate">
                      <p className="text-xs font-semibold text-slate-300">
                        Image Loaded
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {form.image.slice(0, 50)}...
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="text-slate-500 hover:text-red-400 text-xs font-semibold p-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiCheck className="w-4 h-4" />
                  )}
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {errorMsg}
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  Delete this product?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  You're about to permanently delete{" "}
                  <span className="text-slate-200 font-semibold">
                    "{deleteTarget.name}"
                  </span>
                  . This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Small preview of the product being deleted */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3">
              {deleteTarget.image ? (
                <img
                  src={deleteTarget.image}
                  alt={deleteTarget.name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                  <FiImage className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {deleteTarget.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {deleteTarget.category || "Uncategorized"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {deleting ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiTrash2 className="w-4 h-4" />
                )}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
