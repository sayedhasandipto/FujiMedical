"use client";

import React, { useState, useEffect } from "react";
import { 
  MdMedicalServices, 
  MdShoppingCart, 
  MdSearch, 
  MdMic, 
  MdClose, 
  MdArrowForward, 
  MdVerified, 
  MdLocalShipping, 
  MdSupportAgent, 
  MdDeviceThermostat, 
  MdAir, 
  MdMedication, 
  MdCleanHands, 
  MdVisibility, 
  MdMedicalInformation, 
  MdBloodtype, 
  MdChildCare, 
  MdFemale, 
  MdHome, 
  MdReceiptLong, 
  MdGridView, 
  MdMail, 
  MdMenu 
} from "react-icons/md";
import { 
  FaStore, 
  FaFlask, 
  FaStethoscope, 
  FaCommentMedical, 
  FaUserInjured, 
  FaHeartbeat, 
  FaHeart, 
  FaPills,
  FaFileMedical
} from "react-icons/fa";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [activeService, setActiveService] = useState("Store");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const carouselSlides = [
    {
      title: "Safe & Reliable Home Lab Tests",
      desc: "Sample collection at your doorstep. Reports in 24 hours.",
      bg: "linear-gradient(135deg, #00875A 0%, #004d34 100%)",
      btnText: "Book Now",
      action: () => setIsBookModalOpen(true),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8YeXq691WKPk6-VbeWUYdbIzMtMXHoQ3u5bOfy2z754uJlW2eQpHnqPMnwAGgZjDFiottu72OTdMLrEGhcKmihKxsENhWDBNQOYTWJ-w6vq45RkiBkk0Gj-pWvbAsoTcu1x3x85KlYvPa41sAL15CJb2V95lNyXdx45KJvydXLHMidOaev5ligu0ofyX1cG95RRBTvoTaJ5z2spaPgW6UUB8RtpQ5OmaAavvlhBJ257fOyepBn0QMSXdzsekmdKm0gdU9IPwzGGeQ"
    },
    {
      title: "Wholesale Medicines at Best Prices",
      desc: "Get genuine prescription drugs and OTC medicines in bulk.",
      bg: "linear-gradient(135deg, #00644a 0%, #003322 100%)",
      btnText: "Browse Store",
      action: () => setActiveService("Store"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8YeXq691WKPk6-VbeWUYdbIzMtMXHoQ3u5bOfy2z754uJlW2eQpHnqPMnwAGgZjDFiottu72OTdMLrEGhcKmihKxsENhWDBNQOYTWJ-w6vq45RkiBkk0Gj-pWvbAsoTcu1x3x85KlYvPa41sAL15CJb2V95lNyXdx45KJvydXLHMidOaev5ligu0ofyX1cG95RRBTvoTaJ5z2spaPgW6UUB8RtpQ5OmaAavvlhBJ257fOyepBn0QMSXdzsekmdKm0gdU9IPwzGGeQ"
    },
    {
      title: "Instant Video Consultation",
      desc: "Connect with certified medical practitioners online within 10 minutes.",
      bg: "linear-gradient(135deg, #00a86b 0%, #005a36 100%)",
      btnText: "Consult Now",
      action: () => setActiveService("Consult"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8YeXq691WKPk6-VbeWUYdbIzMtMXHoQ3u5bOfy2z754uJlW2eQpHnqPMnwAGgZjDFiottu72OTdMLrEGhcKmihKxsENhWDBNQOYTWJ-w6vq45RkiBkk0Gj-pWvbAsoTcu1x3x85KlYvPa41sAL15CJb2V95lNyXdx45KJvydXLHMidOaev5ligu0ofyX1cG95RRBTvoTaJ5z2spaPgW6UUB8RtpQ5OmaAavvlhBJ257fOyepBn0QMSXdzsekmdKm0gdU9IPwzGGeQ"
    }
  ];

  // Auto-play carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const categories = [
    { id: "fever", name: "Fever", bnName: "জ্বর", icon: <MdDeviceThermostat className="w-10 h-10" /> },
    { id: "cold", name: "Cold & Cough", bnName: "ঠান্ডা ও কাশি", icon: <MdAir className="w-10 h-10" /> },
    { id: "gastric", name: "Gastric", bnName: "গ্যাস্ট্রিক", icon: <MdMedication className="w-10 h-10" /> },
    { id: "pain", name: "Pain Relief", bnName: "ব্যথা নাশক", icon: <FaUserInjured className="w-10 h-10" /> },
    { id: "skin", name: "Skin Care", bnName: "চর্মরোগ", icon: <MdCleanHands className="w-10 h-10" /> },
    { id: "eye-ear", name: "Eye & Ear", bnName: "চোখ ও কান", icon: <MdVisibility className="w-10 h-10" /> },
    { id: "vitamin", name: "Vitamin", bnName: "ভিটামিন", icon: <FaPills className="w-10 h-10" /> },
    { id: "first-aid", name: "First Aid", bnName: "প্রাথমিক চিকিৎসা", icon: <FaFileMedical className="w-10 h-10" /> },
    { id: "diabetes", name: "Diabetes", bnName: "ডায়াবেটিস", icon: <MdBloodtype className="w-10 h-10" /> },
    { id: "heart", name: "Heart", bnName: "হৃদরোগ", icon: <FaHeartbeat className="w-10 h-10" /> },
    { id: "baby", name: "Baby Care", bnName: "শিশুর যত্ন", icon: <MdChildCare className="w-10 h-10" /> },
    { id: "women", name: "Women's Health", bnName: "নারীদের স্বাস্থ্য", icon: <MdFemale className="w-10 h-10" /> }
  ];

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.bnName.includes(searchQuery)
  );

  const quickNav = [
    { name: "Store", icon: <FaStore className="w-7 h-7" /> },
    { name: "Lab", icon: <FaFlask className="w-7 h-7" /> },
    { name: "Doctor", icon: <FaStethoscope className="w-7 h-7" /> },
    { name: "Consult", icon: <FaCommentMedical className="w-7 h-7" /> }
  ];

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setIsBookModalOpen(false);
    alert("Booking requested successfully! We will contact you shortly.");
  };

  return (
    <div className="flex-1 flex flex-col pb-24 bg-white dark:bg-zinc-950 min-h-screen text-zinc-800 dark:text-zinc-100">
      {/* Top App Bar */}
      <header className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md w-full top-0 sticky z-40 border-b border-emerald-100 dark:border-zinc-800 flex items-center justify-between px-6 py-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
            <MdMedicalServices size={30} />
          </div>
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl text-emerald-800 dark:text-emerald-400 font-bold tracking-tight">
              Fuji Medical Hall
            </h1>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold tracking-wider uppercase">
              Wholesale Pharmacy & Clinic
            </p>
          </div>
          <span className="bg-emerald-600 text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ml-2 tracking-wider shadow-sm animate-pulse">
            Wholesale
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCartCount(cartCount + 1)}
            className="btn btn-ghost btn-circle relative hover:bg-emerald-50 dark:hover:bg-emerald-950/30 group transition-all duration-300 text-emerald-800 dark:text-emerald-400"
          >
            <div className="indicator">
              <MdShoppingCart size={26} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="badge badge-sm badge-error indicator-item font-bold text-white scale-110">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </header>

      <main className="max-w-container-max mx-auto w-full px-4 md:px-8">
        {/* Search Section */}
        <section className="pt-6">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-500">
              <MdSearch size={22} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all shadow-sm hover:shadow-md text-zinc-800 dark:text-zinc-100 font-body-md text-base"
              placeholder="Search medicines, categories, or services..."
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-12 flex items-center pr-3 text-zinc-400 hover:text-emerald-600"
              >
                <MdClose size={20} />
              </button>
            )}
            <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors">
              <MdMic size={22} />
            </div>
          </div>
        </section>

        {/* Quick Service Navigation */}
        <nav className="flex justify-center py-8 overflow-x-auto hide-scrollbar gap-6 md:gap-12">
          {quickNav.map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveService(item.name)}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
            >
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md ${
                  activeService === item.name
                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                    : "bg-emerald-50 dark:bg-zinc-900 text-emerald-800 dark:text-emerald-400 group-hover:bg-emerald-100/50 dark:group-hover:bg-zinc-800"
                }`}
              >
                <div className="transition-transform duration-300 group-hover:rotate-6">
                  {item.icon}
                </div>
              </div>
              <span className={`font-label-md text-sm font-semibold transition-colors duration-300 ${
                activeService === item.name ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-zinc-600 dark:text-zinc-400"
              }`}>
                {item.name}
              </span>
            </div>
          ))}
        </nav>

        {/* Hero Carousel Section */}
        <section className="relative overflow-hidden rounded-3xl h-56 md:h-80 shadow-lg group border border-emerald-50 dark:border-zinc-800">
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${carouselSlides.length * 100}%`
            }}
          >
            {carouselSlides.map((slide, idx) => (
              <div 
                key={idx}
                className="w-full h-full relative flex items-center p-8 md:p-12 overflow-hidden select-none"
                style={{ 
                  background: slide.bg,
                  width: `${100 / carouselSlides.length}%`
                }}
              >
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>

                <div className="z-10 text-white max-w-[65%] md:max-w-[55%] flex flex-col items-start gap-3">
                  <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                    Featured Service
                  </span>
                  <h2 className="font-headline-lg text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                    {slide.title}
                  </h2>
                  <p className="font-body-md text-sm md:text-base opacity-90 leading-relaxed max-w-md hidden sm:block">
                    {slide.desc}
                  </p>
                  <button 
                    onClick={slide.action}
                    className="mt-2 bg-white text-emerald-800 hover:bg-emerald-50 hover:scale-105 active:scale-95 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-2 group-hover:translate-x-1"
                  >
                    <span>{slide.btnText}</span>
                    <MdArrowForward size={16} />
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-[90%] h-[90%] md:h-[95%] object-contain object-right-bottom transition-all duration-700"
                    alt={slide.title}
                    src={slide.image}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 grid grid-cols-3 gap-3 md:gap-6 text-center">
          <div className="bg-emerald-50/40 dark:bg-zinc-900 p-4 md:p-6 rounded-2xl border border-emerald-100/50 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="text-emerald-700 dark:text-emerald-400 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
              <MdVerified size={32} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm md:text-lg text-emerald-900 dark:text-emerald-300">100% Genuine</p>
              <p className="text-[10px] md:text-xs text-zinc-500">Quality Medicines</p>
            </div>
          </div>
          <div className="bg-emerald-50/40 dark:bg-zinc-900 p-4 md:p-6 rounded-2xl border border-emerald-100/50 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="text-emerald-700 dark:text-emerald-400 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
              <MdLocalShipping size={32} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm md:text-lg text-emerald-900 dark:text-emerald-300">Fast Delivery</p>
              <p className="text-[10px] md:text-xs text-zinc-500">To your doorstep</p>
            </div>
          </div>
          <div className="bg-emerald-50/40 dark:bg-zinc-900 p-4 md:p-6 rounded-2xl border border-emerald-100/50 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="text-emerald-700 dark:text-emerald-400 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
              <MdSupportAgent size={32} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm md:text-lg text-emerald-900 dark:text-emerald-300">Expert Help</p>
              <p className="text-[10px] md:text-xs text-zinc-500">Certified Doctors</p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-2xl text-zinc-800 dark:text-zinc-100 font-bold">
                All You Need
              </h3>
              <p className="text-xs text-zinc-500">Browse medicines by categories</p>
            </div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="btn btn-ghost btn-sm text-emerald-700 hover:bg-emerald-50 font-bold"
            >
              View All
            </button>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-emerald-50/20 dark:bg-zinc-900 rounded-3xl border border-dashed border-emerald-200 dark:border-zinc-800">
              <p className="font-bold text-zinc-500">No categories match your search</p>
              <button onClick={() => setSearchQuery("")} className="btn btn-link text-emerald-700 mt-2">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex flex-col items-center text-center gap-2 cursor-pointer group transition-all duration-300 ${
                    selectedCategory?.id === cat.id ? "scale-105" : ""
                  }`}
                >
                  <div 
                    className={`aspect-square w-full rounded-2xl p-4 flex items-center justify-center transition-all duration-300 border shadow-sm group-hover:-translate-y-1.5 ${
                      selectedCategory?.id === cat.id
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/20 scale-105"
                        : "bg-white dark:bg-zinc-900 border-emerald-100/60 group-hover:bg-emerald-50 group-hover:border-emerald-600 group-hover:text-emerald-700 dark:border-zinc-800"
                    }`}
                  >
                    <div className="transition-all duration-300 group-hover:scale-110">
                      {cat.icon}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-label-md text-sm font-semibold transition-colors duration-300 ${
                      selectedCategory?.id === cat.id ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-700"
                    }`}>
                      {cat.name}
                    </span>
                    <span className="text-caption text-xs text-zinc-400 mt-0.5">
                      ({cat.bnName})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Selected Category Details/Products Area */}
        {selectedCategory && (
          <section className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-emerald-100/60 dark:border-zinc-800 shadow-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-zinc-800 p-2.5 rounded-xl">
                  {selectedCategory.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-emerald-900 dark:text-emerald-300">{selectedCategory.name} Products</h4>
                  <p className="text-xs text-zinc-500">Recommended items under {selectedCategory.name} ({selectedCategory.bnName})</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-emerald-50/50 dark:border-zinc-800 flex items-center justify-between hover:shadow-sm hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                      Rx
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Medicine {selectedCategory.name} {item}00mg</p>
                      <p className="text-xs text-zinc-500">Pack of 10 | Wholesale rate</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">৳{(item * 45).toFixed(2)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCartCount(cartCount + 1)}
                    className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700 border-none rounded-xl"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Book Lab Test Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp border border-emerald-50/50 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <FaFlask className="text-emerald-600" />
                Book a Home Lab Test
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                <MdClose size={20} />
              </button>
            </div>
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="label text-xs font-bold text-zinc-500">Full Name</label>
                <input required type="text" className="input input-bordered w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-emerald-100 dark:border-zinc-700" placeholder="Enter your name" />
              </div>
              <div>
                <label className="label text-xs font-bold text-zinc-500">Phone Number</label>
                <input required type="tel" className="input input-bordered w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-emerald-100 dark:border-zinc-700" placeholder="Enter phone number" />
              </div>
              <div>
                <label className="label text-xs font-bold text-zinc-500">Select Test Package</label>
                <select className="select select-bordered w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-emerald-100 dark:border-zinc-700">
                  <option>Complete Blood Count (CBC)</option>
                  <option>Diabetes Screening (HbA1c)</option>
                  <option>Lipid Profile (Cholesterol)</option>
                  <option>Kidney / Liver Function Test</option>
                  <option>Full Body Checkup (Premium)</option>
                </select>
              </div>
              <button type="submit" className="btn bg-emerald-600 text-white hover:bg-emerald-700 border-none w-full rounded-xl mt-2">
                Confirm Booking Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-emerald-50 dark:border-zinc-900 shadow-lg z-50 rounded-t-2xl">
        {[
          { name: "home", label: "Home", icon: <MdHome size={24} /> },
          { name: "orders", label: "Orders", icon: <MdReceiptLong size={24} /> },
          { name: "categories", label: "Categories", icon: <MdGridView size={24} /> },
          { name: "inbox", label: "Inbox", icon: <MdMail size={24} /> },
          { name: "more", label: "More", icon: <MdMenu size={24} /> }
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              if (tab.name === "categories") {
                const element = document.getElementById("categories-section");
                element?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 min-w-[64px] ${
              activeTab === tab.name
                ? "bg-emerald-600 text-white scale-105 shadow-md shadow-emerald-600/20"
                : "text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-900"
            }`}
          >
            {tab.icon}
            <span className="font-label-md text-[10px] font-semibold mt-0.5">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
