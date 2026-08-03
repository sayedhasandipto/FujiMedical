"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/categoryActions";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiGrid,
  FiCheck,
  FiX,
  FiSearch,
  FiLoader,
  FiFolder,
} from "react-icons/fi";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });

  const loadCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.success) {
      setCategories(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name || "", description: cat.description || "" });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    let res;
    if (editingCategory) {
      res = await updateCategory(editingCategory._id, form);
    } else {
      res = await createCategory(form);
    }

    setSubmitting(false);

    if (res.success) {
      setShowModal(false);
      loadCategories();
    } else {
      setErrorMsg(res.error || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      loadCategories();
    } else {
      alert("Failed to delete: " + res.error);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description &&
        c.description.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiGrid className="text-emerald-400" /> Category Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize products by categories for better browsing and search
            filters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-95 shrink-0"
        >
          <FiPlus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
        />
      </div>

      {/* Categories Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <FiLoader className="w-6 h-6 animate-spin text-emerald-400" />
          <span>Loading categories...</span>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <FiFolder className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-300">
            No categories found
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Click "Add Category" above to create your first category.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6 font-semibold">Category Name</th>
                  <th className="py-4 px-6 font-semibold">Description</th>
                  <th className="py-4 px-6 font-semibold">Created Date</th>
                  <th className="py-4 px-6 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          {cat.name[0]?.toUpperCase()}
                        </div>
                        {cat.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                      {cat.description || (
                        <span className="text-slate-600 italic">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition"
                        title="Edit Category"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition"
                        title="Delete Category"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiGrid className="text-emerald-400" />
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surgical Equipment, Diagnostic Tools"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this category..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
