/**
 * Core types for WonderKids 3D Educational Learning Platform
 */

export type ActiveTab = 'space' | 'science' | 'math' | 'mascot';

export interface PlanetData {
  id: string;
  name: string;
  vietnameseName: string;
  emoji: string;
  color: string;
  textColor: string;
  accentBg: string;
  radiusKm: number;
  gravityMps2: number; // m/s^2
  orbitPeriodDays: number;
  distanceFromSunMillionKm: number;
  funFact: string;
  details: string;
  atmosphere: string;
  moonsCount: number;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ChemicalItem {
  id: string;
  name: string;
  formula: string;
  color: string;
  type: 'acid' | 'base' | 'water' | 'indicator' | 'oil' | 'soap';
  ph: number;
  description: string;
}

export interface BuoyancyItem {
  id: string;
  name: string;
  density: number; // g/cm^3 (water is 1.0)
  volume: number; // cm^3
  mass: number; // grams
  icon: string;
  color: string;
  funFact: string;
  submergedYPercent: number; // estimated resting position % in water
}

export interface MathChallenge {
  id: string;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  options: number[];
  answer: number;
}

export interface BalanceItem {
  id: string;
  name: string;
  weight: number;
  color: string;
  emoji: string;
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: 'space' | 'science' | 'math' | 'mascot';
  unlocked: boolean;
}

export interface MascotCustomization {
  name: string;
  character: 'robot' | 'cat';
  primaryColor: string;
  hat: 'none' | 'astronaut' | 'explorer' | 'graduate' | 'bear';
  accessory: 'wand' | 'magnifier' | 'tablet' | 'star';
  expression: 'happy' | 'wink' | 'excited' | 'curious';
}
