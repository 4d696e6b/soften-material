"use client";

import { AuthProvider as FirebaseAuthProvider } from "@/context/AuthProvider";
import { AuthProvider as MockAuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    </FirebaseAuthProvider>
  );
}
