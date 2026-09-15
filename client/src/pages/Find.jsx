import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import FoodCard from "../components/FoodCard.jsx";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Find() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("available");

  useEffect(() => {
    api.list().then(setItems).catch(() => {});
  }, []);

  const shown = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );

  function onClaimed(updated) {
    setItems((rows) => rows.map((r) => (r._id === updated._id ? updated : r)));
  }

  return (
    <main className="page">
      <p className="kicker">Rescue nearby</p>
      <h1 className="display" style={{ fontSize: 48 }}>
        Open trays
      </h1>
      <div className="cta-row" style={{ marginBottom: 18 }}>
        {["available", "claimed", "all"].map((key) => (
          <button
            key={key}
            className={filter === key ? "btn" : "btn ghost"}
            onClick={() => setFilter(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <motion.section className="grid" layout>
        {shown.map((item) => (
          <FoodCard
            key={item._id}
            item={item}
            onClaimed={onClaimed}
            defaultName={user?.role === "receiver" ? user.name : ""}
          />
        ))}
      </motion.section>
      {!shown.length && <p className="muted">No donations in this view yet.</p>}
    </main>
  );
}
