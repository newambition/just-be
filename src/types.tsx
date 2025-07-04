import type { ReactNode } from "react";

export enum BreathingPhase {
  Inhale = "Inhale",
  Hold = "Hold",
  Exhale = "Exhale",
}

export interface BreathingStep {
  phase: BreathingPhase;
  duration: number; // in seconds
}

export interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  pattern: BreathingStep[];
  totalCycles: number;
  mood: string;
  icon: ReactNode;
}
