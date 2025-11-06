"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface Auction {
  id: number;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
}

export default function SupplierDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [activeRanks, setActiveRanks] = useState<{ [key: string]: number }>({});
  const socketRef = useRef<Socket | null>(null);

  // ✅ Initialize Socket and fetch auctions
  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    // Listen for ranking updates
    socket.on("ranking:update", (data) => {
      setActiveRanks(data.ranks);
    });

    // ✅ Listen for new auction broadcasts
    socket.on("auction:new", (auction: Auction) => {
      console.log("📢 New auction received:", auction.title);
      setAuctions((prev) => [auction, ...prev]);
    });

    // Fetch initial auctions from backend
    axios
      .get("/api/auctions")
      .then((res) => setAuctions(res.data))
      .catch((err) => console.error("Error loading auctions:", err));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Supplier Dashboard
          </h1>
          <button
            onClick={() => (window.location.href = "/logout")}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </header>

        {auctions.length === 0 ? (
          <p className="text-gray-500 text-center mt-12">
            No active auctions available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {auction.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  {auction.description || "No description provided."}
                </p>
                <p className="text-sm text-gray-500">
                  🕒 Starts:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(auction.startsAt).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ⏰ Ends:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(auction.endsAt).toLocaleString()}
                  </span>
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Your Rank:{" "}
                    <span className="font-semibold text-blue-700">
                      {activeRanks[auction.id] || "-"}
                    </span>
                  </span>
                  <button
                    onClick={() =>
                      alert(`Place bid for auction ID: ${auction.id}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
