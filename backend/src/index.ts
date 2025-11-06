import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path, { dirname } from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import prisma from "./prismaClient.js";

import authRoutes from "./routes/auth.js";
import auctionRoutes from "./routes/auctions.js";
import bidRoutes from "./routes/bids.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Proper __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);

// ----------------------
// Serve frontend (corrected Render path)
// ----------------------
// Note: When compiled, this file lives at /opt/render/project/src/backend/dist
// So we go up two levels → ../../frontend/out
const frontendPath = path.join(__dirname, "../../frontend/out");

app.use(express.static(frontendPath));

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
