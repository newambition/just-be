import React, { useContext } from "react";
import {
  FaFire,
  FaChartBar,
  FaLungs,
  FaClock,
  FaTrophy,
  FaPlay,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { breathingExercises } from "../data/exercises";

const HistoryPage: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { history } = appContext;
  const {
    counts,
    streak,
    totalBreaths,
    minutesBreathing,
    longestStreak,
    totalSessions,
  } = history;

  const getExerciseDetails = (id: string) => {
    return breathingExercises.find((ex) => ex.id === id);
  };

  // Calculate top exercise
  const getTopExercise = () => {
    if (Object.keys(counts).length === 0) return "None";
    const topExerciseId = Object.entries(counts).sort(
      ([, a], [, b]) => b - a
    )[0][0];
    const exercise = getExerciseDetails(topExerciseId);
    return exercise ? exercise.title.replace("Just... ", "") : "None";
  };

  const statsData = [
    {
      icon: <FaFire className="stats-icon text-amber-500" />,
      number: streak || 0,
      label: "Current Streak",
      unit: "days",
    },
    {
      icon: <FaTrophy className="stats-icon text-yellow-500" />,
      number: getTopExercise(),
      label: "Top Exercise",
      unit: "",
    },
    {
      icon: <FaLungs className="stats-icon text-sky-500" />,
      number: (totalBreaths || 0).toLocaleString(),
      label: "Total Breaths",
      unit: "",
    },
    {
      icon: <FaClock className="stats-icon text-green-500" />,
      number: minutesBreathing || 0,
      label: "Minutes Breathing",
      unit: "min",
    },
    {
      icon: <FaChartBar className="stats-icon text-purple-500" />,
      number: longestStreak || 0,
      label: "Longest Streak",
      unit: "days",
    },
    {
      icon: <FaPlay className="stats-icon text-blue-500" />,
      number: totalSessions || 0,
      label: "Total Sessions",
      unit: "",
    },
  ];

  return (
    <div className="animate-fade-in mx-auto size-full max-w-md overflow-y-auto font-quicksand text-white">
      <div className="p-4 pb-12 pt-6 sm:p-6">
        <h2 className="mb-12 mt-6 text-center text-3xl font-bold  tracking-tight text-slate-100">
          Your Stats
        </h2>

        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stats-card">
              {stat.icon}
              <div className="stats-number">
                {stat.number}
                {stat.unit && (
                  <span className="ml-1 text-sm text-slate-200">
                    {stat.unit}
                  </span>
                )}
              </div>
              <div className="stats-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
