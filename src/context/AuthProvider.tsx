"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

type AuthContextValue = {
  firebaseUser: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
