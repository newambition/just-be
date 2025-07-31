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
    <div className="relative min-h-dvh bg-slate-900 font-sans text-white">
      <img
        src={backgroundImage}
        alt="Just Be Background"
        className="fixed left-0 top-0 size-full object-cover blur-sm brightness-75"
      />
      <SettingsPanel isOpen={isSettingsOpen} onClose={toggleSettings} />

      <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col sm:max-w-6xl">
        <div
          className={`mb-4 flex grow flex-col items-center ${
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
            ? "pointer-events-none opacity-0"
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
