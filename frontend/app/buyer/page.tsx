"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Rank {
  supplierId: string;
  rank: number;
}

export default function BuyerPage() {
  const [activeRanks, setActiveRanks] = useState<Rank[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // ✅ Connect to Socket.IO once
  useEffect(() => {
    // Automatically connects to same origin (Render unified deployment)
    socketRef.current = io();

    // Listen for ranking updates
    socketRef.current.on("ranking:update", (data: { ranks: Rank[] }) => {
      setActiveRanks(data.ranks);
    });

    // ✅ Clean up connection on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          Live Supplier Rankings
        </h1>

        {activeRanks.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No ranking updates yet. Waiting for supplier bids...
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border border-gray-200 px-4 py-2">Rank</th>
                <th className="border border-gray-200 px-4 py-2">Supplier ID</th>
              </tr>
            </thead>
            <tbody>
              {activeRanks.map((r, i) => (
                <tr
                  key={r.supplierId}
                  className={`${
                    i === 0 ? "bg-green-50 font-semibold" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {r.rank}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {r.supplierId}
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
