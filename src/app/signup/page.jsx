"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaHeartbeat, FaCheckCircle } from "react-icons/fa";

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordStrength < 2) {
      setError("Please choose a stronger password (at least 8 chars with numbers).");
      return;
    }

    setIsLoading(true);
    console.log("Signing up with:", { name, phone, email, password });

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }, 500);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setError("");
    console.log("Google sign up clicked");
    setTimeout(() => {
      setIsGoogleLoading(false);
    }, 500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl max-w-md w-full text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center animate-bounce">
            <FaCheckCircle className="text-emerald-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Account Created!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Redirecting you to the home page…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <FaHeartbeat size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emerald-900 dark:text-emerald-400 tracking-tight leading-none">
                ফুজি মেডিকেল হল
              </h1>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 tracking-wide mt-1">
                বিশ্বস্ত ঔষধ সেবায় ২৭ বছর
              </p>
            </div>
          </Link>
          <div className="text-center mt-2">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Join Fuji Medical Hall to manage your health needs
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl">
          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer text-sm"
          >
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="shrink-0 mx-3 text-xs text-slate-400 font-medium">
              or sign up with email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl px-4 py-3">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <MdPerson className="absolute left-3.5 text-slate-400 shrink-0 pointer-events-none" size={18} />
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <MdPhone className="absolute left-3.5 text-slate-400 shrink-0 pointer-events-none" size={18} />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <MdEmail className="absolute left-3.5 text-slate-400 shrink-0 pointer-events-none" size={18} />
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-3.5 text-slate-400 shrink-0 pointer-events-none" size={18} />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>

              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength <= 1
                          ? "bg-red-500"
                          : passwordStrength === 2
                          ? "bg-amber-500"
                          : passwordStrength === 3
                          ? "bg-blue-500"
                          : "bg-emerald-600"
                      }`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold shrink-0 ${
                      passwordStrength <= 1
                        ? "text-red-500"
                        : passwordStrength === 2
                        ? "text-amber-500"
                        : passwordStrength === 3
                        ? "text-blue-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-confirm-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <MdLock className="absolute left-3.5 text-slate-400 shrink-0 pointer-events-none" size={18} />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-red-500 text-[11px] font-medium mt-0.5">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 mt-1">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed select-none cursor-pointer">
                I agree to the{" "}
                <a href="#" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                  Terms of Service
                </a>{" "}
                &amp;{" "}
                <a href="#" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login prompt */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Your health data is encrypted &amp; never shared without your consent.
        </p>
      </div>
    </div>
  );
}
