import React, { useContext } from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import PresetSelectionPage from "./pages/PresetSelectionPage";
import ExercisePage from "./pages/ExercisePage";
import HistoryPage from "./pages/HistoryPage";
import AuthPage from "./pages/AuthPage";
import SplashScreen from "./components/SplashScreen";
import Nav from "./components/nav";
import SettingsPanel from "./components/SettingsPanel";
import { useAppLogic } from "./hooks/useAppLogic";
import { AppContext } from "./context/AppContext";
import { AuthContext } from "./context/AuthContext";

const AppLayout: React.FC = () => {
  const { isSettingsOpen, toggleSettings } = useAppLogic();
  const location = useLocation();

  const backgroundImage = new URL("./assets/background.svg", import.meta.url)
    .href;

  return (
    <div className="min-h-dvh bg-slate-900 text-white font-sans relative">
      <img
        src={backgroundImage}
        alt="Just Be Background"
        className="w-full h-full fixed top-0 left-0 object-cover brightness-75 blur-sm"
      />
      <SettingsPanel isOpen={isSettingsOpen} onClose={toggleSettings} />

      <main className="relative w-full max-w-md sm:max-w-6xl mx-auto flex flex-col min-h-dvh">
        <div
          className={`flex-grow flex flex-col items-center mb-4 ${
            location.pathname === "/history"
              ? "justify-start"
              : "justify-center"
          }`}
        >
          <Outlet />
        </div>
      </main>

      {/* Hide nav only during exercise, but keep it in DOM for transitions */}
      <div
        className={
          location.pathname.includes("/exercise")
            ? "opacity-0 pointer-events-none"
            : ""
        }
      >
        <Nav onToggleSettings={toggleSettings} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);

  if (appContext?.appIsLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={authContext?.currentUser ? <Navigate to="/" /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          authContext?.currentUser ? <AppLayout /> : <Navigate to="/auth" />
        }
      >
        <Route index element={<PresetSelectionPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="exercise/:exerciseId" element={<ExercisePage />} />
      </Route>
    </Routes>
  );
};

export default App;
