import React, { useState } from "react";
import type { BreathingExercise } from "./types";
import PresetSelection from "./components/PresetSelection";
import ExerciseScreen from "./components/ExerciseScreen";

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercise] =
    useState<BreathingExercise | null>(null);

  const handleSelectExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
  };

  const handleCompleteExercise = () => {
    setSelectedExercise(null);
  };

  const background = new URL("./assets/background.svg", import.meta.url).href;
  return (
    <div className="h-dvh overflow-y-auto scrollbar-hide bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans relative">
      <img
        src={background}
        alt="Just Be"
        className="w-full h-full absolute top-0 left-0 object-cover brightness-90 opacity-85 overflow-visible"
      />

      <main className="w-full max-w-md mx-auto relative">
        <h1 className="text-4xl font-bold font-quicksand text-center text-sky-800 my-2 tracking-tighter first-letter:text-4xl first-letter:font-bold flex flex-col items-center">
          Just Be.
          <span className="text-sky-900 text-2xl font-semibold ">
            One Breath at a Time
          </span>
        </h1>

        {selectedExercise ? (
          <ExerciseScreen
            exercise={selectedExercise}
            onComplete={handleCompleteExercise}
          />
        ) : (
          <PresetSelection onSelectExercise={handleSelectExercise} />
        )}

        <footer className="text-center mt-4 text-slate-400 text-xs">
          <p>Find your center. One breath at a time.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
