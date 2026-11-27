import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, session, type AuthUser, type Role } from "@/api";

export const LANDING: Record<Role, string> = {
  Patient: "/portal/appointments",
  Receptionist: "/reception/checkin",
  Doctor: "/doctor/schedule",
  Pharmacist: "/pharmacy/queue",
  Admin: "/admin/staff",
};

interface AuthState {
  user: AuthUser | null;
  ready: boolean;
  login: (token: string, user: AuthUser) => void;
  refresh: () => Promise<AuthUser | null>;
  logout: () => void;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!session.getToken()) {
      setUser(null);
      return null;
    }
    try {
      const me = await auth.me();
      session.setUser(me);
      setUser(me);
      return me;
    } catch {
      session.clear();
      setUser(null);
      return null;
    }
  }, []);

  // Restore the session on every full page load.
  useEffect(() => {
    setUser(session.getUser());
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const login = useCallback((token: string, u: AuthUser) => {
    session.set(token, u);
    setUser(u);
  }, []);
  const logout = useCallback(() => {
    session.clear();
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, ready, login, refresh, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}
