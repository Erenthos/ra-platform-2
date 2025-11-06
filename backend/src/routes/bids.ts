// backend/src/routes/bids.ts
import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

// Submit or update bid
router.post('/:auctionId', async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { supplierId, items } = req.body;

    // Fetch item details for qty calculations
    const auctionItems = await prisma.auctionItem.findMany({ where: { auctionId } });

    let totalValue = 0;
    for (const it of items) {
      const item = auctionItems.find((a) => a.id === it.itemId);
      if (item) totalValue += item.qty * it.rate;
    }

    const bid = await prisma.bid.upsert({
      where: { supplierId_auctionId: { supplierId, auctionId } },
      update: { items, totalValue },
      create: { supplierId, auctionId, items, totalValue },
    });

    res.json({ message: 'Bid submitted successfully', totalValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit bid' });
  }
});

// Get all bids for an auction (buyer only)
router.get('/:auctionId', async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { auctionId: req.params.auctionId },
      orderBy: { totalValue: 'asc' },
    });

    // Only return rank info, not bid values
    const ranks = bids.map((b, i) => ({
      supplierId: b.supplierId,
      rank: i + 1,
    }));

    res.json(ranks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

export default router;

