import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";

import prisma from "./prismaClient";
import auctionSocketHandler from "./websockets/auctionSocket";

import authRoutes from "./routes/auth";
import auctionRoutes from "./routes/auctions";
import bidRoutes from "./routes/bids";

dotenv.config();

// ---------------------------------------------
// Basic setup
// ---------------------------------------------
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // safe since frontend is same Render domain
  },
});

const PORT = process.env.PORT || 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------
// Middlewares
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
// Socket.IO: Real-time Auctions
// ---------------------------------------------
io.on("connection", (socket) => {
  console.log(`⚡ New Socket connected: ${socket.id}`);
  auctionSocketHandler(io, socket);
});

// ---------------------------------------------
// Serve Frontend (Next.js build export)
// ---------------------------------------------
// Note: This assumes your frontend has been built using `next export`
// and static files are in `frontend/out`

const frontendPath = path.join(__dirname, "../../frontend/out");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------------------------------------
// Health Check
// ---------------------------------------------
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", message: "Backend & DB running fine 🚀" });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

// ---------------------------------------------
// Start Server
// ---------------------------------------------
server.listen(PORT, () => {
  console.log(`✅ Reverse Auction Platform running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
