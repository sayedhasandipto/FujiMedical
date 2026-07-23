import "./globals.css";

export const metadata = {
  title: "Fuji Medical Hall - Home",
  description: "Your safe and reliable healthcare partner. Book home lab tests and purchase wholesale medicines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body
        className="min-h-full flex flex-col bg-background text-on-background"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
