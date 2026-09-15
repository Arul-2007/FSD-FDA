import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Scene3D from "../components/Scene3D.jsx";
import { api } from "../api.js";

export default function Home() {
  const [stats, setStats] = useState({ listed: 0, available: 0, claimed: 0, meals: 0 });

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="kicker">Food Donor & Aid Application</p>
          <motion.h1
            className="display"
            initial={{ opacity: 0, y: 24, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            Surplus food should land on a plate, not in a bin.
          </motion.h1>
          <p className="lede">
            List leftover meals in seconds. Nearby kitchens, NGOs, and neighbors claim them before
            they go to waste.
          </p>
          <div className="cta-row">
            <Link className="btn" to="/donate">
              Donate food
            </Link>
            <Link className="btn ghost" to="/find">
              Find a tray
            </Link>
          </div>
        </div>
        <Scene3D />
      </section>

      <section className="stats">
        {[
          ["Meals listed", stats.meals],
          ["Open trays", stats.available],
          ["Claimed", stats.claimed],
          ["Donations", stats.listed],
        ].map(([label, value], i) => (
          <motion.div
            className="stat"
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
            whileHover={{ rotateY: 8, y: -6 }}
          >
            <b>{value}</b>
            {label}
          </motion.div>
        ))}
      </section>
    </main>
  );
}
