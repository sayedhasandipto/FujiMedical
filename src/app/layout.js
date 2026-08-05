import Navbar from "@/component/Navbar";
import "./globals.css";
import Footer from "@/component/Footer";
import { CartProvider } from "@/context/CartContext";
import BottomNav from "@/component/BottomNav";

export const metadata = {
  title: "Fuji Medical Hall - Home",
  description:
    "Your safe and reliable healthcare partner. Book home lab tests and purchase wholesale medicines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-gradient-to-b from-emerald-200 via-emerald-50 to-white bg-fixed dark:from-emerald-950/60 dark:via-zinc-950 dark:to-zinc-950 text-zinc-800 dark:text-zinc-100 pb-20 md:pb-0"
        suppressHydrationWarning={true}
      >
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
