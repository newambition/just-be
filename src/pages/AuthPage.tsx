import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent!");
        setSuccess(
          "A password reset email has been sent to " +
            email +
            ". Please check your inbox."
        );
        setEmail(""); // Clear email after successful reset
      }
    } catch (err) {
      const errorCode = (err as { code?: string }).code;
      const errorMessage = (err as { message?: string }).message;
      console.error("Auth error:", errorCode, errorMessage);

      // Handle specific errors
      if (errorCode === "auth/user-not-found") {
        setError(
          "There is no user record corresponding to this email address. Please check your email or sign up."
        );
      } else if (errorCode === "auth/wrong-password") {
        setError("The password is incorrect. Please try again.");
      } else if (errorCode === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please try signing in instead."
        );
      } else if (errorCode === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed: " + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogleRedirect = async () => {
    console.log("🚀 Starting Google sign-in...");
    console.log("🌐 Current origin:", window.location.origin);
    console.log("🏠 Auth domain:", auth.config.authDomain);
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Use popup for localhost development, redirect for production
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (isLocalhost) {
        console.log("🪟 Using popup for localhost development");
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;

        console.log("✅ Successfully signed in with Google (Popup)!");
        console.log("👤 User:", user.displayName, user.email, user.uid);
        console.log("🔑 Token:", credential?.accessToken);
      } else {
        console.log("🔄 Using redirect for production");
        await signInWithRedirect(auth, provider);
        console.log("✅ Redirect initiated successfully");
      }
    } catch (error) {
      console.error("❌ Error signing in with Google:", error);
      setError(
        "Failed to sign in with Google: " +
          (error as { message?: string }).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Login";
      case "signup":
        return "Sign Up";
      case "forgot":
        return "Reset Password";
      default:
        return "Login";
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case "login":
        return isLoading ? "Logging in..." : "Login";
      case "signup":
        return isLoading ? "Creating account..." : "Sign Up";
      case "forgot":
        return isLoading ? "Sending..." : "Send Reset Email";
      default:
        return "Login";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="w-11/12 max-w-md space-y-8 rounded-2xl bg-slate-800 p-8 shadow-lg">
        <h2 className="text-center font-quicksand text-3xl font-bold text-white">
          {getTitle()}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
            className="w-full rounded-md bg-slate-200 px-4 py-2 font-quicksand text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />

          {mode !== "forgot" && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
              className="w-full rounded-md bg-slate-200 px-4 py-2 font-quicksand text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {getButtonText()}
          </button>
        </form>

        {/* Google Sign In Button - Only show for login and signup modes */}
        {mode !== "forgot" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-px flex-1 bg-slate-600"></div>
              <span className="px-4 font-quicksand text-sm text-slate-400">
                or
              </span>
              <div className="h-px flex-1 bg-slate-600"></div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogleRedirect}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-2 font-quicksand text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FcGoogle className="size-5" />
              Continue with Google
            </button>
          </div>
        )}

        {error && (
          <p className="text-center font-quicksand text-red-500">{error}</p>
        )}

        {success && (
          <p className="text-center font-quicksand text-green-500">{success}</p>
        )}

        <div className="space-y-3 text-center">
          {mode === "login" && (
            <>
              <p>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  disabled={isLoading}
                  className="font-quicksand text-sky-400 hover:underline disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  disabled={isLoading}
                  className="font-quicksand text-sky-400 hover:underline disabled:opacity-50"
                >
                  Need an account? Sign Up
                </button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <p>
              <button
                type="button"
                onClick={() => setMode("login")}
                disabled={isLoading}
                className="font-quicksand text-sky-400 hover:underline disabled:opacity-50"
              >
                Have an account? Login
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <p>
              <button
                type="button"
                onClick={() => setMode("login")}
                disabled={isLoading}
                className="font-quicksand text-sky-400 hover:underline disabled:opacity-50"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
