import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const KEY = "fdaa-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  });

  const value = useMemo(
    () => ({
      user,
      login: (next) => {
        localStorage.setItem(KEY, JSON.stringify(next));
        setUser(next);
      },
      logout: () => {
        localStorage.removeItem(KEY);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
