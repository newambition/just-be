import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import { BreathingPhase } from "../types";
import BreathingAnimation from "../components/BreathingAnimation";
import { FaChevronLeft } from "react-icons/fa";
import Countdown from "react-countdown";
import { AppContext } from "../context/AppContext";
import { breathingExercises } from "../data/exercises";
import { useAppLogic } from "../hooks/useAppLogic";

const triggerHapticFeedback = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const ExercisePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { handleCompleteExercise } = useAppLogic();

  const exercise = breathingExercises.find((ex) => ex.id === exerciseId);

  if (!exercise) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-red-400">Exercise not found</h2>
        <button
          onClick={() => handleCompleteExercise()}
          className="mt-4 text-sky-400 hover:text-sky-300"
        >
          Back to exercises
        </button>
      </div>
    );
  }

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

  const onComplete = () => {
    handleCompleteExercise(exercise);
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
      <div className="animate-fade-in flex h-96 flex-col items-center justify-center p-8 text-center">
        <h2 className="font-quicksand text-3xl font-bold text-sky-300">
          Session Complete
        </h2>
        <p className="mt-4 text-center font-quicksand text-lg text-slate-300">
          Great job.
          <br />
          You've completed <br />
          {exercise.title}
        </p>
        <button
          onClick={onComplete}
          className="mt-8 rounded-full bg-sky-500 px-8 py-3 font-quicksand font-bold text-white shadow-lg transition-colors hover:bg-sky-600"
        >
          Done
        </button>
      </div>
    );
  }

  if (sessionState === "ready") {
    return (
      <div className="animate-fade-in relative flex h-[35rem] flex-col items-center justify-center p-8 text-center">
        <div className="text-slate-200m font-quicksand">
          <Countdown
            date={Date.now() + 3000}
            renderer={({ seconds }) => (
              <p className="mb-8 text-5xl font-bold text-sky-300">{seconds}</p>
            )}
            onComplete={startSession}
          />
          <h2 className="text-3xl font-bold text-sky-300">
            Get Ready to Start
          </h2>
        </div>
        <button
          onClick={() => handleCompleteExercise()}
          className="mt-4 font-quicksand text-sm text-slate-300 transition-colors hover:text-slate-200"
        >
          Choose another
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative flex h-[40rem] flex-col items-center justify-between p-4">
      <button
        onClick={() => handleCompleteExercise()}
        className="absolute -left-2 -top-14"
        aria-label="Back to presets"
      >
        <FaChevronLeft className="size-6 text-slate-400 transition-colors hover:text-slate-200" />
      </button>

      <div className="text-center">
        <p
          className={`pt-24 font-quicksand text-3xl font-semibold transition-colors duration-500 ${phaseColor}`}
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

      <div className="mx-auto w-full max-w-xs">
        <svg
          viewBox="0 0 100 20"
          className="h-auto w-full"
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
