// backend/src/index.ts
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import prisma from './prismaClient';
import auctionSocketHandler from './websockets/auctionSocket';
import authRoutes from './routes/auth';
import auctionRoutes from './routes/auctions';
import bidRoutes from './routes/bids';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  auctionSocketHandler(io, socket);
});

// Health check route
app.get('/', (req, res) => {
  res.send('Reverse Auction Platform Backend is running 🚀');
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
