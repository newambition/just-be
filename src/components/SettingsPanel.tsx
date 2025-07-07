import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { settings, updateSettings } = appContext;

  const handleToggle = (key: "hapticsEnabled" | "remindersEnabled") => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-slate-800/80 backdrop-blur-lg shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-72 sm:w-80 p-6`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <ul>
        <li className="flex justify-between items-center py-4 border-b border-slate-700">
          <span className="text-slate-200">Haptic Feedback</span>
          <button
            onClick={() => handleToggle("hapticsEnabled")}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              settings.hapticsEnabled ? "bg-sky-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                settings.hapticsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </li>
        <li className="flex justify-between items-center py-4 border-b border-slate-700">
          <span className="text-slate-200">Daily Reminders</span>
          <button
            onClick={() => handleToggle("remindersEnabled")}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              settings.remindersEnabled ? "bg-sky-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                settings.remindersEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </li>
      </ul>
      {settings.remindersEnabled && (
        <p className="text-xs text-slate-400 mt-2">
          Reminder notifications are a work in progress.
        </p>
      )}
    </div>
  );
};

export default SettingsPanel;
