import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const empty = {
  foodName: "",
  category: "cooked",
  servings: 10,
  donorName: "",
  phone: "",
  location: "",
  pickupUntil: "",
  notes: "",
};

export default function Donate() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...empty,
    donorName: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await api.create({ ...form, servings: Number(form.servings) });
      setMsg("Listed. Redirecting to open trays…");
      setTimeout(() => nav("/find"), 700);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <main className="page">
      <p className="kicker">Give it forward</p>
      <h1 className="display" style={{ fontSize: 48 }}>
        Donate surplus food
      </h1>
      {!user && (
        <p className="muted">
          Tip: <Link to="/login">sign in as a test donor</Link> to auto-fill your details.
        </p>
      )}
      <motion.form
        className="form-card"
        onSubmit={submit}
        initial={{ opacity: 0, rotateX: 12, y: 20 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <label>
          Food name
          <input value={form.foodName} onChange={(e) => set("foodName", e.target.value)} required />
        </label>
        <div className="row2">
          <label>
            Category
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="cooked">Cooked</option>
              <option value="produce">Produce</option>
              <option value="baked">Baked</option>
              <option value="packed">Packed</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Servings
            <input
              type="number"
              min="1"
              value={form.servings}
              onChange={(e) => set("servings", e.target.value)}
              required
            />
          </label>
        </div>
        <div className="row2">
          <label>
            Your name
            <input value={form.donorName} onChange={(e) => set("donorName", e.target.value)} required />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          </label>
        </div>
        <label>
          Pickup location
          <input value={form.location} onChange={(e) => set("location", e.target.value)} required />
        </label>
        <label>
          Pickup until
          <input
            placeholder="Today 8:00 PM"
            value={form.pickupUntil}
            onChange={(e) => set("pickupUntil", e.target.value)}
            required
          />
        </label>
        <label>
          Notes
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </label>
        {msg && <div className="flash">{msg}</div>}
        <button className="btn" type="submit">
          Publish donation
        </button>
      </motion.form>
    </main>
  );
}
