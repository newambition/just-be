import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import type { ReactNode } from "react";
import type { AppSettings, History, SessionLog } from "../types";
import { AuthContext } from "./AuthContext";
import {
  getUserData,
  updateUserSettings,
  logUserSession,
} from "../services/firestoreService";
import {
  logSettingChange,
  logFavoriteToggle,
} from "../services/analyticsService";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface AppContextType {
  settings: AppSettings;
  history: History;
  appIsLoading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  logSession: (session: SessionLog) => void;
  toggleFavorite: (exerciseId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  hapticsEnabled: true,
  remindersEnabled: false,
  favoriteExercises: [],
};

const defaultHistory: History = {
  lastSession: null,
  counts: {},
  streak: 0,
  lastSessionDate: null,
  totalBreaths: 0,
  minutesBreathing: 0,
  longestStreak: 0,
  totalSessions: 0,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const authContext = useContext(AuthContext);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [history, setHistory] = useState<History>(defaultHistory);
  const [dataLoading, setDataLoading] = useState(true);

  const appIsLoading = authContext?.authLoading || dataLoading;

  useEffect(() => {
    if (authContext && !authContext.authLoading) {
      if (authContext.currentUser) {
        const userDocRef = doc(db, "users", authContext.currentUser.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSettings({ ...defaultSettings, ...data.settings });
            // Ensure all history fields have proper defaults
            const userHistory = data.history || {};
            setHistory({
              ...defaultHistory,
              ...userHistory,
              totalBreaths: userHistory.totalBreaths || 0,
              minutesBreathing: userHistory.minutesBreathing || 0,
              longestStreak: userHistory.longestStreak || 0,
              totalSessions: userHistory.totalSessions || 0,
            });
          } else {
            getUserData(authContext.currentUser!.uid);
          }
          setDataLoading(false);
        });
        return () => unsubscribe();
      } else {
        // No user, so no data to load
        setDataLoading(false);
      }
    }
  }, [authContext]);

  const updateSettings = useCallback(
    async (newSettings: Partial<AppSettings>) => {
      if (!authContext?.currentUser) return;
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await updateUserSettings(authContext.currentUser.uid, updatedSettings);
      Object.entries(newSettings).forEach(([key, value]) => {
        logSettingChange(key, value as boolean);
      });
    },
    [authContext?.currentUser, settings]
  );

  const logSession = useCallback(
    async (session: SessionLog) => {
      if (!authContext?.currentUser) return;
      await logUserSession(authContext.currentUser.uid, session);
    },
    [authContext?.currentUser]
  );

  const toggleFavorite = useCallback(
    async (exerciseId: string) => {
      if (!authContext?.currentUser) return;
      const isFavorite = settings.favoriteExercises.includes(exerciseId);
      const newFavorites = isFavorite
        ? settings.favoriteExercises.filter((id) => id !== exerciseId)
        : [...settings.favoriteExercises, exerciseId];
      await updateSettings({ favoriteExercises: newFavorites });
      logFavoriteToggle(exerciseId, !isFavorite);
    },
    [authContext?.currentUser, settings, updateSettings]
  );

  const value = {
    settings,
    history,
    appIsLoading,
    updateSettings,
    logSession,
    toggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
