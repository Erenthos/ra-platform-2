import { Server } from "socket.io";
import prisma from "../prismaClient.js";

export default function setupAuctionSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("🟢 Supplier connected:", socket.id);

    // Handle new bid event
    socket.on("bid:submit", async (data: { auctionId: number; supplierId: number; totalValue: number }) => {
      try {
        const { auctionId, supplierId, totalValue } = data;

        // Upsert bid
        const existing = await prisma.bid.findUnique({
          where: { auctionId_supplierId: { auctionId, supplierId } },
        }).catch(() => null);

        if (existing) {
          await prisma.bid.update({
            where: { id: existing.id },
            data: { totalValue, submittedAt: new Date() },
          });
        } else {
          await prisma.bid.create({
            data: { auctionId, supplierId, totalValue },
          });
        }

        // Recalculate ranking
        const bids = await prisma.bid.findMany({
          where: { auctionId },
          orderBy: { totalValue: "asc" },
        });

        const ranks: Record<number, number> = {};
        bids.forEach((b, idx) => {
          ranks[b.supplierId] = idx + 1;
        });

        io.emit("ranking:update", { auctionId, ranks });
      } catch (err) {
        console.error("Error handling bid:submit:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Supplier disconnected:", socket.id);
    });
  });
}
