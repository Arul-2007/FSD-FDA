import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [demos, setDemos] = useState([]);
  const [email, setEmail] = useState("donor@fdaa.test");
  const [password, setPassword] = useState("test1234");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.demoUsers().then(setDemos).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const data = await api.login(email, password);
      login(data.user);
      nav(data.user.role === "receiver" ? "/find" : "/donate");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <main className="page">
      <p className="kicker">Test accounts</p>
      <h1 className="display" style={{ fontSize: 48 }}>
        Sign in
      </h1>
      <p className="lede">Use a seeded test user. Password for all of them is test1234.</p>

      <div className="grid" style={{ margin: "18px 0 24px" }}>
        {demos.map((u) => (
          <motion.button
            type="button"
            className="card"
            key={u.email}
            whileHover={{ y: -6, rotateY: -6 }}
            onClick={() => {
              setEmail(u.email);
              setPassword(u.password);
            }}
            style={{ textAlign: "left", cursor: "pointer", color: "inherit" }}
          >
            <span className="pill">{u.role}</span>
            <h3>{u.name}</h3>
            <p className="muted">{u.email}</p>
            <p className="muted">{u.location}</p>
          </motion.button>
        ))}
      </div>

      <motion.form
        className="form-card"
        onSubmit={submit}
        initial={{ opacity: 0, rotateX: 10 }}
        animate={{ opacity: 1, rotateX: 0 }}
      >
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {msg && <div className="flash">{msg}</div>}
        <button className="btn" type="submit">
          Enter FDAA
        </button>
      </motion.form>
    </main>
  );
}
