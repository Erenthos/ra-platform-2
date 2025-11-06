"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AuctionList from "../components/AuctionList";
import socket from "../lib/socketClient";

interface Auction {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
}

export default function HomePage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);

  // Load all auctions from backend
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`)
      .then((res) => setAuctions(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Listen for ranking updates in real time
  useEffect(() => {
    socket.on("ranking:update", (data) => {
      console.log("Ranking updated:", data);
      setRanks(data.ranks);
    });

    return () => {
      socket.off("ranking:update");
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Live Auctions</h2>
      <AuctionList auctions={auctions} ranks={ranks} />
    </div>
  );
}

