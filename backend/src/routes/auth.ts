import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = Router();
const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "secretkey123";

// Helper: generate JWT
function generateToken(id: string, role: string) {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
}

// ===============================================
// Signup - store password directly as text
// ===============================================
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const user = await prisma.user.create({
      data: {
        email,
        password, // ⚠️ plaintext storage (not hashed)
        name: name ?? "",
        role,
      },
    });

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ===============================================
// Login - compare password directly (plaintext)
// ===============================================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
