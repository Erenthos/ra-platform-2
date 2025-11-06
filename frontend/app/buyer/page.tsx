"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../lib/socketClient";
import DashboardLayout from "../../components/DashboardLayout";
import RankingTable from "../../components/RankingTable";

interface Auction {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
}

export default function BuyerDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [activeRanks, setActiveRanks] = useState<any[]>([]);

  // Fetch buyer auctions
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`)
      .then((res) => setAuctions(res.data))
      .catch(console.error);
  }, []);

  // Listen for rank updates
  useEffect(() => {
    socket.on("ranking:update", (data) => {
      setActiveRanks(data.ranks);
    });
    return () => {
      socket.off("ranking:update");
    };
  }, []);

  return (
    <DashboardLayout role="buyer">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My Auctions (Buyer)
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              {auction.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(auction.startsAt).toLocaleString()} →{" "}
              {new Date(auction.endsAt).toLocaleString()}
            </p>

            <div className="mt-3">
              <RankingTable ranks={activeRanks} />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

