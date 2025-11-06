import { Router, Request, Response } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// ✅ Create new auction
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, startsAt, endsAt } = req.body;

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
      },
    });

    res.json(auction);
  } catch (err) {
    console.error("Error creating auction:", err);
    res.status(500).json({ error: "Failed to create auction" });
  }
});

// ✅ Get all active auctions
router.get("/", async (_req: Request, res: Response) => {
  try {
    const auctions = await prisma.auction.findMany({
      orderBy: { startsAt: "desc" },
    });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

export default router;
