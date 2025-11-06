import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Reverse Auction Platform",
  description: "Live reverse auction between suppliers and buyers",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <header className="p-4 bg-blue-600 text-white text-xl font-semibold">
          Reverse Auction Platform
        </header>
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}

