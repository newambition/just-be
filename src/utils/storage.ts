const SETTINGS_KEY = "justbe_settings";
const HISTORY_KEY = "justbe_history";

export const getStoredSettings = () => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    const settings = JSON.parse(stored);
    // Ensure all keys exist to prevent errors with older storage formats
    return {
      hapticsEnabled: true,
      remindersEnabled: false,
      favoriteExercises: [],
      ...settings,
    };
  }
  return {
    hapticsEnabled: true,
    remindersEnabled: false,
    favoriteExercises: [],
  };
};

export const setStoredSettings = (settings: any) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getStoredHistory = () => {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (stored) {
    const history = JSON.parse(stored);
    // Ensure all keys exist
    return {
      lastSession: null,
      counts: {},
      streak: 0,
      lastSessionDate: null,
      ...history,
    };
  }
  return { lastSession: null, counts: {}, streak: 0, lastSessionDate: null };
};

export const setStoredHistory = (history: any) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
