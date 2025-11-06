// backend/src/routes/auctions.ts
import express from 'express';
import prisma from '../prismaClient';

const router = express.Router();

// Create new auction (Buyer)
router.post('/', async (req, res) => {
  try {
    const { title, description, createdBy, startsAt, endsAt, items } = req.body;

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        createdBy,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        items: {
          create: items.map((it: any) => ({
            slNo: it.slNo,
            description: it.description,
            qty: it.qty,
            uom: it.uom,
          })),
        },
      },
      include: { items: true },
    });

    res.json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

// Get all auctions
router.get('/', async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

// Get single auction by ID
router.get('/:id', async (req, res) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: req.params.id },
      include: { items: true, bids: true },
    });
    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
});

export default router;

