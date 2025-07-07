import React from "react";
import PresetSelectionPage from "./pages/PresetSelectionPage";
import ExercisePage from "./pages/ExercisePage";
import SplashScreen from "./components/SplashScreen";
import Nav from "./components/nav";
import { useBreathingApp } from "./hooks/useBreathingApp";

const App: React.FC = () => {
  const {
    loading,
    selectedExercise,
    handleSelectExercise,
    handleCompleteExercise,
  } = useBreathingApp();

  if (loading) {
    return <SplashScreen />;
  }

  const backgroundImage = new URL("./assets/background.svg", import.meta.url)
    .href;
  return (
    // Use min-h-dvh to allow the container to grow with content
    <div className="min-h-dvh bg-slate-900 text-white font-sans relative">
      <img
        src={backgroundImage}
        alt="Just Be Background"
        // Use fixed positioning to cover the entire viewport, even on scroll
        className="w-full h-full fixed top-0 left-0 object-cover brightness-75 blur-sm"
      />

      {/* Add a relative positioning context for the main content */}
      <main className="relative w-full max-w-md sm:max-w-6xl mx-auto  flex flex-col min-h-dvh">
        {/* Added flex-grow to make this section fill available space */}
        <div className=" flex-grow flex flex-col items-center justify-center mb-4">
          {selectedExercise ? (
            <ExercisePage
              exercise={selectedExercise}
              onComplete={handleCompleteExercise}
            />
          ) : (
            <PresetSelectionPage onSelectExercise={handleSelectExercise} />
          )}
        </div>
      </main>
      <Nav />
    </div>
  );
};

export default App;
