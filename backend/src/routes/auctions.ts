import { Router, Request, Response } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// ✅ Create a new auction
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, startsAt, endsAt, buyerId } = req.body;

    if (!title || !startsAt || !endsAt || !buyerId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title, startsAt, endsAt, buyerId" });
    }

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        buyer: {
          connect: { id: buyerId },
        },
      },
      include: { buyer: true },
    });

    res.json(auction);
  } catch (err) {
    console.error("Error creating auction:", err);
    res.status(500).json({ error: "Failed to create auction" });
  }
});

// ✅ Fetch all auctions
router.get("/", async (_req: Request, res: Response) => {
  try {
    const auctions = await prisma.auction.findMany({
      orderBy: { startsAt: "desc" },
      include: { buyer: true },
    });
    res.json(auctions);
  } catch (err) {
    console.error("Error fetching auctions:", err);
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

export default router;
