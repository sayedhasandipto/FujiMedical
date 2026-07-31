"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Safely load cart from localStorage only after client mounts
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem("fuji_medical_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    }
  }, []);

  // Save cart to localStorage on changes after initial mount
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("fuji_medical_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
      }
    }
  }, [cart, isMounted]);

  const addToCart = (product, quantity = 1) => {
    if (!product || (product.stock !== undefined && product.stock <= 0)) {
      return false;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        const finalQty = product.stock ? Math.min(newQty, product.stock) : newQty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: finalQty,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            _id: product._id,
            name: product.name,
            price: Number(product.price || 0),
            offerPrice: product.offerPrice !== null && product.offerPrice !== undefined ? Number(product.offerPrice) : null,
            image: product.image || "",
            category: product.category || "",
            unit: product.unit || "",
            stock: product.stock,
            quantity: product.stock ? Math.min(quantity, product.stock) : quantity,
          },
        ];
      }
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === productId) {
          const maxQty = item.stock ? Math.min(newQuantity, item.stock) : newQuantity;
          return { ...item, quantity: maxQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Compute live subtotal & count safely
  const subtotal = isMounted
    ? cart.reduce((sum, item) => {
        const itemPrice =
          item.offerPrice !== null && item.offerPrice !== undefined
            ? Number(item.offerPrice)
            : Number(item.price);
        return sum + itemPrice * item.quantity;
      }, 0)
    : 0;

  const totalCount = isMounted
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart: isMounted ? cart : [],
        isMounted,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
