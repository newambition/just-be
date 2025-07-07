import React from "react";
import PresetSelectionPage from "./pages/PresetSelectionPage";
import ExercisePage from "./pages/ExercisePage";
import HistoryPage from "./pages/HistoryPage";
import SplashScreen from "./components/SplashScreen";
import Nav from "./components/nav";
import SettingsPanel from "./components/SettingsPanel";
import { useAppLogic } from "./hooks/useAppLogic";

const App: React.FC = () => {
  const {
    loading,
    selectedExercise,
    activePage,
    isSettingsOpen,
    handleSelectExercise,
    handleCompleteExercise,
    handleNavigate,
    toggleSettings,
  } = useAppLogic();

  if (loading) {
    return <SplashScreen />;
  }

  const backgroundImage = new URL("./assets/background.svg", import.meta.url)
    .href;

  const renderPage = () => {
    if (selectedExercise) {
      return (
        <ExercisePage
          exercise={selectedExercise}
          onComplete={handleCompleteExercise}
        />
      );
    }
    switch (activePage) {
      case "home":
        return <PresetSelectionPage onSelectExercise={handleSelectExercise} />;
      case "history":
        return <HistoryPage />;
      default:
        return <PresetSelectionPage onSelectExercise={handleSelectExercise} />;
    }
  };

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
            activePage === "history" ? "justify-start" : "justify-center"
          }`}
        >
          {renderPage()}
        </div>
      </main>
      <Nav
        activePage={activePage}
        onNavigate={handleNavigate}
        onToggleSettings={toggleSettings}
      />
    </div>
  );
};

export default App;
