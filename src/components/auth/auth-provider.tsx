"use client";

import {
  getCurrentUser,
  signOut as amplifySignOut,
  type AuthUser,
} from "aws-amplify/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { configureAmplify, isAmplifyConfigured } from "@/lib/amplify/configure";
import { env } from "@/lib/config/env";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (env.devAuthBypass) {
      setUser({ userId: "dev-user", username: "dev@local.test" } as AuthUser);
      setIsLoading(false);
      return;
    }

    if (!isAmplifyConfigured()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    configureAmplify();
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    if (env.devAuthBypass) {
      setUser(null);
      return;
    }
    if (isAmplifyConfigured()) {
      await amplifySignOut();
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signOut,
      refresh,
    }),
    [user, isLoading, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
