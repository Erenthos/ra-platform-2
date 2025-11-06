# 🏗️ Reverse Auction Platform (ra-platform-2)

A real-time Reverse Auction Platform built with **Express + Socket.IO + Prisma + Neon Postgres** and **Next.js frontend**.

---

## 🚀 Features
- Buyer/Supplier sign-up and login
- Auction creation by Buyers
- Suppliers submit bids item-wise
- Real-time rank updates (L1 → Ln)
- Secure (no supplier sees others' bids)
- Neon Postgres + Render Deployment

---

## 🧩 Setup (Backend)

```bash
git clone https://github.com/YOUR_USERNAME/ra-platform-2
cd ra-platform-2/backend
npm install
npx prisma generate
npm run dev

