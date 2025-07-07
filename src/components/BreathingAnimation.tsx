import React, { useState, useEffect } from "react";
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
  // Internal state to manage scale, initialized to 1 (not expanded).
  const [scale, setScale] = useState(1);

  // This effect listens for changes to the `isExpanded` prop and
  // updates the internal scale state, which triggers the transition.
  // This works for both the initial animation and all subsequent phases.
  useEffect(() => {
    const targetScale = isExpanded ? 1.35 : 1;
    setScale(targetScale);
  }, [isExpanded]);

  // Define color schemes for different phases for better visual feedback
  let gradientClasses = "";
  if (phase === BreathingPhase.Inhale) {
    gradientClasses = "from-sky-400 to-indigo-600";
  } else if (phase === BreathingPhase.Exhale) {
    gradientClasses = "from-purple-400 to-indigo-700";
  } else if (phase === BreathingPhase.Hold) {
    gradientClasses = "from-teal-400 to-cyan-600";
  }

  // Manually define the animation styles to avoid class conflicts
  const animationStyle = {
    transition: `transform ${duration}s ease-in-out, background-color ${duration}s ease-in-out`,
    transform: `translateZ(0) scale(${scale})`, // Use the internal 'scale' state
    willChange: "transform",
  };

  const innerAnimationStyle = {
    ...animationStyle,
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center mb-10">
      <div
        className={`absolute w-full h-full rounded-full bg-gradient-to-br ${gradientClasses} opacity-50`}
        style={animationStyle}
      />
      <div
        className={`w-5/6 h-5/6 rounded-full bg-gradient-to-br ${gradientClasses} shadow-2xl shadow-sky-500/30 flex items-center justify-center`}
        style={innerAnimationStyle}
      >
        <span className="text-7xl font-bold text-white tabular-nums font-quicksand">
          {countdown}
        </span>
      </div>
    </div>
  );
};

export default BreathingAnimation;
