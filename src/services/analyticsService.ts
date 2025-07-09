import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "../firebase";

const analytics = getAnalytics(app);

// --- Custom Event Logging ---

/**
 * Logs an event when a user completes a breathing exercise.
 * @param exerciseId - The ID of the completed exercise.
 * @param exerciseTitle - The title of the completed exercise.
 */
export const logExerciseCompletion = (
  exerciseId: string,
  exerciseTitle: string
) => {
  logEvent(analytics, "exercise_completed", {
    exercise_id: exerciseId,
    exercise_title: exerciseTitle,
  });
};

/**
 * Logs an event when a user changes a setting.
 * @param setting - The name of the setting that was changed.
 * @param value - The new value of the setting.
 */
export const logSettingChange = (setting: string, value: boolean) => {
  logEvent(analytics, "setting_changed", {
    setting_name: setting,
    setting_value: value,
  });
};

/**
 * Logs an event when a user adds or removes an exercise from their favorites.
 * @param exerciseId - The ID of the exercise.
 * @param isFavorite - Whether the exercise is now a favorite.
 */
export const logFavoriteToggle = (exerciseId: string, isFavorite: boolean) => {
  logEvent(analytics, "favorite_toggled", {
    exercise_id: exerciseId,
    is_favorite: isFavorite,
  });
};
