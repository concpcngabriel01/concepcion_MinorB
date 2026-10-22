import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

function readSession() {
  return {
    access: sessionStorage.getItem("pokedex.access"),
    refresh: sessionStorage.getItem("pokedex.refresh"),
    username: sessionStorage.getItem("pokedex.username"),
  };
}

function announceAuthChange() {
  window.dispatchEvent(new Event("pokedex-auth-change"));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const syncSession = () => setSession(readSession());
    window.addEventListener("pokedex-auth-change", syncSession);
    return () => window.removeEventListener("pokedex-auth-change", syncSession);
  }, []);

  async function signIn(username, password) {
    const tokens = await api("/token/", {
      method: "POST",
      body: { username, password },
    });
    sessionStorage.setItem("pokedex.access", tokens.access);
    sessionStorage.setItem("pokedex.refresh", tokens.refresh);
    sessionStorage.setItem("pokedex.username", username);
    announceAuthChange();
  }

  function signOut() {
    sessionStorage.removeItem("pokedex.access");
    sessionStorage.removeItem("pokedex.refresh");
    sessionStorage.removeItem("pokedex.username");
    announceAuthChange();
  }

  const value = useMemo(() => ({
    ...session,
    signIn,
    signOut,
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
