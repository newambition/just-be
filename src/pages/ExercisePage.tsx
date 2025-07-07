import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import type { BreathingExercise } from "../types";
import { BreathingPhase } from "../types";
import BreathingAnimation from "../components/BreathingAnimation";
import { FaChevronLeft } from "react-icons/fa";
import Countdown from "react-countdown";
import { AppContext } from "../context/AppContext";

interface ExerciseScreenProps {
  exercise: BreathingExercise;
  onComplete: () => void;
}

const triggerHapticFeedback = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const ExercisePage: React.FC<ExerciseScreenProps> = ({
  exercise,
  onComplete,
}) => {
  const appContext = useContext(AppContext);
  const { settings } = appContext!;

  const [sessionState, setSessionState] = useState<
    "ready" | "running" | "finished"
  >("ready");
  const [stepIndex, setStepIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [countdown, setCountdown] = useState(exercise.pattern[0].duration);
  const progressArcRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  const totalDuration = useMemo(
    () =>
      exercise.pattern.reduce((acc, step) => acc + step.duration, 0) *
      exercise.totalCycles,
    [exercise]
  );

  const currentStep = exercise.pattern[stepIndex];
  const isExpanded =
    currentStep.phase === BreathingPhase.Inhale ||
    (currentStep.phase === BreathingPhase.Hold &&
      stepIndex > 0 &&
      exercise.pattern[stepIndex - 1].phase === BreathingPhase.Inhale);

  const advanceStep = useCallback(() => {
    if (settings.hapticsEnabled) {
      triggerHapticFeedback();
    }

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
  }, [stepIndex, cycle, exercise, settings.hapticsEnabled]);

  useEffect(() => {
    if (sessionState !== "running") return;

    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      advanceStep();
    }
  }, [sessionState, countdown, advanceStep]);

  // Set up path length measurement
  useEffect(() => {
    if (progressArcRef.current) {
      const length = progressArcRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [sessionState]);

  // Pure time-based progress animation
  useEffect(() => {
    if (sessionState !== "running") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    if (sessionStartTimeRef.current === null) {
      sessionStartTimeRef.current = Date.now();
    }

    const updateProgress = () => {
      if (!sessionStartTimeRef.current) return;

      const now = Date.now();
      const elapsedMs = now - sessionStartTimeRef.current;
      const elapsedSeconds = elapsedMs / 1000;

      // Calculate progress as a fraction of total duration
      const newProgress = Math.min(elapsedSeconds / totalDuration, 1);
      setProgress(newProgress);

      if (sessionState === "running" && newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sessionState, totalDuration]);

  // Reset animation when session finishes
  useEffect(() => {
    if (sessionState === "finished" && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setProgress(1); // Ensure progress is complete
    }
  }, [sessionState]);

  const startSession = () => {
    if (settings.hapticsEnabled) {
      triggerHapticFeedback();
    }
    setSessionState("running");
    setCountdown(exercise.pattern[0].duration);
    sessionStartTimeRef.current = Date.now();
    setProgress(0);
  };

  const phaseText =
    currentStep.phase === BreathingPhase.Hold ? `Hold` : currentStep.phase;
  const phaseColor = {
    [BreathingPhase.Inhale]: "text-sky-900",
    [BreathingPhase.Hold]: "text-cyan-900",
    [BreathingPhase.Exhale]: "text-indigo-900",
  }[currentStep.phase];

  if (sessionState === "finished") {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center h-96 animate-fade-in">
        <h2 className="text-3xl font-bold text-sky-300">Session Complete</h2>
        <p className="text-slate-300 mt-4 text-lg">
          Great job.
          <br />
          You've completed the {exercise.title} exercise.
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
      <div className="text-center p-8 flex flex-col items-center justify-center h-[35rem] animate-fade-in relative">
        <div className="text-slate-200m font-quicksand">
          <Countdown
            date={Date.now() + 3000}
            renderer={({ seconds }) => (
              <p className="text-5xl font-bold text-sky-300 mb-8">{seconds}</p>
            )}
            onComplete={startSession}
          />
          <h2 className="text-3xl font-bold text-sky-300">
            Get Ready to Start
          </h2>
        </div>
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
    <div className="flex flex-col items-center justify-between p-4 h-[40rem] animate-fade-in relative">
      <button
        onClick={onComplete}
        className="absolute -top-14 -left-2"
        aria-label="Back to presets"
      >
        <FaChevronLeft className="text-slate-400 hover:text-slate-200 transition-colors h-6 w-6" />
      </button>

      <div className="text-center">
        <p
          className={`text-3xl font-semibold pt-24 transition-colors duration-500 font-quicksand ${phaseColor}`}
        >
          {phaseText}
        </p>
      </div>

      <BreathingAnimation
        phase={currentStep.phase}
        duration={currentStep.duration}
        countdown={countdown}
        isExpanded={isExpanded}
      />

      <div className="w-full max-w-xs mx-auto">
        <svg
          viewBox="0 0 100 20"
          className="w-full h-auto"
          style={{ transform: "translateY(20px) " }}
        >
          <path d="M 5 5 Q 50 30 95 5" className="progress-arc-track" />
          <path
            ref={progressArcRef}
            d="M 5 5 Q 50 30 95 5"
            className="progress-arc-fill"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength * (1 - progress),
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default ExercisePage;
