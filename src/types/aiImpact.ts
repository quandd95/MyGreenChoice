/**
 * Data contracts for AI-IMPACT EM KIẾN TẠO
 */

export type UserRole = 'student' | 'teacher' | 'guest';

export type AppView =
  | 'home' // Số 1: Trang chủ – Cánh cửa kiến tạo
  | 'challenges' // Số 2: Thư viện thử thách (có mục tiêu, video youtube khám phá)
  | 'project_space' // Số 3: Không gian dự án – 8 bước
  | 'ai_lab' // Số 4: AI Lab – 6 Bạn đồng hành AI
  | 'ai_check' // Số 5: AI Check – Kiểm chứng cùng AI
  | 'report' // Số 6: Báo cáo dự án
  | 'teacher_dashboard'; // Số 7: Bảng điều khiển giáo viên

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  classId?: string;
  groupName?: string;
  avatar?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  category: 'Môi trường' | 'Tiết kiệm' | 'Sức khỏe' | 'An toàn' | 'Trường học' | 'Khác';
  duration: string;
  description: string;
  thumbnail: string;
  badgeColor: string;
  // Hệ thống bài học giống "Em là công dân số"
  objectives: {
    knowledge: string[];
    skills: string[];
    attitude: string[];
  };
  youtubeVideoId: string;
  videoTitle: string;
  discoveryPrompt: string;
  coreMission: string;
}

export interface ProjectStep3Data {
  itemCount: number;
  itemType: string;
  observationDate: string;
  observationNotes: string;
}

export interface ProjectData {
  id: string;
  title: string;
  groupName: string;
  classId: string;
  studentId: string;
  studentName: string;
  currentStep: number; // 1 to 8
  status: 'draft' | 'in_progress' | 'pending_approval' | 'completed';
  step3Data: ProjectStep3Data;
  aiCheckConclusion: 'supported' | 'insufficient' | 'contradicting' | 'needs_more';
  teacherFeedback?: string;
  teacherApproved?: boolean;
  updatedAt?: string;
}

export interface AIAssistant {
  id: string;
  title: string;
  subtitle: string;
  avatarIcon: string;
  bgColor: string;
  systemPrompt: string;
  defaultQuestions: string[];
}
