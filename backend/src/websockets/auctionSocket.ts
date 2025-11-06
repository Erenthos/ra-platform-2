// backend/src/websockets/auctionSocket.ts
import { Server, Socket } from 'socket.io';
import prisma from '../prismaClient.js';

export default function auctionSocketHandler(io: Server, socket: Socket) {
  console.log(`⚡ New socket connected: ${socket.id}`);

  // When a supplier joins a specific auction room
  socket.on('join-auction', async ({ auctionId, supplierId }) => {
    try {
      socket.join(`auction:${auctionId}`);
      console.log(`Supplier ${supplierId} joined auction ${auctionId}`);
    } catch (err) {
      console.error('Join error:', err);
    }
  });

  // When a supplier submits a new bid
  socket.on('bid:submit', async ({ auctionId, supplierId, items }) => {
    try {
      // Fetch auction items
      const auctionItems = await prisma.auctionItem.findMany({ where: { auctionId } });

      let totalValue = 0;
      for (const it of items) {
        const item = auctionItems.find((a) => a.id === it.itemId);
        if (item) totalValue += item.qty * it.rate;
      }

      // Upsert bid (insert if not exist, else update)
      await prisma.bid.upsert({
        where: {
          supplierId_auctionId: { supplierId, auctionId },
        },
        update: { items, totalValue },
        create: { supplierId, auctionId, items, totalValue },
      });

      // Compute updated ranks for this auction
      const bids = await prisma.bid.findMany({
        where: { auctionId },
        orderBy: { totalValue: 'asc' },
      });

      // Map supplier → rank (no bid values)
      const ranks = bids.map((b, i) => ({
        supplierId: b.supplierId,
        rank: i + 1,
      }));

      // Emit updated ranks to everyone in this auction room
      io.to(`auction:${auctionId}`).emit('ranking:update', {
        auctionId,
        ranks,
      });

      // Send confirmation to submitting supplier only
      socket.emit('bid:ack', {
        success: true,
        totalValue,
      });

      console.log(`✅ Bid updated for supplier ${supplierId} in auction ${auctionId}`);
    } catch (err) {
      console.error('Error submitting bid via socket:', err);
      socket.emit('bid:error', { error: 'Failed to submit bid' });
    }
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
}

