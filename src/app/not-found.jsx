import Link from "next/link";
import { FiAlertCircle, FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Animated Icon Container */}
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full w-48 h-48 mx-auto -z-10" />
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl inline-block">
                        <FiAlertCircle className="w-16 h-16 text-emerald-500 animate-pulse" />
                    </div>
                </div>

                {/* Big 404 Text */}
                <div className="space-y-2">
                    <h1 className="text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-slate-200">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                        আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল লেখা হয়েছে।
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <FiHome className="w-4 h-4" />
                        হোমপেজে যান
                    </Link>
                </div>
            </div>
        </div>
    );
}