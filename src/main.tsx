import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./firebase";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";

// Check if current path is a Firebase Auth handler route
const isFirebaseAuthRoute = () => {
  return window.location.pathname.startsWith("/__/auth/");
};

// If it's a Firebase auth route, don't render the React app
if (isFirebaseAuthRoute()) {
  // Let Firebase handle the auth routes
  console.log("Firebase auth route detected, letting Firebase handle it");
} else {
  // Render the React app normally
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
