import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setSuccess("Password reset email sent! Check your inbox.");
        setEmail(""); // Clear email after successful reset
      }
    } catch (err: any) {
      setError(err.message);
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
        return "Login";
      case "signup":
        return "Sign Up";
      case "forgot":
        return "Send Reset Email";
      default:
        return "Login";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-11/12 max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white font-quicksand">
          {getTitle()}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 text-gray-900 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 font-quicksand"
          />

          {mode !== "forgot" && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 text-gray-900 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 font-quicksand"
            />
          )}

          <button type="submit" className="w-full btn-primary">
            {getButtonText()}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center font-quicksand">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-center font-quicksand">{success}</p>
        )}

        <div className="space-y-3 text-center">
          {mode === "login" && (
            <>
              <p>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sky-400 hover:underline font-quicksand"
                >
                  Forgot Password?
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-sky-400 hover:underline font-quicksand"
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
                className="text-sky-400 hover:underline font-quicksand"
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
                className="text-sky-400 hover:underline font-quicksand"
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
