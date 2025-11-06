import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Server as SocketIOServer } from "socket.io";

import prisma from "./prismaClient";
import auctionSocketHandler from "./websockets/auctionSocket";
import authRoutes from "./routes/auth";
import auctionRoutes from "./routes/auctions";
import bidRoutes from "./routes/bids";

// ---------------------------------------------
// Load environment variables
// ---------------------------------------------
dotenv.config();

// ---------------------------------------------
// Express + HTTP + Socket.IO Setup
// ---------------------------------------------
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// ---------------------------------------------
// Middleware
// ---------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------
// API Routes
// ---------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);

// ---------------------------------------------
// WebSocket: Real-time Auction Updates
// ---------------------------------------------
io.on("connection", (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);
  auctionSocketHandler(io, socket);
});

// ---------------------------------------------
// Serve Frontend (Next.js static build)
// ---------------------------------------------
const frontendPath = path.join(__dirname, "frontend/out");

app.use(express.static(frontendPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------------------------------------
// Health Check Route
// ---------------------------------------------
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", message: "Backend & DB running fine 🚀" });
  } catch (error) {
    console.error("❌ Health check failed:", error);
    res.status(500).json({ status: "error", error });
  }
});

// ---------------------------------------------
// Start Server
// ---------------------------------------------
server.listen(PORT, () => {
  console.log(`✅ Reverse Auction Platform running on port ${PORT}`);
});
