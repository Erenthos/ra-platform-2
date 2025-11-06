"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Auth } from "../lib/auth";

export default function DashboardLayout({
  role,
  children,
}: {
  role: "buyer" | "supplier";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLogout = () => {
    Auth.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-6">RA Dashboard</h2>

        <nav className="flex flex-col space-y-2 flex-grow">
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

        {/* Footer */}
        <div className="mt-auto border-t border-blue-500 pt-4 text-sm text-gray-200">
          <div className="flex flex-col space-y-2">
            <span>Role: {role}</span>
            <button
              onClick={handleLogout}
              className="w-full py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
