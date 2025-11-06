"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  role,
  children,
}: {
  role: "buyer" | "supplier";
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems =
    role === "buyer"
      ? [
          { name: "My Auctions", href: "/buyer" },
          { name: "Create Auction", href: "#" },
        ]
      : [
          { name: "Live Auctions", href: "/supplier" },
          { name: "My Bids", href: "#" },
        ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-6">RA Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`p-2 rounded-md ${
                pathname === item.href
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-blue-500 pt-4 text-sm text-gray-200">
          Role: {role}
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

