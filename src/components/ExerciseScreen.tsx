import React, { useState, useEffect, useCallback } from "react";
import type { BreathingExercise } from "../types";
import { BreathingPhase } from "../types";
import BreathingAnimation from "./BreathingAnimation";

interface ExerciseScreenProps {
  exercise: BreathingExercise;
  onComplete: () => void;
}

const ExerciseScreen: React.FC<ExerciseScreenProps> = ({
  exercise,
  onComplete,
}) => {
  const [sessionState, setSessionState] = useState<
    "ready" | "running" | "finished"
  >("ready");
  const [stepIndex, setStepIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [countdown, setCountdown] = useState(exercise.pattern[0].duration);

  const currentStep = exercise.pattern[stepIndex];
  const isExpanded =
    currentStep.phase === BreathingPhase.Inhale ||
    (currentStep.phase === BreathingPhase.Hold &&
      stepIndex > 0 &&
      exercise.pattern[stepIndex - 1].phase === BreathingPhase.Inhale);

  const advanceStep = useCallback(() => {
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < exercise.pattern.length) {
      setStepIndex(nextStepIndex);
      setCountdown(exercise.pattern[nextStepIndex].duration);
    } else {
      const nextCycle = cycle + 1;
      if (nextCycle <= exercise.totalCycles) {
        setCycle(nextCycle);
        setStepIndex(0);
        setCountdown(exercise.pattern[0].duration);
      } else {
        setSessionState("finished");
      }
    }
  }, [stepIndex, cycle, exercise]);

  useEffect(() => {
    if (sessionState !== "running") return;

    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      advanceStep();
    }
  }, [sessionState, countdown, advanceStep]);

  const startSession = () => {
    setSessionState("running");
    setCountdown(exercise.pattern[0].duration);
  };

  const phaseText =
    currentStep.phase === BreathingPhase.Hold ? `Hold` : currentStep.phase;
  const phaseColor = {
    [BreathingPhase.Inhale]: "text-sky-700",
    [BreathingPhase.Hold]: "text-cyan-700",
    [BreathingPhase.Exhale]: "text-indigo-700",
  }[currentStep.phase];

  if (sessionState === "finished") {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center h-96 animate-fade-in">
        <h2 className="text-3xl font-bold text-sky-300">Session Complete</h2>
        <p className="text-slate-300 mt-4 text-lg">
          Great job. You&apos;ve completed the {exercise.title} exercise.
        </p>
        <button
          onClick={onComplete}
          className="mt-8 bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold py-3 px-8 rounded-full shadow-lg"
        >
          Done
        </button>
      </div>
    );
  }

  if (sessionState === "ready") {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center h-96 animate-fade-in">
        <h2 className="text-3xl font-semibold text-gradient tracking-tighter ">
          {exercise.title}
        </h2>
        <p className="text-sky-900/90 mt-6 text-base font-quicksand tracking-tight font-medium">
          {exercise.description}
        </p>
        <button onClick={startSession} className="mt-8 btn-primary">
          Begin
        </button>
        <button
          onClick={onComplete}
          className="mt-4 text-slate-300 hover:text-slate-200 transition-colors text-sm font-quicksand"
        >
          Choose another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 h-[30rem] animate-fade-in">
      <button
        onClick={onComplete}
        className="absolute top-4 left-4 text-slate-800 hover:text-slate-400 transition-colors"
        aria-label="Back to presets"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="text-center">
        <p
          className={`text-3xl font-semibold transition-colors duration-500 font-quicksand ${phaseColor}`}
        >
          {phaseText}
        </p>
      </div>

      <BreathingAnimation
        key={stepIndex}
        phase={currentStep.phase}
        duration={currentStep.duration}
        countdown={countdown}
        isExpanded={isExpanded}
      />

      <div className="text-center">
        <p className="text-slate-400 text-lg">
          Cycle {cycle} of {exercise.totalCycles}
        </p>
      </div>
    </div>
  );
};

export default ExerciseScreen;
