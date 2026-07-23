"use client";

import React, { useState } from "react";
import { MdEmail, MdLock, MdPerson, MdArrowBack, MdVerifiedUser } from "react-icons/md";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Placeholder for BetterAuth submission
    alert(`${isLogin ? "Login" : "Sign Up"} requested! (Connect BetterAuth & MongoDB here later)`);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-emerald-250 via-emerald-50 to-white bg-fixed px-4 py-12 dark:from-emerald-950/60 dark:via-zinc-950 dark:to-zinc-950 text-zinc-800 dark:text-zinc-100">
      {/* Back Button */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 hover:text-emerald-600 transition-colors font-bold text-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm px-3.5 py-1.5 rounded-xl shadow-sm border border-emerald-100/50 dark:border-zinc-800/50"
      >
        <MdArrowBack size={18} />
        <span>Back to Home</span>
      </a>

      <div className="w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-100/40 dark:border-zinc-800 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-600/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-emerald-650/10 rounded-full blur-xl"></div>

        {/* Brand Header */}
        <div className="text-center mb-6 z-10 relative">
          <div className="inline-flex bg-emerald-600 text-white w-12 h-12 rounded-2xl items-center justify-center font-bold shadow-md shadow-emerald-600/20 mb-3">
            <MdVerifiedUser size={26} />
          </div>
          <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
            {isLogin ? "Log in to purchase medicines & view tests" : "Join Fuji Medical for personalized pharmacy care"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              isLogin
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-500 hover:text-emerald-700 dark:text-zinc-400"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              !isLogin
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-500 hover:text-emerald-700 dark:text-zinc-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="form-control">
              <label className="label text-[10px] font-bold text-zinc-500 tracking-wide uppercase py-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-emerald-600 pointer-events-none">
                  <MdPerson size={18} />
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-emerald-100 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label text-[10px] font-bold text-zinc-500 tracking-wide uppercase py-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-emerald-600 pointer-events-none">
                <MdEmail size={18} />
              </span>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@fuji.com"
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-emerald-100 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label text-[10px] font-bold text-zinc-500 tracking-wide uppercase py-1 flex justify-between">
              <span>Password</span>
              {isLogin && (
                <a href="#" className="text-emerald-700 dark:text-emerald-450 hover:underline">
                  Forgot?
                </a>
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-emerald-600 pointer-events-none">
                <MdLock size={18} />
              </span>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-emerald-100 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-control">
              <label className="label text-[10px] font-bold text-zinc-500 tracking-wide uppercase py-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-emerald-600 pointer-events-none">
                  <MdLock size={18} />
                </span>
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-emerald-100 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl mt-4 py-2.5 font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>

        {/* Social Authentication Placeholders */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => alert("Google Auth placeholder activated.")}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-semibold"
          >
            <FaGoogle className="text-red-500" />
            <span>Google</span>
          </button>
          <button
            onClick={() => alert("Github Auth placeholder activated.")}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-semibold"
          >
            <FaGithub />
            <span>Github</span>
          </button>
        </div>
      </div>
    </div>
  );
}
