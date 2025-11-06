import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import prisma from "./prismaClient";

import authRoutes from "./routes/auth";
import auctionRoutes from "./routes/auctions";
import bidRoutes from "./routes/bids";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Fix for CommonJS runtime on Render
const __dirname = path.resolve();

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);

// ----------------------
// Serve frontend (static)
// ----------------------
const frontendPath = path.join(__dirname, "../frontend/out");
app.use(express.static(frontendPath));

// Fallback for client-side routing
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ----------------------
// HTTP + Socket.IO Server
// ----------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ----------------------
// Socket.IO: Live Rankings
// ----------------------
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Example: broadcast new rankings
  socket.on("ranking:update", (data) => {
    io.emit("ranking:update", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Reverse Auction backend running on port ${PORT}`);
});
