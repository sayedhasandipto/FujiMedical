"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MdArrowForward, MdStar, MdShoppingBag } from "react-icons/md";

const SLIDES = [
  {
    badge: "🧪 Home Collection",
    tag: "FREE HOME VISIT",
    title: "Safe & Reliable\nHome Lab Tests",
    desc: "Sample collection at your doorstep. Certified reports in 24 hours.",
    accentFrom: "#064e3b",
    accentTo: "#065f46",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1200&auto=format&fit=crop&q=85",
  },
  {
    badge: "💊 Wholesale Prices",
    tag: "UP TO 40% OFF",
    title: "Genuine Medicines\nat Best Prices",
    desc: "Prescription drugs and OTC medicines from verified manufacturers.",
    accentFrom: "#134e4a",
    accentTo: "#0f766e",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&auto=format&fit=crop&q=85",
  },
  {
    badge: "🩺 Online Consult",
    tag: "AVAILABLE 24/7",
    title: "Instant Video\nConsultation",
    desc: "Connect with certified medical practitioners within 10 minutes.",
    accentFrom: "#052e16",
    accentTo: "#14532d",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=85",
  },
];

function BannerBg({ src }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => { setImgSrc(src); }, [src]);
  return (
    <Image
      src={imgSrc}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
      onError={() => setImgSrc(SLIDES[0].image)}
    />
  );
}

export default function HeroBanner() {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const browseProducts = () => {
    const el = document.getElementById("products-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-label="Featured services carousel"
      className="relative w-full mt-6 md:mt-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl"
      style={{ height: "clamp(200px, 45vw, 380px)" }}
    >
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          aria-hidden={idx !== cur}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === cur ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          {/* Full-bleed background photo */}
          <BannerBg src={slide.image} />

          {/* Dark base wash */}
          <div className="absolute inset-0 bg-black/25 z-10" />

          {/* Left-heavy brand gradient */}
          <div
            className="absolute inset-0 z-10"
            style={{ background: `linear-gradient(100deg, ${slide.accentFrom}F2 0%, ${slide.accentTo}D0 35%, ${slide.accentTo}70 55%, transparent 100%)` }}
          />

          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent z-10" />

          {/* Text content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 md:px-14 max-w-[90%] sm:max-w-[65%] md:max-w-[55%]">

            {/* Badge */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs text-white/90">{slide.badge}</span>
              <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black rounded-full bg-white/20 text-emerald-100 border border-white/25 uppercase tracking-widest">
                {slide.tag}
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-black text-white leading-[1.2] drop-shadow-md" style={{ fontSize: "clamp(1.1rem, 4.5vw, 2.5rem)" }}>
              {slide.title.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>

            {/* Subtitle — hidden on mobile to save space */}
            <p className="hidden sm:block mt-1.5 sm:mt-2 text-[11px] sm:text-sm text-white/80 leading-relaxed font-medium line-clamp-2 max-w-[30ch] sm:max-w-sm">
              {slide.desc}
            </p>

            {/* CTA button */}
            <button
              onClick={browseProducts}
              className="mt-3 sm:mt-4 w-fit flex items-center gap-1.5 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 pl-4 pr-3 py-2 sm:pl-5 sm:pr-4 sm:py-2.5 rounded-full font-extrabold text-[11px] sm:text-sm transition-all duration-200 shadow-lg shadow-black/25"
            >
              <MdShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Browse Products</span>
              <MdArrowForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>

            {/* Star rating — desktop only */}
            <div className="hidden md:flex items-center gap-1 mt-3 text-white/70">
              {[...Array(5)].map((_, i) => (
                <MdStar key={i} className="w-3 h-3 text-amber-400" />
              ))}
              <span className="text-[10px] font-semibold ml-1">4.9 · 12,000+ customers</span>
            </div>
          </div>
        </div>
      ))}

      {/* Dot navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCur(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer border border-white/30 ${cur === idx ? "w-6 h-2 bg-white shadow" : "w-2 h-2 bg-white/35 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-3 right-4 z-30 text-white/40 text-[9px] sm:text-[10px] font-bold tracking-widest">
        {String(cur + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
