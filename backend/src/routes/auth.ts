import { Router, Request, Response } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// --------------------------
// SIGNUP
// --------------------------
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (role !== "BUYER" && role !== "SUPPLIER") {
      return res.status(400).json({ error: "Role must be BUYER or SUPPLIER." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const user = await prisma.user.create({
      data: { name, email, password, role },
    });

    console.log("✅ New user created:", user.email);
    return res.status(201).json({ message: "Signup successful", user });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed. Try again." });
  }
});

// --------------------------
// LOGIN
// --------------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password." });
    }

    console.log("✅ Login success:", email);
    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
