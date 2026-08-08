import React from "react";
import { MdEmail, MdLocationOn, MdPhone, MdAccessTime } from "react-icons/md";
import Link from "next/link";
import { FaHandHoldingMedical } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      {/* Google Map Section */}
      <div className="w-full bg-emerald-950">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
          <h3 className="text-white font-extrabold text-lg mb-3 flex items-center gap-2">
            <MdLocationOn className="text-emerald-400 text-2xl" />
            Find Us on the Map
          </h3>
          <div
            className="w-full rounded-2xl overflow-hidden border-2 border-emerald-800/60 shadow-xl"
            style={{ height: "280px" }}
          >
            <iframe
              title="Fuji Medical Hall Location"
              className="gmap-frame"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d451.3248710381068!2d89.86973883075828!3d25.183015599510767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fd65de09ae8b87%3A0x14ac05d5cd3064b2!2sFuzi%20Medical%20Hall!5e0!3m2!1sen!2ssg!4v1785944861129!5m2!1sen!2ssg"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-emerald-400/70 text-xs mt-2 text-center">
            ফুজি মেডিকেল হল — বাসস্টেন্ড মোড়, বকশীগঞ্জ, জামালপুর
          </p>
        </div>
      </div>

      <footer className="bg-emerald-900 text-white pt-10 pb-20 md:pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-emerald-900 w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                <FaHandHoldingMedical className="text-lg md:text-xl" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                ফুজি মেডিকেল হল
              </h2>
            </div>
            <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
              বিশ্বস্ত ঔষধ সেবায় ২৭ বছর। আমরা সরবরাহ করি খাঁটি ওষুধ, বিশেষজ্ঞ
              পরামর্শ এবং হোম ডেলিভারি সেবা।
            </p>
            <div className="flex items-center gap-2 text-sm text-emerald-200">
              <MdAccessTime className="text-emerald-400 shrink-0" />
              <span>শনি–বৃহঃ: সকাল ৮টা – রাত ১০টা</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2 inline-block">
              যোগাযোগ করুন
            </h3>
            <ul className="space-y-3 text-sm text-emerald-100">
              <li className="flex items-start gap-3">
                <MdLocationOn
                  size={20}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />
                <span>
                  ফুজি মেডিকেল হল,
                  <br />
                  বাসস্টেন্ড মোড়, বকশীগঞ্জ, জামালপুর
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone size={20} className="text-emerald-400 shrink-0" />
                <a
                  href="tel:+8801826637443"
                  className="hover:text-white transition"
                >
                  +8801826637443
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail size={20} className="text-emerald-400 shrink-0" />
                <a
                  href="mailto:fujimedicalhall@gmail.com"
                  className="hover:text-white transition"
                >
                  fujimedicalhall@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  My Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-emerald-800 text-center text-xs text-emerald-300">
          <p>
            &copy; {new Date().getFullYear()} ফুজি মেডিকেল হল। সর্বস্বত্ব
            সংরক্ষিত।
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
