import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import { Donation } from "./models/Donation.js";
import { User } from "./models/User.js";
import { createMemoryStore } from "./memoryStore.js";
import { donationRouter } from "./routes/donations.js";
import { authRouter } from "./routes/auth.js";
import { hashPassword, TEST_USERS } from "./users.js";

const PORT = Number(process.env.PORT) || 5000;
const ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fdaa";

const app = express();
app.disable("x-powered-by");
app.use(compression());
app.use(cors({ origin: ORIGINS, credentials: false }));
app.use(express.json({ limit: "32kb" }));

function mongoStore() {
  return {
    async list(status) {
      const filter = status ? { status } : {};
      return Donation.find(filter).sort({ createdAt: -1 }).lean();
    },
    async create(body) {
      const doc = await Donation.create(body);
      return doc.toObject();
    },
    async claim(id, claimedBy) {
      const doc = await Donation.findById(id);
      if (!doc) return null;
      if (doc.status === "claimed") return { error: "already_claimed" };
      doc.status = "claimed";
      doc.claimedBy = claimedBy;
      await doc.save();
      return doc.toObject();
    },
    async stats() {
      const [listed, available, claimed, meals] = await Promise.all([
        Donation.countDocuments(),
        Donation.countDocuments({ status: "available" }),
        Donation.countDocuments({ status: "claimed" }),
        Donation.aggregate([{ $group: { _id: null, n: { $sum: "$servings" } } }]),
      ]);
      return { listed, available, claimed, meals: meals[0]?.n || 0 };
    },
    async login(email, password) {
      const user = await User.findOne({ email }).lean();
      if (!user || user.passwordHash !== hashPassword(password)) return null;
      return user;
    },
    async register(body) {
      const exists = await User.findOne({ email: body.email });
      if (exists) return { error: "exists" };
      const doc = await User.create({
        name: body.name,
        email: body.email,
        passwordHash: hashPassword(body.password),
        role: body.role,
        phone: body.phone,
        location: body.location,
      });
      return doc.toObject();
    },
  };
}

async function seedMongoUsers() {
  for (const u of TEST_USERS) {
    await User.updateOne(
      { email: u.email },
      {
        $set: {
          name: u.name,
          email: u.email,
          passwordHash: hashPassword(u.password),
          role: u.role,
          phone: u.phone,
          location: u.location,
        },
      },
      { upsert: true }
    );
  }
  console.log(`Seeded ${TEST_USERS.length} test users`);
}

async function boot() {
  let store = createMemoryStore();
  let mode = "memory";

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: process.env.MONGODB_URI ? 8000 : 1200,
    });
    store = mongoStore();
    mode = "mongo";
    await seedMongoUsers();
    console.log("MongoDB connected");
  } catch {
    console.log("MongoDB not found — using in-memory store so the app still runs fast.");
    console.log("Test users ready (memory): donor@fdaa.test / test1234");
  }

  app.get("/api/health", (_req, res) => res.json({ ok: true, mode }));
  app.use("/api/auth", authRouter(store));
  app.use("/api/donations", donationRouter(store));

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FDAA API on port ${PORT} (${mode})`);
  });
}

boot();
