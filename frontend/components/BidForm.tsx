"use client";

import { useState } from "react";
import socket from "../lib/socketClient";

export default function BidForm({
  auctionId,
  supplierId,
}: {
  auctionId: string;
  supplierId: string;
}) {
  const [rate, setRate] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const submitBid = () => {
    const items = [
      // For simplicity: one item placeholder; later, map real items here.
      { itemId: "ITEM1", rate },
    ];

    socket.emit("bid:submit", { auctionId, supplierId, items });

    socket.once("bid:ack", (data) => {
      setFeedback(`✅ Bid submitted! Total value: ₹${data.totalValue}`);
    });

    socket.once("bid:error", (err) => {
      setFeedback(`❌ ${err.error}`);
    });
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-2">Submit Your Bid</h3>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          placeholder="Enter rate per item"
          className="border border-gray-300 rounded px-3 py-2 w-40"
        />
        <button
          onClick={submitBid}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Bid
        </button>
      </div>
      {feedback && <p className="mt-2 text-sm text-green-700">{feedback}</p>}
    </div>
  );
}

