import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  onAuthStateChanged,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
  currentUser: User | null;
  authLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result when app initializes (only for production)
    const handleSignInRedirectResult = async () => {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (isLocalhost) {
        console.log(
          "🏠 Localhost detected - skipping redirect result check (using popup)"
        );
        return;
      }

      console.log("🔍 Checking for redirect result at app initialization...");
      console.log("🌐 Current URL:", window.location.href);
      console.log("🔗 URL params:", window.location.search);
      console.log("🏠 Auth domain:", auth.config.authDomain);

      try {
        const result = await getRedirectResult(auth);
        console.log("🔍 Raw redirect result:", result);

        if (result) {
          // This means a redirect sign-in just completed successfully!
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;

          console.log("✅ Redirect sign-in successful!");
          console.log("👤 User:", user.displayName, user.email, user.uid);
          console.log("🔑 Token:", credential?.accessToken);
        } else {
          // No redirect result, meaning this page load is not from a sign-in redirect.
          console.log("ℹ️ No pending redirect sign-in result.");
        }
      } catch (error) {
        // Handle Errors during the redirect result retrieval
        const errorCode = (error as { code?: string }).code;
        const errorMessage = (error as { message?: string }).message;
        console.error(
          "❌ Error handling redirect sign-in result:",
          errorCode,
          errorMessage
        );
      }
    };

    // Call redirect result handler immediately
    handleSignInRedirectResult();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Auth state changed:", user);
      console.log("📧 User email:", user?.email);
      console.log("👤 Display name:", user?.displayName);
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
