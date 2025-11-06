import { io } from "socket.io-client";

// Use Render backend URL or localhost for dev
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;

