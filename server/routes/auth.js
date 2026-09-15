import { Router } from "express";
import { publicUser, TEST_USERS } from "../users.js";

export function authRouter(auth) {
  const router = Router();

  router.get("/demo", (_req, res) => {
    res.json(
      TEST_USERS.map(({ password, ...rest }) => ({
        ...rest,
        password,
      }))
    );
  });

  router.post("/login", async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await auth.login(email, password);
    if (!user) return res.status(401).json({ message: "Invalid email or password." });
    res.json({ user: publicUser(user) });
  });

  router.post("/register", async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const role = req.body.role === "receiver" ? "receiver" : "donor";
    const phone = String(req.body.phone || "").trim();
    const location = String(req.body.location || "").trim();
    if (!name || !email || password.length < 6) {
      return res.status(400).json({ message: "Name, email, and a 6+ character password are required." });
    }
    try {
      const user = await auth.register({ name, email, password, role, phone, location });
      if (user?.error === "exists") {
        return res.status(409).json({ message: "That email is already registered." });
      }
      res.status(201).json({ user: publicUser(user) });
    } catch {
      res.status(409).json({ message: "That email is already registered." });
    }
  });

  return router;
}
