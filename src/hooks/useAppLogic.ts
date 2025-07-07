import { useState, useEffect, useContext } from "react";
import type { BreathingExercise, SessionLog } from "../types";
import { AppContext } from "../context/AppContext";

export const useAppLogic = () => {
  const [selectedExercise, setSelectedExercise] =
    useState<BreathingExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<"home" | "history">("home");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useAppLogic must be used within an AppProvider");
  }
  const { logSession } = appContext;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setActivePage("home");
  };

  const handleCompleteExercise = () => {
    if (selectedExercise) {
      const sessionLog: SessionLog = {
        exerciseId: selectedExercise.id,
        completedAt: new Date().toISOString(),
      };
      logSession(sessionLog);
    }
    setSelectedExercise(null);
    setActivePage("home");
  };

  const handleNavigate = (page: "home" | "history") => {
    setSelectedExercise(null);
    setActivePage(page);
    setIsSettingsOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return {
    loading,
    selectedExercise,
    activePage,
    isSettingsOpen,
    handleSelectExercise,
    handleCompleteExercise,
    handleNavigate,
    toggleSettings,
  };
};
