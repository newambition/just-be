import React, { useContext } from "react";
import { FaFire, FaChartBar } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { breathingExercises } from "../data/exercises";

const HistoryPage: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { history } = appContext;
  const { lastSession, counts, streak } = history;

  const getExerciseDetails = (id: string) => {
    return breathingExercises.find((ex) => ex.id === id);
  };

  return (
    <div className="w-full max-w-md mx-auto h-full overflow-y-auto animate-fade-in text-white font-quicksand">
      <div className="p-4 sm:p-6 pb-20 pt-6 ">
        <h2 className="text-3xl font-bold text-center mt-6 mb-4 text-slate-100 tracking-tight">
          Your Journey
        </h2>

        <div className="flex justify-center items-center gap-2 mb-10 text-amber-400">
          <FaFire size={24} />
          <span className="text-2xl font-bold">{streak} Day Streak</span>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-10 shadow-lg">
          <h3 className="text-lg font-semibold text-sky-400 mb-4 ">
            Last Session
          </h3>
          <div className="min-h-[60px] flex items-center">
            {lastSession ? (
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  {getExerciseDetails(lastSession.exerciseId)?.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-100">
                    {getExerciseDetails(lastSession.exerciseId)?.title}
                  </p>
                  <p className="text-sm text-slate-300">
                    {new Date(lastSession.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">
                You haven't completed any sessions yet.
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-cyan-400" size={18} />
            <h3 className="text-lg font-semibold text-cyan-400">
              Session Counts
            </h3>
          </div>
          <div className="min-h-[60px] flex items-start">
            {Object.keys(counts).length > 0 ? (
              <ul className="space-y-3 w-full">
                {Object.entries(counts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([id, count]) => {
                    const exercise = getExerciseDetails(id);
                    if (!exercise) return null;
                    return (
                      <li
                        key={id}
                        className="flex justify-between items-center text-slate-200"
                      >
                        <span>{exercise.title}</span>
                        <span className="font-bold text-sky-300">{count}</span>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p className="text-slate-400">No sessions recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
