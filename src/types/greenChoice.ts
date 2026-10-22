export type NavTab = 'home' | 'challenges' | 'teacher' | 'profile';

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  points: number;
  durationMinutes: number;
  completed?: boolean;
}

export interface StudentProfile {
  name: string;
  grade: string;
  avatar: string;
  level: number;
  levelTitle: string;
  currentPoints: number;
  maxPoints: number;
  skills: {
    analysis: number; // out of 5
    evidence: number; // out of 5
    criticalThinking: number; // out of 5
    greenAction: number; // out of 5
  };
}

export interface TeacherClassStats {
  className: string;
  completedPercent: number;
  completedStudents: number;
  totalStudents: number;
  topics: {
    name: string;
    icon: string;
    percent: number;
    color: string;
  }[];
  studentsList: {
    id: string;
    name: string;
    avatar: string;
    completedCount: number;
    points: number;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}
