"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function CreateAuctionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const socket = io();

  // TODO: Replace with logged-in Buyer ID when auth is ready
  const buyerId = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auctions", {
        title,
        description,
        startsAt: startDate,
        endsAt: endDate,
        buyerId, // ✅ Backend now requires this
      });

      // ✅ Notify all suppliers in real time
      socket.emit("auction:new", res.data);

      alert("✅ Auction created successfully!");
      router.push("/buyer");
    } catch (error) {
      console.error("Error creating auction:", error);
      alert("❌ Failed to create auction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Create New Auction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Auction Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Supply of Solar Cables"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Optional details about the auction..."
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 w-full rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Auction..." : "Create Auction"}
          </button>
        </form>
      </div>
    </main>
  );
}
