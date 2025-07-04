import { BreathingPhase, type BreathingExercise } from "./types";
import { FaBrain, FaMoon, FaSun, FaLeaf } from "react-icons/fa";

// --- Exercise Presets ---

export const EXERCISES: BreathingExercise[] = [
  {
    id: "box-breathing",
    title: "Box Breathing",
    description:
      "A simple technique to calm your nerves and enhance focus by equalizing your breath.",
    mood: "Focus & Calm",
    icon: <FaBrain className="text-sky-400" size={32} />,
    totalCycles: 8,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 },
      { phase: BreathingPhase.Hold, duration: 4 },
      { phase: BreathingPhase.Exhale, duration: 4 },
      { phase: BreathingPhase.Hold, duration: 4 },
    ],
  },
  {
    id: "4-7-8-breathing",
    title: "4-7-8 Relaxing Breath",
    description:
      'Known as the "relaxing breath," this pattern helps reduce anxiety and can aid in falling asleep.',
    mood: "Deep Relaxation",
    icon: <FaMoon className="text-indigo-400 " size={32} />,
    totalCycles: 5,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 4 },
      { phase: BreathingPhase.Hold, duration: 7 },
      { phase: BreathingPhase.Exhale, duration: 8 },
    ],
  },
  {
    id: "energizing-breath",
    title: "Morning Energizer",
    description:
      "A quick and powerful exercise to start your day with energy and alertness.",
    mood: "Energy Boost",
    icon: <FaSun className="text-amber-400" size={32} />,
    totalCycles: 10,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 3 },
      { phase: BreathingPhase.Exhale, duration: 3 },
    ],
  },
  {
    id: "grounding-breath",
    title: "Mindful Grounding",
    description:
      "Center yourself in the present moment with this simple, mindful breathing exercise.",
    mood: "Stress Relief",
    icon: <FaLeaf className="text-emerald-400" size={32} />,
    totalCycles: 6,
    pattern: [
      { phase: BreathingPhase.Inhale, duration: 5 },
      { phase: BreathingPhase.Exhale, duration: 7 },
    ],
  },
];
