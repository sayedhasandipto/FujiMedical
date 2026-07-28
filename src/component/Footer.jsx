import React from "react";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <div>
      <footer className="bg-emerald-900 text-white pt-10 pb-20 md:pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-emerald-900 w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                <span className="text-lg font-black leading-none">F</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                ফুজি মেডিকেল হল
              </h2>
            </div>
            <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
              Your trusted healthcare partner for over 27 years. We provide
              genuine medicines, expert consultations, and reliable lab tests
              right at your doorstep.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-emerald-100">
              <li className="flex items-start gap-3">
                <MdLocationOn
                  size={20}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />
                <span>
                  123 Health Avenue, Medical District
                  <br />
                  Dhaka 1200, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone size={20} className="text-emerald-400 shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail size={20} className="text-emerald-400 shrink-0" />
                <span>support@fujimedical.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-emerald-800 text-center text-xs text-emerald-300">
          <p>
            &copy; {new Date().getFullYear()} Fuji Medical Hall. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
