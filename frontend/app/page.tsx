"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-center p-8">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
        Reverse Auction Platform
      </h1>
      <p className="text-gray-700 max-w-xl mb-8">
        Welcome to the live Reverse Auction Platform where buyers can host auctions and suppliers can compete in real time.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow transition"
        >
          Signup
        </Link>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        Powered by NeonDB · Built with Next.js + Express + Socket.IO
      </footer>
    </main>
  );
}
