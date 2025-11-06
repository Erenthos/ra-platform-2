"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Auction {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
}

interface Rank {
  supplierId: string;
  rank: number;
}

export default function SupplierPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bids, setBids] = useState<{ [key: string]: number }>({});
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  // ✅ Fetch live auctions from backend
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get("/api/auctions");
        setAuctions(res.data);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
      }
    };

    fetchAuctions();
  }, []);

  // ✅ Setup socket for live rank updates
  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on("ranking:update", (data: { ranks: Rank[] }) => {
      setRanks(data.ranks);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ✅ Handle supplier input (for testing/demo, can be pre-filled)
  useEffect(() => {
    // Generate a mock supplier ID if not logged in (demo mode)
    if (!supplierId) {
      const randomId = "supplier-" + Math.floor(Math.random() * 1000);
      setSupplierId(randomId);
    }
  }, [supplierId]);

  // ✅ Submit bid to backend
  const handleBidSubmit = async (auctionId: string) => {
    try {
      const bidValue = bids[auctionId];
      if (!bidValue) return alert("Please enter a bid amount first!");

      await axios.post(`/api/bids/${auctionId}`, {
        supplierId,
        items: [{ itemId: auctionId, rate: bidValue }], // simplified example
      });

      alert(`Bid submitted for auction ${auctionId}!`);
    } catch (err) {
      console.error("Failed to submit bid:", err);
      alert("Failed to submit bid.");
    }
  };

  // ✅ Find this supplier's rank (if available)
  const getMyRank = () => {
    const my = ranks.find((r) => r.supplierId === supplierId);
    return my ? `L${my.rank}` : "—";
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          Live Auctions for Suppliers
        </h1>

        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">Your Supplier ID:</span>{" "}
          <span className="text-gray-800">{supplierId}</span>
        </div>

        {auctions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No active auctions at the moment.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border border-gray-200 px-4 py-2">Title</th>
                <th className="border border-gray-200 px-4 py-2">Description</th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Your Bid (Total)
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Submit
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Your Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 font-semibold">
                    {auction.title}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {auction.description ?? "—"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-28 text-center"
                      placeholder="Enter ₹"
                      value={bids[auction.id] || ""}
                      onChange={(e) =>
                        setBids({ ...bids, [auction.id]: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => handleBidSubmit(auction.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition"
                    >
                      Submit
                    </button>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center font-semibold text-green-700">
                    {getMyRank()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
