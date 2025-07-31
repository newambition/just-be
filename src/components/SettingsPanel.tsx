import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";
import { requestNotificationPermission } from "../services/messagingService";
import { auth } from "../firebase";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!appContext || !authContext) return null;

  const { settings, updateSettings } = appContext;
  const { currentUser } = authContext;

  const handleToggle = async (key: "hapticsEnabled" | "remindersEnabled") => {
    if (key === "remindersEnabled") {
      if (!settings.remindersEnabled) {
        // Enabling reminders - request permission first
        if (currentUser) {
          try {
            await requestNotificationPermission(currentUser.uid);
            // The requestNotificationPermission function already updates the database
            // Now update the local app state
            updateSettings({ remindersEnabled: true });
          } catch (error) {
            console.error("Failed to enable reminders:", error);
          }
        }
      } else {
        // Disabling reminders - just update local state
        updateSettings({ remindersEnabled: false });
      }
    } else {
      // For haptics, just toggle normally
      updateSettings({ [key]: !settings[key] });
    }
  };

  const handleAuthAction = async () => {
    if (currentUser) {
      // Logout
      try {
        await signOut(auth);
        onClose(); // Close settings panel after logout
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    } else {
      // Redirect to login
      navigate("/auth");
      onClose(); // Close settings panel
    }
  };

  return (
    <div
      className={`fixed right-0 top-0 z-50 h-full bg-slate-800/80 shadow-2xl backdrop-blur-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } flex w-72 flex-col p-6 sm:w-80`}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-quicksand text-2xl font-bold text-slate-100">
          Settings
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 transition-colors hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
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

      <div className="grow">
        <ul>
          <li className="flex items-center justify-between border-b border-slate-700 py-4">
            <span className="font-quicksand text-slate-200">
              Haptic Feedback
            </span>
            <button
              onClick={() => handleToggle("hapticsEnabled")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.hapticsEnabled ? "bg-sky-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block size-4 rounded-full bg-white transition-transform${
                  settings.hapticsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </li>
          <li className="flex items-center justify-between border-b border-slate-700 py-4">
            <span className="font-quicksand text-slate-200">
              Daily Reminders
            </span>
            <button
              onClick={() => handleToggle("remindersEnabled")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.remindersEnabled ? "bg-sky-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block size-4 rounded-full bg-white transition-transform${
                  settings.remindersEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </li>
        </ul>
      </div>

      {/* Auth Button at Bottom */}
      <div className="mt-auto border-t border-slate-700 pt-6">
        <button
          onClick={handleAuthAction}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-700 px-4 py-3 font-medium text-slate-200 transition-colors hover:bg-slate-600 hover:text-white"
        >
          {currentUser ? (
            <>
              <FaSignOutAlt size={18} />
              <span className="font-quicksand">Sign Out</span>
            </>
          ) : (
            <>
              <FaSignInAlt size={18} />
              <span className="font-quicksand">Sign In</span>
            </>
          )}
        </button>
        {currentUser && (
          <p className="mt-2 truncate text-center font-quicksand text-sm text-slate-400">
            {currentUser.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
