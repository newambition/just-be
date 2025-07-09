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
      className={`fixed top-0 right-0 h-full bg-slate-800/80 backdrop-blur-lg shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-72 sm:w-80 p-6 flex flex-col`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100 font-quicksand">
          Settings
        </h2>
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

      <div className="flex-grow">
        <ul>
          <li className="flex justify-between items-center py-4 border-b border-slate-700">
            <span className="text-slate-200 font-quicksand">
              Haptic Feedback
            </span>
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
            <span className="text-slate-200 font-quicksand">
              Daily Reminders
            </span>
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
      </div>

      {/* Auth Button at Bottom */}
      <div className="mt-auto pt-6 border-t border-slate-700">
        <button
          onClick={handleAuthAction}
          className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors py-3 px-4 rounded-lg font-medium"
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
          <p className="text-slate-400 text-sm text-center mt-2 truncate font-quicksand">
            {currentUser.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
