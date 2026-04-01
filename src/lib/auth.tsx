import type { Session, User } from "@supabase/supabase-js";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import supabase from "./supabase";

type AuthContext = {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: null | Session;
  signup: (email: string, password: string) => Promise<void>;
  user: null | User;
};

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<null | Session>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signup(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return (
    <AuthContext value={{
      isLoading,
      login,
      logout,
      session,
      signup,
      user: session?.user ?? null,
    }}>
      {children}
    </AuthContext>
  );
}

// we don't really care about fast refresh here, and this is a convenient way
// to get the auth context without having to import AuthContext everywhere
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
