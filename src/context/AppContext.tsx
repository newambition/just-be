import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { AppSettings, History, SessionLog } from "../types";
import {
  getStoredSettings,
  setStoredSettings,
  getStoredHistory,
  setStoredHistory,
} from "../utils/storage";

interface AppContextType {
  settings: AppSettings;
  history: History;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  logSession: (session: SessionLog) => void;
  toggleFavorite: (exerciseId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);
  const [history, setHistory] = useState<History>(getStoredHistory);

  useEffect(() => {
    setStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    setStoredHistory(history);
  }, [history]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const logSession = useCallback((session: SessionLog) => {
    setHistory((prev) => {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      let newStreak = prev.streak;
      if (prev.lastSessionDate === yesterday) {
        newStreak += 1;
      } else if (prev.lastSessionDate !== today) {
        newStreak = 1;
      }

      const newCounts = { ...prev.counts };
      newCounts[session.exerciseId] = (newCounts[session.exerciseId] || 0) + 1;

      return {
        lastSession: session,
        counts: newCounts,
        streak: newStreak,
        lastSessionDate: today,
      };
    });
  }, []);

  const toggleFavorite = useCallback((exerciseId: string) => {
    setSettings((prev) => {
      const newFavorites = prev.favoriteExercises.includes(exerciseId)
        ? prev.favoriteExercises.filter((id) => id !== exerciseId)
        : [...prev.favoriteExercises, exerciseId];
      return { ...prev, favoriteExercises: newFavorites };
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ settings, history, updateSettings, logSession, toggleFavorite }}
    >
      {children}
    </AppContext.Provider>
  );
};
