import React from "react";
import { BreathingPhase } from "../types";

interface BreathingAnimationProps {
  phase: BreathingPhase;
  duration: number; // in seconds
  countdown: number;
  isExpanded: boolean;
}

const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  phase,
  duration,
  countdown,
  isExpanded,
}) => {
  const scale = isExpanded ? "scale-135" : "scale-100";

  // Define color schemes for different phases for better visual feedback
  let gradientClasses = "";
  if (phase === BreathingPhase.Inhale) {
    gradientClasses = "from-sky-400 to-indigo-600";
  } else if (phase === BreathingPhase.Exhale) {
    gradientClasses = "from-purple-400 to-indigo-700";
  } else if (phase === BreathingPhase.Hold) {
    if (isExpanded) {
      // Hold after Inhale
      gradientClasses = "from-teal-400 to-cyan-600";
    } else {
      // Hold after Exhale
      gradientClasses = "from-purple-500 to-indigo-800";
    }
  }

  // The transition duration should match the step duration to sync animation with the timer.
  const animationStyle = {
    transitionDuration: `${duration}s`,
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div
        className={`absolute w-full h-full rounded-full bg-gradient-to-br ${gradientClasses} opacity-50 transition-[transform,background-color] ease-in-out ${scale} animate-force-gpu`}
        style={animationStyle}
      />
      <div
        className={`w-5/6 h-5/6 rounded-full bg-gradient-to-br ${gradientClasses} shadow-2xl shadow-sky-500/30 flex items-center justify-center transition-[transform,background-color] ${scale} animate-force-gpu`}
        style={{
          ...animationStyle,
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <span className="text-7xl font-bold text-white tabular-nums font-quicksand">
          {countdown}
        </span>
      </div>
    </div>
  );
};

export default BreathingAnimation;
