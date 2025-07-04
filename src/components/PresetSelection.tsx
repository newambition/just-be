import React from "react";
import type { BreathingExercise } from "../types";
import { EXERCISES } from "../constants";

interface PresetSelectionProps {
  onSelectExercise: (exercise: BreathingExercise) => void;
}

const PresetCard: React.FC<{
  exercise: BreathingExercise;
  onSelect: () => void;
}> = ({ exercise, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="w-full bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:bg-slate-700/80 transition-all duration-300 text-left flex items-center space-x-5 border border-slate-700 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 font-quicksand"
    >
      <div className="flex-shrink-0">{exercise.icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-quicksand">
          {exercise.mood}
        </p>
        <h3 className="text-base font-bold text-slate-100 mt-1 font-quicksand">
          {exercise.title}
        </h3>
        <p className="text-slate-200/90 text-sm mt-2 font-quicksand">
          {exercise.description}
        </p>
      </div>
    </button>
  );
};

const PresetSelection: React.FC<PresetSelectionProps> = ({
  onSelectExercise,
}) => {
  return (
    <div className="mt-2 animate-fade-in">
      <h2 className="text-sm font-semibold text-center text-sky-800 mb-6 tracking-tighter font-quicksand">
        Choose Your Session
      </h2>
      <div className="space-y-4">
        {EXERCISES.map((exercise) => (
          <PresetCard
            key={exercise.id}
            exercise={exercise}
            onSelect={() => onSelectExercise(exercise)}
          />
        ))}
      </div>
    </div>
  );
};

export default PresetSelection;
