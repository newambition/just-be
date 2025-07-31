import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { BreathingExercise, SessionLog } from "../types";
import { BreathingPhase } from "../types";
import { AppContext } from "../context/AppContext";
import { logExerciseCompletion } from "../services/analyticsService";

// Helper function to calculate total breaths in an exercise
const calculateBreathsCount = (exercise: BreathingExercise): number => {
  const breathsPerCycle = exercise.pattern.filter(
    (step) =>
      step.phase === BreathingPhase.Inhale ||
      step.phase === BreathingPhase.Exhale
  ).length;
  return breathsPerCycle * exercise.totalCycles;
};

// Helper function to calculate total duration in seconds
const calculateDuration = (exercise: BreathingExercise): number => {
  const cycleDuration = exercise.pattern.reduce(
    (sum, step) => sum + step.duration,
    0
  );
  return cycleDuration * exercise.totalCycles;
};

export const useAppLogic = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useAppLogic must be used within an AppProvider");
  }
  const { logSession } = appContext;

  const handleSelectExercise = (exercise: BreathingExercise) => {
    navigate(`/exercise/${exercise.id}`);
  };

  const handleCompleteExercise = (exercise?: BreathingExercise) => {
    if (exercise) {
      const sessionLog: SessionLog = {
        exerciseId: exercise.id,
        completedAt: new Date().toISOString(),
        duration: calculateDuration(exercise),
        breathsCount: calculateBreathsCount(exercise),
      };
      logSession(sessionLog);
      logExerciseCompletion(exercise.id, exercise.title);
    }
    navigate("/");
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return {
    isSettingsOpen,
    handleSelectExercise,
    handleCompleteExercise,
    toggleSettings,
  };
};
