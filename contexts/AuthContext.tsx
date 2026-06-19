"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { auth, UserProfile, AuthResponse } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("rv_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const profile = await auth.me();
      setUser(profile);
    } catch {
      localStorage.removeItem("rv_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveToken = (res: AuthResponse) => {
    localStorage.setItem("rv_token", res.access_token);
  };

  const login = async (email: string, password: string) => {
    const res = await auth.login(email, password);
    saveToken(res);
    const profile = await auth.me();
    setUser(profile);
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const res = await auth.register(email, password, fullName);
    saveToken(res);
    const profile = await auth.me();
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("rv_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
