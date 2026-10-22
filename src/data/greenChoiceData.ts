import { ChallengeItem, StudentProfile, TeacherClassStats } from '../types/greenChoice';

export const INITIAL_STUDENT: StudentProfile = {
  name: 'Nguyễn Minh Anh',
  grade: 'Lớp 5A',
  avatar: '/assets/extracted/student_big_avatar.png',
  level: 3,
  levelTitle: 'Nhà khám phá tích cực',
  currentPoints: 120,
  maxPoints: 200,
  skills: {
    analysis: 4,
    evidence: 3,
    criticalThinking: 4,
    greenAction: 3,
  },
};

export const CHALLENGES: ChallengeItem[] = [
  {
    id: 'bottle_challenge',
    title: 'Bình nước nào là lựa chọn bền vững?',
    description: 'So sánh các loại bình nước và khám phá tác động của chúng đến môi trường.',
    category: 'Rác thải & Tiêu dùng',
    image: '/assets/extracted/clean_bottle.png',
    points: 25,
    durationMinutes: 10,
    completed: false,
  },
  {
    id: 'water_drop_challenge',
    title: 'Mỗi giọt nước quý',
    description: 'Tìm hiểu cách sử dụng nước tiết kiệm và bảo vệ nguồn nước sạch.',
    category: 'Tài nguyên nước',
    image: '/assets/extracted/clean_water.png',
    points: 20,
    durationMinutes: 8,
    completed: false,
  },
  {
    id: 'smart_electricity_challenge',
    title: 'Dùng điện thế nào cho hợp lý?',
    description: 'Khám phá các cách sử dụng điện thông minh và thân thiện với môi trường.',
    category: 'Năng lượng xanh',
    image: '/assets/extracted/clean_electricity.png',
    points: 25,
    durationMinutes: 12,
    completed: false,
  },
  {
    id: 'sorting_waste_challenge',
    title: 'Phân loại rác tại nguồn',
    description: 'Học cách nhận biết rác hữu cơ, rác tái chế và rác vô cơ độc hại.',
    category: 'Rác thải & Tái chế',
    image: '/src/assets/images/water_bottle_challenge_1792657984142.jpg',
    points: 30,
    durationMinutes: 15,
    completed: true,
  },
  {
    id: 'green_transport_challenge',
    title: 'Hành trình xanh đến trường',
    description: 'Tính toán lượng khí phát thải khi đi bộ, đi xe đạp hoặc xe buýt.',
    category: 'Giao thông xanh',
    image: '/src/assets/images/green_choice_hero_banner_1792657984704.jpg',
    points: 20,
    durationMinutes: 10,
    completed: true,
  },
];

export const TEACHER_DATA: TeacherClassStats = {
  className: 'Lớp 5A',
  completedPercent: 85,
  completedStudents: 28,
  totalStudents: 32,
  topics: [
    { name: 'Biến đổi khí hậu', icon: '🌲', percent: 88, color: '#3B82F6' },
    { name: 'Bảo vệ môi trường', icon: '🚯', percent: 81, color: '#0EA5E9' },
    { name: 'Sử dụng tài nguyên', icon: '💡', percent: 76, color: '#F59E0B' },
    { name: 'Lối sống bền vững', icon: '♻️', percent: 90, color: '#10B981' },
  ],
  studentsList: [
    { id: 'st-1', name: 'Nguyễn Minh Anh', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 3, points: 120, status: 'in_progress' },
    { id: 'st-2', name: 'Trần Bảo Ngọc', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 5, points: 195, status: 'completed' },
    { id: 'st-3', name: 'Lê Hoàng Nam', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 4, points: 160, status: 'completed' },
    { id: 'st-4', name: 'Phạm Quỳnh Chi', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 4, points: 150, status: 'completed' },
    { id: 'st-5', name: 'Vũ Đức Duy', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 2, points: 80, status: 'in_progress' },
    { id: 'st-6', name: 'Đỗ Hà Linh', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 5, points: 200, status: 'completed' },
    { id: 'st-7', name: 'Bùi Gia Huy', avatar: '/src/assets/images/student_avatar_minhanh_1792658020076.jpg', completedCount: 1, points: 40, status: 'pending' },
  ],
};
