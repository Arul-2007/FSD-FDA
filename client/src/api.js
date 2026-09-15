const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API = `${BASE}/api/donations`;

async function json(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  demoUsers: () => fetch(`${BASE}/api/auth/demo`).then(json),
  login: (email, password) =>
    fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(json),
  list: (status) =>
    fetch(`${API}${status ? `?status=${status}` : ""}`).then(json),
  stats: () => fetch(`${API}/stats`).then(json),
  create: (body) =>
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(json),
  claim: (id, claimedBy) =>
    fetch(`${API}/${id}/claim`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimedBy }),
    }).then(json),
};
