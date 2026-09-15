import { hashPassword, TEST_USERS } from "./users.js";

const seed = [
  {
    foodName: "Veg biryani trays",
    category: "cooked",
    servings: 18,
    donorName: "Spice Garden",
    phone: "90000 11111",
    location: "T. Nagar, Chennai",
    pickupUntil: "Today 9:30 PM",
    notes: "Still hot. Bring your own boxes if possible.",
    status: "available",
    claimedBy: "",
  },
  {
    foodName: "Fresh banana crates",
    category: "produce",
    servings: 40,
    donorName: "Koyambedu stall 12",
    phone: "90000 22222",
    location: "Koyambedu Market",
    pickupUntil: "Today 7:00 PM",
    notes: "Ripe today — best for kitchens / shelters.",
    status: "available",
    claimedBy: "",
  },
  {
    foodName: "Sourdough loaves",
    category: "baked",
    servings: 12,
    donorName: "Rise Bakery",
    phone: "90000 33333",
    location: "Anna Nagar",
    pickupUntil: "Tomorrow 8:00 AM",
    notes: "Day-old, still excellent.",
    status: "claimed",
    claimedBy: "Hope Kitchen",
  },
];

export function createMemoryStore() {
  let rows = seed.map((item, i) => ({
    ...item,
    _id: String(i + 1),
    createdAt: new Date().toISOString(),
  }));

  let users = TEST_USERS.map((u, i) => ({
    _id: String(100 + i),
    name: u.name,
    email: u.email,
    passwordHash: hashPassword(u.password),
    role: u.role,
    phone: u.phone,
    location: u.location,
  }));

  return {
    async list(status) {
      const data = status ? rows.filter((r) => r.status === status) : rows;
      return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async create(body) {
      const doc = {
        ...body,
        status: "available",
        claimedBy: "",
        _id: String(Date.now()),
        createdAt: new Date().toISOString(),
      };
      rows = [doc, ...rows];
      return doc;
    },
    async claim(id, claimedBy) {
      const row = rows.find((r) => r._id === id);
      if (!row) return null;
      if (row.status === "claimed") return { error: "already_claimed" };
      row.status = "claimed";
      row.claimedBy = claimedBy;
      return row;
    },
    async stats() {
      return {
        listed: rows.length,
        available: rows.filter((r) => r.status === "available").length,
        claimed: rows.filter((r) => r.status === "claimed").length,
        meals: rows.reduce((sum, r) => sum + Number(r.servings || 0), 0),
      };
    },
    async login(email, password) {
      const user = users.find((u) => u.email === email);
      if (!user || user.passwordHash !== hashPassword(password)) return null;
      return user;
    },
    async register(body) {
      if (users.some((u) => u.email === body.email)) return { error: "exists" };
      const user = {
        _id: String(Date.now()),
        name: body.name,
        email: body.email,
        passwordHash: hashPassword(body.password),
        role: body.role,
        phone: body.phone,
        location: body.location,
      };
      users = [user, ...users];
      return user;
    },
  };
}
