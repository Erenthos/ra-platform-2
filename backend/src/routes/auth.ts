import { Router, Request, Response } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// ✅ SIGNUP (unchanged — already working)
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ error: "All fields are required." });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already registered." });

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password, role },
    });

    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
});

// ✅ LOGIN (revised for Neon + Prisma debug)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required." });

    // ✅ Normalize case
    const normalizedEmail = email.toLowerCase();

    // ✅ Log visible users in DB (for debug)
    const allUsers = await prisma.user.findMany();
    console.log("📋 Users in DB:", allUsers.map(u => u.email));

    // ✅ Case-insensitive lookup
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      console.log("❌ No user found for email:", normalizedEmail);
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      console.log("❌ Invalid password for:", user.email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ Login successful:", user.email);
    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
