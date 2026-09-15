import { memo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function Scene3D() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-40, 40], [14, -14]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-40, 40], [-16, 16]), { stiffness: 140, damping: 18 });

  return (
    <motion.div
      className="scene"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 80);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 80);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.span
        className="orb"
        style={{
          width: 180,
          height: 180,
          left: "8%",
          top: "8%",
          background: "radial-gradient(circle, rgba(232,195,106,.45), transparent 70%)",
        }}
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="orb"
        style={{
          width: 120,
          height: 120,
          right: "4%",
          bottom: "10%",
          background: "radial-gradient(circle, rgba(61,207,138,.4), transparent 70%)",
        }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="plate"
        style={{ rotateX: rx, rotateY: ry, rotateZ: -18 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="float-card"
        style={{ rotateX: rx, rotateY: ry }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <small>Live tray</small>
        <strong style={{ display: "block", fontFamily: "Fraunces, serif", fontSize: 22 }}>
          18 meals
        </strong>
        <span>ready for pickup in T. Nagar</span>
      </motion.div>
    </motion.div>
  );
}

export default memo(Scene3D);
