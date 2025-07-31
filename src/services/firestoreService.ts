import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  AppSettings,
  History,
  SessionLog,
  BreathingExercise,
} from "../types";

// Default data for new users
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

// Get user data or create it if it doesn't exist
export const getUserData = async (
  userId: string
): Promise<{ settings: AppSettings; history: History }> => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const data = userDocSnap.data();
    // Merge with defaults to ensure all keys are present
    const userHistory = data.history || {};
    return {
      settings: { ...defaultSettings, ...data.settings },
      history: {
        ...defaultHistory,
        ...userHistory,
        totalBreaths: userHistory.totalBreaths || 0,
        minutesBreathing: userHistory.minutesBreathing || 0,
        longestStreak: userHistory.longestStreak || 0,
        totalSessions: userHistory.totalSessions || 0,
      },
    };
  } else {
    // Create new user document
    const newUser = { settings: defaultSettings, history: defaultHistory };
    await setDoc(userDocRef, newUser);
    return newUser;
  }
};

// Update user settings
export const updateUserSettings = async (
  userId: string,
  settings: Partial<AppSettings>
): Promise<void> => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { settings });
};

// Log a new session and update history
export const logUserSession = async (
  userId: string,
  session: SessionLog
): Promise<void> => {
  const userDocRef = doc(db, "users", userId);
  const userData = (await getDoc(userDocRef)).data() as {
    history: History;
  };

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = userData.history.streak;
  if (userData.history.lastSessionDate === yesterday) {
    newStreak += 1;
  } else if (userData.history.lastSessionDate !== today) {
    newStreak = 1;
  }

  const newCounts = { ...userData.history.counts };
  newCounts[session.exerciseId] = (newCounts[session.exerciseId] || 0) + 1;

  const currentHistory = userData.history;
  const newTotalBreaths =
    (currentHistory.totalBreaths || 0) + session.breathsCount;
  const newMinutesBreathing =
    (currentHistory.minutesBreathing || 0) + Math.round(session.duration / 60);
  const newLongestStreak = Math.max(
    currentHistory.longestStreak || 0,
    newStreak
  );
  const newTotalSessions = (currentHistory.totalSessions || 0) + 1;

  const newHistory: History = {
    lastSession: session,
    counts: newCounts,
    streak: newStreak,
    lastSessionDate: today,
    totalBreaths: newTotalBreaths,
    minutesBreathing: newMinutesBreathing,
    longestStreak: newLongestStreak,
    totalSessions: newTotalSessions,
  };

  await updateDoc(userDocRef, { history: newHistory });
};

// Get all breathing exercises
export const getExercises = async (): Promise<BreathingExercise[]> => {
  const exercisesCol = collection(db, "exercises");
  const exercisesSnapshot = await getDocs(exercisesCol);
  const exercisesList = exercisesSnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as BreathingExercise[];
  return exercisesList;
};
