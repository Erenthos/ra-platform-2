import { Router, Request, Response } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// --------------------------------------------------
// Submit a bid
// --------------------------------------------------
router.post("/:auctionId", async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    const { supplierId, totalValue } = req.body;

    if (!supplierId || !totalValue) {
      return res.status(400).json({ error: "supplierId and totalValue required" });
    }

    // Either update existing bid or create new one
    const existingBid = await prisma.bid.findUnique({
      where: { auctionId_supplierId: { auctionId: Number(auctionId), supplierId: Number(supplierId) } },
    }).catch(() => null);

    let bid;
    if (existingBid) {
      bid = await prisma.bid.update({
        where: { id: existingBid.id },
        data: { totalValue: Number(totalValue), submittedAt: new Date() },
      });
    } else {
      bid = await prisma.bid.create({
        data: {
          auctionId: Number(auctionId),
          supplierId: Number(supplierId),
          totalValue: Number(totalValue),
        },
      });
    }

    res.json(bid);
  } catch (err) {
    console.error("Error submitting bid:", err);
    res.status(500).json({ error: "Failed to submit bid" });
  }
});

// --------------------------------------------------
// Get bids for an auction
// --------------------------------------------------
router.get("/:auctionId", async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    const bids = await prisma.bid.findMany({
      where: { auctionId: Number(auctionId) },
      include: { supplier: true },
      orderBy: { totalValue: "asc" },
    });
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
});

export default router;
