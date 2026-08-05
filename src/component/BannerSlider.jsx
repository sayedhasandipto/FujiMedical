"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MdArrowForward } from "react-icons/md";

export default function BannerSlider({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured services banner"
      className="relative overflow-hidden rounded-3xl h-[280px] sm:h-[320px] md:h-[380px] mt-8 group border border-emerald-100/30 dark:border-zinc-800/80 shadow-lg"
    >
      {/* Slider Track */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}: ${slide.title}`}
            className={`w-full h-full relative flex items-center shrink-0 min-w-full overflow-hidden ${slide.bgClass || "bg-gradient-to-r from-emerald-800 to-teal-700"}`}
          >
            {/* Dark/Gradient Overlay for Mobile Background Layer */}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 z-0 pointer-events-none" />

            {/* Two-Column Responsive Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center w-full h-full px-6 sm:px-12 md:px-16 gap-6">
              
              {/* Left Column: Text Content */}
              <div className="flex flex-col items-start text-left space-y-3 sm:space-y-4 max-w-lg md:max-w-none">
                <span className="px-3.5 py-1 text-[9px] sm:text-xs font-black rounded-full bg-white/20 text-white backdrop-blur-md inline-block uppercase tracking-wider">
                  Featured Service
                </span>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-sm">
                  {slide.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium line-clamp-2 max-w-sm sm:max-w-md">
                  {slide.desc}
                </p>
                
                <button
                  onClick={slide.action}
                  className="mt-2 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{slide.btnText}</span>
                  <MdArrowForward className="w-4 h-4" />
                </button>
              </div>

              {/* Right Column: Hero Image Container */}
              <div className="hidden md:flex justify-end items-center h-full relative pr-4">
                <div className="w-[300px] h-[220px] lg:w-[400px] lg:h-[280px] relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain object-right-bottom drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

            {/* Subtle Mobile/Tablet Background Image Overlay */}
            <div className="md:hidden absolute right-0 bottom-0 w-[45%] h-[60%] opacity-30 z-0 pointer-events-none">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-contain object-right-bottom"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Indicators (Dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx
                ? "w-6 bg-white shadow-xs"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
