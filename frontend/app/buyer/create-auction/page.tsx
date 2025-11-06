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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) {
      alert("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auctions", {
        title,
        description,
        startsAt: startDate,
        endsAt: endDate,
      });

      // Emit live auction event to all suppliers
      socket.emit("auction:new", res.data);

      alert("Auction created successfully!");
      router.push("/buyer");
    } catch (err) {
      console.error(err);
      alert("Failed to create auction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          Create New Auction
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Auction Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Example: Supply of Solar Cables"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Optional auction details..."
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Start Date *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">End Date *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>
    </main>
  );
}
