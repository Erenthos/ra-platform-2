"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../lib/socketClient";
import DashboardLayout from "../../components/DashboardLayout";
import BidForm from "../../components/BidForm";
import RankingTable from "../../components/RankingTable";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Auth } from "../../lib/auth";

export default function SupplierDashboard() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [ranks, setRanks] = useState<any[]>([]);

  const user = Auth.getUser();
  const supplierId = user?.id || "UNKNOWN";

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`)
      .then((res) => setAuctions(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedAuction) return;
    socket.emit("join-auction", { auctionId: selectedAuction.id, supplierId });
    socket.on("ranking:update", (data) => setRanks(data.ranks));
    return () => socket.off("ranking:update");
  }, [selectedAuction]);

  return (
    <ProtectedRoute allowedRoles={["SUPPLIER"]}>
      <DashboardLayout role="supplier">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Supplier Live Auctions
        </h1>

        {!selectedAuction && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                onClick={() => setSelectedAuction(auction)}
                className="cursor-pointer p-4 bg-white border rounded-lg shadow hover:shadow-lg hover:border-blue-500 transition"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {auction.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(auction.startsAt).toLocaleString()} →{" "}
                  {new Date(auction.endsAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedAuction && (
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Auction: {selectedAuction.title}
            </h2>
            <BidForm auctionId={selectedAuction.id} supplierId={supplierId} />
            <RankingTable ranks={ranks} />
            <button
              onClick={() => setSelectedAuction(null)}
              className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back to Auctions
            </button>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
