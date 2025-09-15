import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import backend from "~backend/client";

type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  profile?: { fullName?: string | null; avatarUrl?: string | null } | null;
  roles: string[];
} | null;

interface AuthContextValue {
  user: User;
  loading: boolean;
  signup: (params: { email: string; name?: string; password?: string; method?: "magic" | "password"; redirectTo?: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    try {
      const u = await backend.auth.getUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signup: async ({ email, name, password, method, redirectTo }) => {
      await backend.auth.signup({ email, name, password, method, redirectTo });
      // If magic method, just hydrate after; for password method, cookies should be set
      await hydrate();
    },
    login: async (email, password) => {
      await backend.auth.login({ email, password });
      await hydrate();
    },
    sendMagicLink: async (email, redirectTo) => {
      await backend.auth.magicSend({ email, redirectTo });
    },
    logout: async () => {
      await backend.auth.logout();
      setUser(null);
    },
    refresh: async () => {
      await backend.auth.refresh();
      await hydrate();
    },
    reload: hydrate,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
