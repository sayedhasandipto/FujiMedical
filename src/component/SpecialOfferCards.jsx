"use client";

import React from "react";

/* ─── Card Definitions (Aroggo Exact Structure) ──────────────── */
const CARDS = [
  {
    id: "whatsapp",
    gradient: "linear-gradient(160deg, #d8fcdb 0%, #83e895 45%, #34b553 100%)",
    iconBg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    topLabel: "Order",
    title: "Via WhatsApp",
    subtitle: "01826637443",
    btnText: "Call Now",
    btnColor: "#25D366",
    href: "https://wa.me/8801826637443",
  },
  {
    id: "prescription",
    gradient: "linear-gradient(160deg, #d2f6f9 0%, #63d4e2 45%, #00a4b8 100%)",
    iconBg: "#00acc1",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="9" y1="13" x2="15" y2="13"></line>
        <line x1="9" y1="17" x2="13" y2="17"></line>
      </svg>
    ),
    topLabel: "UPTO",
    title: "10% OFF",
    subtitle: "+ Cashback",
    btnText: "Upload Prescription",
    btnColor: "#00acc1",
    href: "#upload",
  },
  {
    id: "store",
    gradient: "linear-gradient(160deg, #edf6b9 0%, #aee332 45%, #73a800 100%)",
    iconBg: "#82be00",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    topLabel: "UPTO",
    title: "14% OFF",
    subtitle: "+ Cashback",
    btnText: "Shop Now",
    btnColor: "#73a800",
    href: "#products",
  },
  {
    id: "call",
    gradient: "linear-gradient(160deg, #ffe5d3 0%, #ffa566 45%, #e65100 100%)",
    iconBg: "#f37021",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
    topLabel: "UPTO",
    title: "10% OFF",
    subtitle: "16770",
    btnText: "Call",
    btnColor: "#f37021",
    href: "tel:16770",
  },
];

/* ─── Single Offer Card ──────────────────────────────────────── */
function OfferCard({ card }) {
  const handleClick = () => {
    if (card.href.startsWith("#")) {
      const el = document.getElementById(card.href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(card.href, card.href.startsWith("tel") ? "_self" : "_blank");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative shrink-0 w-[calc(50%-6px)] sm:w-[200px] h-[155px] sm:h-[195px] flex flex-col justify-between rounded-[20px] sm:rounded-[26px] p-3 sm:p-4 overflow-hidden cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1 shadow-sm"
      style={{ background: card.gradient }}
    >
      {/* Aroggo Curved Icon Arc Background */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-bl-[40px] sm:rounded-bl-[50px] flex items-center justify-center pl-2 pb-2 sm:pl-3 sm:pb-3">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: card.iconBg }}
        >
          <div className="scale-75 sm:scale-100 flex items-center justify-center">
            {card.icon}
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="relative z-10 pt-1 pr-10 sm:pr-12">
        <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-black/70 mb-0.5 sm:mb-1">
          {card.topLabel}
        </p>
        <h3 className="text-[15px] sm:text-[20px] font-black text-slate-900 leading-tight">
          {card.title}
        </h3>
        <p className="text-[10px] sm:text-[13px] font-semibold text-slate-800 mt-0.5 sm:mt-1">
          {card.subtitle}
        </p>
      </div>

      {/* Bottom Button */}
      <div className="relative z-10 w-full mt-1 sm:mt-2">
        <button
          className="w-full py-1.5 sm:py-2.5 px-2 bg-white rounded-lg sm:rounded-xl text-[10px] sm:text-[13px] font-extrabold shadow-sm transition-transform active:scale-95 truncate"
          style={{ color: card.btnColor }}
        >
          {card.btnText}
        </button>
      </div>
    </div>
  );
}

/* ─── Exported Section ───────────────────────────────────────── */
export default function SpecialOfferCards() {
  return (
    <section aria-label="Especially For You" className="py-6 w-full">
      {/* Header Title */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Especially For You
        </h2>
      </div>

      {/* Responsive Container */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pb-4 pt-1 px-4">
        {CARDS.map((card) => (
          <OfferCard key={card.id} card={card} />
        ))}
      </div>

      {/* Clean Utility Style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
