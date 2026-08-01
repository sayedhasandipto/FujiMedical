"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdShield } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/admin/products",
      });

      if (result?.error) {
        setError(result.error.message || "Invalid email or password.");
        setIsLoading(false);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden text-slate-100">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <FaHeartbeat size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">
                ফুজি মেডিকেল হল
              </h1>
              <p className="text-[10px] font-bold text-emerald-500 tracking-wide mt-1">
                বিশ্বস্ত ঔষধ সেবায় ২৭ বছর
              </p>
            </div>
          </Link>
          <div className="text-center mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">
              <MdShield /> Admin Control Center
            </span>
            <h2 className="text-xl font-extrabold mt-2 text-white">
              Authorized Personnel Only
            </h2>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-450 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold text-slate-400">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <MdEmail className="absolute left-3.5 text-slate-500 shrink-0 pointer-events-none" size={18} />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fujimedical.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-slate-100 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold text-slate-400">
                Password
              </label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-3.5 text-slate-500 shrink-0 pointer-events-none" size={18} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 text-slate-100 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer text-xs uppercase tracking-wider"
            >
              {isLoading ? "Verifying Credentials..." : "Authenticate"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-8">
          Unauthorized access is strictly monitored and logged.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
