import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { BreathingExercise, SessionLog } from "../types";
import { AppContext } from "../context/AppContext";
import { logExerciseCompletion } from "../services/analyticsService";

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
