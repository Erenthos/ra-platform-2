import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

/**
 * POST /api/bids/:auctionId
 * Body: { supplierId, items: [{ itemId, rate }] }
 * This upserts the supplier's bid for the auction (unique per supplier+auction)
 */
router.post("/:auctionId", async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    const { supplierId, items } = req.body;

    if (!supplierId || !items) {
      return res.status(400).json({ error: "Missing supplierId or items" });
    }

    // Fetch auction items to get quantities for total calculation
    const auctionItems = await prisma.auctionItem.findMany({ where: { auctionId } });

    let totalValue = 0;
    for (const it of items) {
      const found = auctionItems.find((a) => a.id === it.itemId);
      if (found) {
        totalValue += Number(found.qty) * Number(it.rate);
      }
    }

    // Upsert the bid using composite unique key created in schema
    const bid = await prisma.bid.upsert({
      where: {
        // composite unique name set in schema: supplierId_auctionId
        supplierId_auctionId: { supplierId, auctionId },
      },
      update: {
        items,
        totalValue,
      },
      create: {
        supplierId,
        auctionId,
        items,
        totalValue,
      },
    });

    res.json({ message: "Bid submitted successfully", totalValue, bidId: bid.id });
  } catch (err) {
    console.error("Submit bid error:", err);
    res.status(500).json({ error: "Failed to submit bid" });
  }
});

/**
 * GET /api/bids/:auctionId
 * Returns ranking (supplierId + rank) for an auction — no bid values included.
 * (This endpoint intended for buyer/admin visibility)
 */
router.get("/:auctionId", async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { totalValue: "asc" },
    });

    const ranks = bids.map((b, i) => ({ supplierId: b.supplierId, rank: i + 1 }));
    res.json(ranks);
  } catch (err) {
    console.error("Fetch bids error:", err);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
});

export default router;
