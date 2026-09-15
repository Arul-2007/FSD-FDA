import { createHash } from "crypto";

export function hashPassword(password) {
  return createHash("sha256").update(String(password)).digest("hex");
}

export const TEST_USERS = [
  {
    name: "Spice Garden",
    email: "donor@fdaa.test",
    password: "test1234",
    role: "donor",
    phone: "90000 11111",
    location: "T. Nagar, Chennai",
  },
  {
    name: "Koyambedu stall 12",
    email: "stall@fdaa.test",
    password: "test1234",
    role: "donor",
    phone: "90000 22222",
    location: "Koyambedu Market",
  },
  {
    name: "Rise Bakery",
    email: "bakery@fdaa.test",
    password: "test1234",
    role: "donor",
    phone: "90000 33333",
    location: "Anna Nagar",
  },
  {
    name: "Hope Kitchen",
    email: "ngo@fdaa.test",
    password: "test1234",
    role: "receiver",
    phone: "90000 44444",
    location: "Velachery",
  },
  {
    name: "Community Kitchen",
    email: "kitchen@fdaa.test",
    password: "test1234",
    role: "receiver",
    phone: "90000 55555",
    location: "Adyar",
  },
];

export function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    location: user.location,
  };
}
