import { BreathingPhase, type BreathingExercise } from "../types";
import {
  FaBrain,
  FaMoon,
  FaSun,
  FaLeaf,
  FaFeatherAlt,
  FaWater,
  FaWind,
  FaHeartbeat,
} from "react-icons/fa";

// --- Exercise Presets ---

export const breathingExercises: BreathingExercise[] = [
  // --- Renamed Original Exercises ---
  {
    id: "just-center",
    title: "Just... Center",
    description:
      "Find your focus and calm your nerves with this simple, structured breathing pattern.",
    mood: "Focus & Calm",
    icon: <FaBrain className="text-sky-400" size={56} />,
    totalCycles: 8,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 },
      { phase: BreathingPhase.Hold, duration: 4 },
      { phase: BreathingPhase.Exhale, duration: 4 },
      { phase: BreathingPhase.Hold, duration: 4 },
    ],
  },
  {
    id: "just-sleep",
    title: "Just... Sleep",
    description:
      "A powerful relaxing breath known to reduce anxiety and prepare the body for deep rest.",
    mood: "Deep Relaxation",
    icon: <FaMoon className="text-indigo-400" size={56} />,
    totalCycles: 5,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 },
      { phase: BreathingPhase.Hold, duration: 7 },
      { phase: BreathingPhase.Exhale, duration: 8 },
    ],
  },
  {
    id: "just-awaken",
    title: "Just... Awaken",
    description:
      "A quick and powerful exercise to start your day with a boost of natural energy and alertness.",
    mood: "Energy Boost",
    icon: <FaSun className="text-amber-400" size={56} />,
    totalCycles: 10,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 3 },
      { phase: BreathingPhase.Exhale, duration: 3 },
    ],
  },
  {
    id: "just-release",
    title: "Just... Release",
    description:
      "Based on the 'Physiological Sigh,' this rapidly reduces stress by resetting the nervous system.",
    mood: "Instant Relief",
    icon: <FaFeatherAlt className="text-rose-400" size={56} />,
    totalCycles: 5,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 3 }, // Main inhale
      { phase: BreathingPhase.Inhale, duration: 1 }, // Second, sharp inhale
      { phase: BreathingPhase.Exhale, duration: 6 }, // Long, full exhale
    ],
  },
  // --- New Science-Backed Exercises ---
  {
    id: "just-flow",
    title: "Just... Flow",
    description:
      "Known as 'Coherent Breathing,' this balances the heart and mind, building resilience to stress.",
    mood: "Build Resilience",
    icon: <FaWater className="text-teal-400" size={56} />,
    totalCycles: 8,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 5 },
      { phase: BreathingPhase.Exhale, duration: 5 },
    ],
  },
  {
    id: "just-balance",
    title: "Just... Balance",
    description:
      "A simple 'Unilateral' breath to harmonize the left and right sides of the brain, enhancing clarity.",
    mood: "Mental Clarity",
    icon: <FaWind className="text-slate-400" size={56} />,
    totalCycles: 7,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 }, // Inhale Left
      { phase: BreathingPhase.Exhale, duration: 6 }, // Exhale Right
      { phase: BreathingPhase.Inhale, duration: 4 }, // Inhale Right
      { phase: BreathingPhase.Exhale, duration: 6 }, // Exhale Left
    ],
  },
  {
    id: "just-settle",
    title: "Just... Settle",
    description:
      "A foundational 'Diaphragmatic' breath to anchor you in the present and reduce physical tension.",
    mood: "Grounding",
    icon: <FaLeaf className="text-emerald-400" size={56} />,
    totalCycles: 6,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 },
      { phase: BreathingPhase.Exhale, duration: 8 },
    ],
  },
  {
    id: "just-be",
    title: "Just... Be",
    description:
      "A gentle rhythm to bring your heart rate to a resonant frequency, promoting deep, restorative calm.",
    mood: "Restorative Calm",
    icon: <FaHeartbeat className="text-pink-400" size={56} />,
    totalCycles: 7,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 },
      { phase: BreathingPhase.Exhale, duration: 6 },
    ],
  },
];
