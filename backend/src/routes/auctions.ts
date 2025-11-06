import { Router, Request, Response } from "express";
import prisma from "../prismaClient.js";

const router = Router();

/**
 * POST /api/auctions
 * Body: { title, description?, buyerId, startsAt, endsAt, items: [{ description, qty, uom, slNo }] }
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, buyerId, startsAt, endsAt, items } = req.body;
    if (!title || !buyerId || !startsAt || !endsAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const auction = await prisma.auction.create({
      data: {
        title,
        description: description ?? null,
        buyerId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        items: {
          create: (items || []).map((it: any) => ({
            description: it.description,
            qty: Number(it.qty),
            uom: it.uom ?? null,
            // slNo is optional in schema; include if provided
            ...(it.slNo !== undefined ? { slNo: Number(it.slNo) } : {}),
          })),
        },
      },
      include: { items: true },
    });

    res.json(auction);
  } catch (err) {
    console.error("Create auction error:", err);
    res.status(500).json({ error: "Failed to create auction" });
  }
});

// GET /api/auctions
router.get("/", async (req: Request, res: Response) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(auctions);
  } catch (err) {
    console.error("Fetch auctions error:", err);
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

// GET /api/auctions/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { items: true, bids: true },
    });

    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.json(auction);
  } catch (err) {
    console.error("Fetch auction error:", err);
    res.status(500).json({ error: "Failed to fetch auction" });
  }
});

export default router;
