"use client";

import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/actions/productActions";
import { getCategories } from "@/app/actions/categoryActions";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiCheck,
  FiX,
  FiSearch,
  FiLoader,
  FiUploadCloud,
  FiImage,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
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
    const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
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
      offerPrice: product.offerPrice !== null && product.offerPrice !== undefined ? String(product.offerPrice) : "",
      stock: product.stock !== undefined ? String(product.stock) : "0",
      category: product.category || (categories[0]?.name || ""),
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
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

    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct._id, form);
    } else {
      res = await createProduct(form);
    }

    setSubmitting(false);

    if (res.success) {
      setShowModal(false);
      loadData();
    } else {
      setErrorMsg(res.error || "Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      loadData();
    } else {
      alert("Failed to delete: " + res.error);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
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
            Add, update, or remove products, configure pricing, stock levels & categories.
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
          <p className="text-lg font-medium text-slate-300">No products found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or add a new product.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6 font-semibold">Product Info</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Price / Offer</th>
                  <th className="py-4 px-6 font-semibold">Stock</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => {
                  const hasOffer = product.offerPrice !== null && product.offerPrice !== undefined && Number(product.offerPrice) > 0;
                  return (
                    <tr key={product._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 bg-slate-950 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-500 shrink-0">
                              <FiImage className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white text-base">{product.name}</p>
                            <p className="text-xs text-slate-400 max-w-xs truncate mt-0.5">
                              {product.description || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
                          <FiTag className="w-3 h-3" />
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {hasOffer ? (
                          <div className="space-y-0.5">
                            <div className="text-emerald-400 font-bold text-base flex items-center gap-1">
                              ${Number(product.offerPrice).toFixed(2)}
                              <span className="text-[10px] uppercase font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                                Sale
                              </span>
                            </div>
                            <div className="text-slate-500 text-xs line-through">
                              ${Number(product.price).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-white font-bold text-base">
                            ${Number(product.price).toFixed(2)}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {product.stock > 10 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {product.stock} in stock
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Low: {product.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                            Out of stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition"
                          title="Edit Product"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition"
                          title="Delete Product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-400 mt-1">
                    No categories found. Create categories first in Category Management.
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
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
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
                      <p className="text-xs font-semibold text-slate-300">Image Loaded</p>
                      <p className="text-[11px] text-slate-500 truncate">{form.image.slice(0, 50)}...</p>
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
    </div>
  );
}
