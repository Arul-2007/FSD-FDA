import { Router } from "express";

const ALLOWED = ["cooked", "produce", "baked", "packed", "other"];

function sanitize(body) {
  return {
    foodName: String(body.foodName || "").trim(),
    category: ALLOWED.includes(body.category) ? body.category : "other",
    servings: Number(body.servings),
    donorName: String(body.donorName || "").trim(),
    phone: String(body.phone || "").trim(),
    location: String(body.location || "").trim(),
    pickupUntil: String(body.pickupUntil || "").trim(),
    notes: String(body.notes || "").trim().slice(0, 240),
  };
}

function valid(data) {
  return (
    data.foodName &&
    data.donorName &&
    data.phone &&
    data.location &&
    data.pickupUntil &&
    Number.isFinite(data.servings) &&
    data.servings >= 1
  );
}

export function donationRouter(store) {
  const router = Router();

  router.get("/", async (req, res) => {
    const status = req.query.status;
    const data = await store.list(status);
    res.set("Cache-Control", "no-store");
    res.json(data);
  });

  router.get("/stats", async (_req, res) => {
    res.json(await store.stats());
  });

  router.post("/", async (req, res) => {
    const data = sanitize(req.body);
    if (!valid(data)) {
      return res.status(400).json({ message: "Please fill every required field." });
    }
    const created = await store.create(data);
    res.status(201).json(created);
  });

  router.patch("/:id/claim", async (req, res) => {
    const claimedBy = String(req.body.claimedBy || "").trim();
    if (!claimedBy) {
      return res.status(400).json({ message: "Receiver name is required." });
    }
    const result = await store.claim(req.params.id, claimedBy);
    if (!result) return res.status(404).json({ message: "Donation not found." });
    if (result.error === "already_claimed") {
      return res.status(409).json({ message: "Already claimed." });
    }
    res.json(result);
  });

  return router;
}
