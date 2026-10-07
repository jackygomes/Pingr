import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type User = { id: string; name: string; email: string };

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Placeholder auth: keeps the user in memory only.
 * Replace the three methods with Firebase Auth calls (and subscribe to
 * onAuthStateChanged) — the rest of the app only talks to `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: async (email) => {
        setUser({ id: 'local-user', name: email.split('@')[0], email });
      },
      signUp: async (name, email) => {
        setUser({ id: 'local-user', name, email });
      },
      signOut: async () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
