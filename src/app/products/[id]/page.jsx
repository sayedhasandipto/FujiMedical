"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProducts } from "@/app/actions/productActions";
import { useCart } from "@/context/CartContext";
import { Button } from "@heroui/react";
import {
  MdShoppingCart,
  MdPhone,
  MdArrowBack,
  MdCheckCircle,
  MdRemove,
  MdAdd,
  MdOutlineMedicalInformation,
  MdVerifiedUser,
  MdLocalShipping,
  MdBlock,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
const WHATSAPP_NUMBER = "8801826637443";
const PHONE_NUMBER = "+8801826637443";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);

      // 1. Try single item API route first
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProduct(json.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Single product API fetch error, trying Server Action fallback:", err);
      }

      // 2. Fallback to Server Action list lookup
      const res = await getProducts();
      if (res.success && res.data) {
        const found = res.data.find(
          (p) => p._id === id || p._id?.toString() === id?.toString()
        );
        setProduct(found || null);
      } else {
        setProduct(null);
      }
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{
          width: 48, height: 48,
          border: "5px solid #d1fae5",
          borderTop: "5px solid #16a34a",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 max-w-md w-full shadow-xl space-y-4">
          <MdOutlineMedicalInformation className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Product Not Found
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The requested medicine or healthcare item could not be found or has been removed from inventory.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            <MdArrowBack /> Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const currentPrice =
    product.offerPrice !== null && product.offerPrice !== undefined && Number(product.offerPrice) > 0
      ? Number(product.offerPrice)
      : Number(product.price || 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const whatsappMessage = encodeURIComponent(
    `Hello FujiMedical Hall, I would like to order:\n` +
      `📦 *${product.name}*\n` +
      `💰 Price: ৳${currentPrice.toFixed(2)} x ${quantity} = ৳${(
        currentPrice * quantity
      ).toFixed(2)}\n` +
      `🏷️ Category: ${product.category || "N/A"}\n\n` +
      `Please confirm availability & delivery details.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 relative">

      {/* Top Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
          >
            <MdArrowBack className="w-5 h-5" /> Back to Store
          </button>

          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {product.category || "Healthcare"}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image Column */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden relative border border-slate-200 dark:border-slate-700">
              {product.image ? (
                <img
                  src={product.image || `https://placehold.co/500x500/10b981/ffffff?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/500x500/10b981/ffffff?text=${encodeURIComponent(
                      product.name
                    )}`;
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdOutlineMedicalInformation className="w-24 h-24 text-slate-300 dark:text-slate-600" />
              )}

              {/* Stock Badge Overlay */}
              {isOutOfStock ? (
                <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <MdBlock /> Out of Stock
                </span>
              ) : (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <MdCheckCircle /> In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <MdVerifiedUser className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>100% Genuine Medicine</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <MdLocalShipping className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Fast Home Delivery</span>
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {product.brand || "FujiMedical Grade"}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-tight">
                  {product.name}
                </h1>
                {product.genericName && (
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    Generic: {product.genericName}
                  </p>
                )}
              </div>

              {/* Price & Offer Display */}
              <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-emerald-50/40 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-800">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ৳{currentPrice.toFixed(2)}
                </span>
                {product.offerPrice && Number(product.offerPrice) > 0 && (
                  <span className="text-slate-400 line-through text-sm font-bold">
                    ৳{Number(product.price).toFixed(2)}
                  </span>
                )}
                {product.unit && (
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-auto bg-emerald-100/70 dark:bg-slate-700 px-3 py-1 rounded-lg border border-emerald-200/50">
                    {product.unit}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Description & Specs
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {product.description ||
                    "Genuine healthcare and pharmaceutical item supplied directly by FujiMedical Hall. Stored under optimal temperature conditions."}
                </p>
              </div>

              {/* Quantity Selector Section */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200" style={{backgroundColor:"#f8fafc"}}>
                  <span className="text-sm font-extrabold" style={{color:"#1e293b"}}>
                    Quantity:
                  </span>
                  <div className="qty-wrapper">
                    <button
                      type="button"
                      className="qty-btn-minus"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn-plus"
                      onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  isDisabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full font-extrabold text-sm shadow-md ${
                    isOutOfStock
                      ? "bg-slate-300 dark:bg-slate-800 text-slate-500"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  <MdShoppingCart className="w-5 h-5 mr-1" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Button
                  size="lg"
                  isDisabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`w-full font-extrabold text-sm shadow-md ${
                    isOutOfStock
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {isOutOfStock ? "Unavailable" : "Buy Now"}
                </Button>
              </div>

              {addedSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center animate-in fade-in">
                  ✓ Item added to cart! Opening cart drawer...
                </div>
              )}

              {/* Instant WhatsApp & Direct Call Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-md"
                  >
                    <FaWhatsapp className="w-5 h-5 mr-1" />
                    Order via WhatsApp
                  </Button>
                </a>

                <a href={`tel:${PHONE_NUMBER}`} className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md"
                  >
                    <MdPhone className="w-5 h-5 mr-1" />
                    Call to Order
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
