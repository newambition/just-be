import { useState, useEffect } from "react";
import type { BreathingExercise } from "../types";

export const useBreathingApp = () => {
  const [selectedExercise, setSelectedExercise] =
    useState<BreathingExercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSelectExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
  };

  const handleCompleteExercise = () => {
    setSelectedExercise(null);
  };

  return {
    loading,
    selectedExercise,
    handleSelectExercise,
    handleCompleteExercise,
  };
};
