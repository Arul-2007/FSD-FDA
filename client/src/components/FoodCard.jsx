import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api.js";

function FoodCard({ item, onClaimed, defaultName = "" }) {
  const [name, setName] = useState(defaultName);
  const [busy, setBusy] = useState(false);
  const claimed = item.status === "claimed";

  useEffect(() => {
    if (defaultName) setName(defaultName);
  }, [defaultName]);

  async function claim() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const updated = await api.claim(item._id, name.trim());
      onClaimed(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.article
      className="card"
      layout
      initial={{ opacity: 0, y: 18, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -8, rotateX: 6, rotateY: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <span className={`pill ${claimed ? "claimed" : ""}`}>{item.status}</span>
      <h3>{item.foodName}</h3>
      <p className="muted">
        {item.servings} servings · {item.category} · {item.location}
      </p>
      <p className="muted">Pickup: {item.pickupUntil}</p>
      {claimed ? (
        <p>Claimed by {item.claimedBy}</p>
      ) : (
        <>
          <input
            placeholder="Your kitchen / NGO name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn" disabled={busy} onClick={claim} style={{ marginTop: 10 }}>
            {busy ? "Claiming…" : "Claim this food"}
          </button>
        </>
      )}
    </motion.article>
  );
}

export default memo(FoodCard);
