import { lazy, Suspense } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Donate = lazy(() => import("./pages/Donate.jsx"));
const Find = lazy(() => import("./pages/Find.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <nav className="nav">
        <NavLink to="/" className="brand">
          <span className="mark">F</span>
          FDAA
        </NavLink>
        <div className="links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/find">Find food</NavLink>
          <NavLink to="/donate">Donate</NavLink>
          <NavLink to="/login">Test users</NavLink>
        </div>
        {user ? (
          <button className="btn ghost" type="button" onClick={logout}>
            {user.name} · out
          </button>
        ) : (
          <NavLink className="btn" to="/login">
            Sign in
          </NavLink>
        )}
      </nav>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/find" element={<Find />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  );
}
