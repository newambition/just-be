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

export interface SessionLog {
  exerciseId: string;
  completedAt: string; // ISO string
}

export interface History {
  lastSession: SessionLog | null;
  counts: { [exerciseId: string]: number };
  streak: number;
  lastSessionDate: string | null; // YYYY-MM-DD
}

export interface AppSettings {
  hapticsEnabled: boolean;
  remindersEnabled: boolean;
  favoriteExercises: string[];
}
