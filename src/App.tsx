/**
 * Green Choice Lab AI - Phòng Thí Nghiệm Lựa Chọn Bền Vững
 * An educational 3D cartoon learning platform for sustainability & critical thinking.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Users,
  Heart,
  Send,
  Trophy,
  CheckCircle,
  Lightbulb,
  Search,
  Brain,
  Leaf,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NavTab, ChallengeItem, StudentProfile, ChatMessage } from './types/greenChoice';
import { INITIAL_STUDENT, CHALLENGES, TEACHER_DATA } from './data/greenChoiceData';
import { ChallengeModal } from './components/ChallengeModal';
import { TeacherModal } from './components/TeacherModal';
import { ProfileModal } from './components/ProfileModal';
import { sounds } from './utils/soundEffects';

export default function App() {
  // Navigation & Modals
  const [activeNav, setActiveNav] = useState<NavTab>('home');
  const [selectedGrade, setSelectedGrade] = useState('Lớp 5');
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeItem | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  // Student progress state
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [challenges, setChallenges] = useState<ChallengeItem[]>(CHALLENGES);

  // AI Companion Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Em đã dựa vào bằng chứng nào để đưa ra lựa chọn này?',
      timestamp: '10:24',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Audio mute handler
  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.isMuted = next;
    if (!next) sounds.playClick();
  };

  // Challenge Completed Handler
  const handleCompleteChallenge = (challengeId: string, earnedPoints: number) => {
    // Trigger Victory Confetti Animation
    try {
      // Primary burst from center
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#FBBF24', '#60A5FA', '#F59E0B'],
      });

      // Side fireworks cannons for dramatic celebration
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#10B981', '#34D399', '#FBBF24'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#059669', '#60A5FA', '#FBBF24'],
        });
      }, 250);
    } catch {
      // Audio or canvas fallback
    }

    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c))
    );
    setStudent((prev) => {
      const nextPoints = Math.min(prev.maxPoints, prev.currentPoints + earnedPoints);
      return {
        ...prev,
        currentPoints: nextPoints,
        skills: {
          ...prev.skills,
          analysis: Math.min(5, prev.skills.analysis + 1),
          greenAction: Math.min(5, prev.skills.greenAction + 1),
        },
      };
    });
    setActiveChallenge(null);
  };

  // AI Companion Chat handler
  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || chatInput.trim();
    if (!messageText) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsAiThinking(true);

    // AI automated thoughtful response
    setTimeout(() => {
      sounds.playStarCoin();
      let aiReply = 'Rất tuyệt vời! Em đã biết vận dụng bằng chứng khoa học để ra quyết định xanh.';
      if (messageText.includes('số liệu')) {
        aiReply = 'Chính xác! Dựa vào số liệu cụ thể (như 365 chai nhựa/năm) giúp chúng ta thấy rõ tác động thực tế đến môi trường!';
      } else if (messageText.includes('thí nghiệm')) {
        aiReply = 'Thực nghiệm là bằng chứng vững chắc nhất! Em đã quan sát rất tỉ mỉ trong phòng thí nghiệm hôm nay!';
      } else if (messageText.includes('chuyên gia')) {
        aiReply = 'Rất đúng đắn! Lắng nghe các nhà khoa học và chuyên gia môi trường giúp chúng ta có góc nhìn chuẩn xác và tin cậy.';
      } else if (messageText.includes('thực tế')) {
        aiReply = 'Trải nghiệm thực tế tại trường và ở nhà là bài học sống động nhất để hình thành lối sống xanh bền vững!';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiThinking(false);

      // Award +5 points for critical thinking reflection
      setStudent((prev) => ({
        ...prev,
        currentPoints: Math.min(prev.maxPoints, prev.currentPoints + 5),
        skills: {
          ...prev.skills,
          criticalThinking: Math.min(5, prev.skills.criticalThinking + 1),
        },
      }));
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] text-slate-800 font-['Outfit',sans-serif] selection:bg-emerald-200">
      
      {/* ========================================================= */}
      {/* TOP NAVIGATION BAR                                        */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Left: Brand Wordmark + Grade Selector */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div 
              onClick={() => {
                sounds.playClick();
                setActiveNav('home');
              }}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
                <span className="text-xl">🌍</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xl font-black text-[#15803D] tracking-tight">GREEN CHOICE</span>
                </div>
                <div className="flex items-center gap-1 -mt-1.5">
                  <span className="text-sm font-black text-[#047857] tracking-wider">LAB AI</span>
                  <span className="text-xs">🍃</span>
                </div>
              </div>
            </div>

            {/* Grade Selector Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowGradeMenu(!showGradeMenu);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] text-xs font-extrabold rounded-full transition-colors cursor-pointer"
              >
                <span>{selectedGrade}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showGradeMenu && (
                <div className="absolute top-full mt-1.5 left-0 w-28 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {['Lớp 3', 'Lớp 4', 'Lớp 5'].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedGrade(grade);
                        setShowGradeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors ${
                        selectedGrade === grade ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveNav('home');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                activeNav === 'home'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span>🏠</span>
              <span>Trang chủ</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveNav('challenges');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                activeNav === 'challenges'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span>🏆</span>
              <span>Thử thách</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowTeacherModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all whitespace-nowrap"
            >
              <span>👥</span>
              <span>Góc giáo viên</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all whitespace-nowrap"
            >
              <span>👤</span>
              <span>Hồ sơ của em</span>
            </button>
          </nav>

          {/* Right: Sound, Notification & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl transition-colors border ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasUnreadNotification(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Thông báo mới"
            >
              <Bell className="w-4 h-4 text-rose-500" />
              {hasUnreadNotification && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => {
                sounds.playClick();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl cursor-pointer transition-all select-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 leading-tight">
                  {student.name}
                </span>
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                  <span>⭐</span>
                  <span>{student.grade}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER                                            */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ========================================================= */}
        {/* HERO SECTION                                              */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D9F4E5] via-[#E8F8F1] to-[#D5EEFA] border-2 border-[#B9E9CF] p-6 sm:p-8 lg:p-10 shadow-sm">
          
          {/* Subtle background ambient blur circles */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Giant Brand Title */}
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14532D] tracking-tight">
                  GREEN CHOICE LAB AI
                </h1>
                <span className="text-3xl lg:text-4xl">🍃</span>
              </div>

              {/* Sub-pill badge */}
              <div className="inline-block px-4 py-1.5 bg-[#C6F3D7] text-[#166534] text-xs sm:text-sm font-extrabold rounded-full border border-[#A7E8BE]">
                Phòng thí nghiệm lựa chọn bền vững
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed max-w-xl">
                Khám phá vấn đề – Cân nhắc lựa chọn – Kiểm chứng bằng chứng – Hành động có trách nhiệm.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveChallenge(challenges[0]);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white font-black text-sm rounded-2xl shadow-md shadow-emerald-700/20 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>🍃</span>
                  <span>Bắt đầu khám phá</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveNav('challenges');
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-2xl border-2 border-slate-200/90 shadow-xs active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Xem thử thách</span>
                </button>
              </div>

            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-lg border-3 border-white/80 group">
                <img
                  src="/src/assets/images/green_choice_hero_banner_1792657984704.jpg"
                  alt="Green Choice Lab AI - Trẻ em và Trái Đất cùng hành động xanh"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />

                {/* Cartoon Signpost Speech Badge */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 max-w-[210px] p-2.5 bg-[#FFF9E6] border-2 border-[#FDE68A] rounded-2xl shadow-md text-center transform -rotate-1">
                  <p className="text-xs sm:text-sm font-black text-[#92400E] leading-tight">
                    &ldquo;Những lựa chọn nhỏ tạo nên thay đổi lớn&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* TWO-COLUMN WORKSPACE GRID                                 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ======================================================= */}
          {/* LEFT 8 COLUMNS: CHALLENGES & PROFILE                     */}
          {/* ======================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CARD 1: THỬ THÁCH HÔM NAY */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <span>Thử thách hôm nay</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Cùng khám phá và đưa ra những lựa chọn bền vững!
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveNav('challenges');
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Xem tất cả thử thách</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Challenge Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {challenges.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FAFCFB] rounded-2xl p-3 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200/60 mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {item.completed && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white font-extrabold text-[10px] rounded-full shadow-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Đã xong
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setActiveChallenge(item);
                        }}
                        className="w-full py-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Khám phá</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* CARD 2: HỒ SƠ NHÀ THÁM HIỂM XANH */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="text-xl">🏕️</span>
                  <span>Hồ sơ Nhà thám hiểm xanh</span>
                </h2>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowProfileModal(true);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-grid: Left Student Card & Right 4 Competency Bars */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* Left Mini Profile */}
                <div className="md:col-span-5 flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-black text-slate-900">
                      {student.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full w-fit">
                      <span>🌱</span>
                      <span>Cấp độ {student.level} - {student.levelTitle}</span>
                    </div>
                    {/* Points bar */}
                    <div className="space-y-0.5 pt-0.5">
                      <div className="text-[10px] font-mono font-bold text-slate-500">
                        {student.currentPoints} / {student.maxPoints} điểm
                      </div>
                      <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${(student.currentPoints / student.maxPoints) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Competency Bars (Exact layout from image) */}
                <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  {/* Skill 1: Phân tích lựa chọn */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Phân tích lựa chọn
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      {student.skills.analysis}/5
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(student.skills.analysis / 5) * 100}%` }} />
                    </div>
                  </div>

                  {/* Skill 2: Sử dụng bằng chứng */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Sử dụng bằng chứng
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      {student.skills.evidence}/5
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(student.skills.evidence / 5) * 100}%` }} />
                    </div>
                  </div>

                  {/* Skill 3: Tư duy phản biện */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Tư duy phản biện
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      {student.skills.criticalThinking}/5
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(student.skills.criticalThinking / 5) * 100}%` }} />
                    </div>
                  </div>

                  {/* Skill 4: Hành động xanh */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Leaf className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Hành động xanh
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      {student.skills.greenAction}/5
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(student.skills.greenAction / 5) * 100}%` }} />
                    </div>
                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* ======================================================= */}
          {/* RIGHT 4 COLUMNS: AI ĐỒNG HÀNH & GÓC GIÁO VIÊN           */}
          {/* ======================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* WIDGET 1: AI ĐỒNG HÀNH */}
            <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              
              {/* Header with Mint pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-base font-black text-slate-900">
                    AI đồng hành
                  </h2>
                </div>

                <div className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-extrabold rounded-full">
                  Cùng em suy nghĩ – Cùng em khám phá
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-300 bg-emerald-50 shrink-0">
                        <img
                          src="/src/assets/images/ai_companion_robot_1792658019809.jpg"
                          alt="AI Robot"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 shrink-0">
                        <img
                          src={student.avatar}
                          alt="User"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        msg.sender === 'ai'
                          ? 'bg-[#EBF7F0] text-slate-800 rounded-tl-xs border border-emerald-100'
                          : 'bg-[#15803D] text-white rounded-tr-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          msg.sender === 'ai' ? 'text-slate-400' : 'text-emerald-200'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Hãy chia sẻ suy nghĩ của em..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-lg transition-colors cursor-pointer"
                  title="Gửi câu trả lời"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Quick Suggestion Chips (from image) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => handleSendMessage('Ví dụ: số liệu')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Ví dụ: số liệu
                </button>

                <button
                  onClick={() => handleSendMessage('Kết quả thí nghiệm')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Kết quả thí nghiệm
                </button>

                <button
                  onClick={() => handleSendMessage('Ý kiến chuyên gia')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Ý kiến chuyên gia
                </button>

                <button
                  onClick={() => handleSendMessage('Trải nghiệm thực tế')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Trải nghiệm thực tế
                </button>
              </div>

            </section>

            {/* WIDGET 2: GÓC GIÁO VIÊN */}
            <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <span>Góc giáo viên</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Theo dõi tiến bộ và đồng hành cùng học sinh
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowTeacherModal(true);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Summary: Donut Gauge + Topic Progress */}
              <div className="space-y-4">
                
                {/* Donut Gauge Row */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                  {/* Circular progress visual */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray="85, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-black text-sm text-slate-900 font-mono">
                      85%
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-slate-900">
                      Hoàn thành thử thách tuần này
                    </div>
                    <div className="text-xs text-slate-500 font-semibold font-mono">
                      {TEACHER_DATA.completedStudents} / {TEACHER_DATA.totalStudents} học sinh
                    </div>
                  </div>
                </div>

                {/* Topic Breakdown List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Tiến độ theo chủ đề</span>
                    <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                      <span>{TEACHER_DATA.className}</span>
                      <ChevronDown className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {TEACHER_DATA.topics.map((topic, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-slate-700 font-bold text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <span>{topic.icon}</span>
                            <span>{topic.name}</span>
                          </span>
                          <span className="font-mono text-slate-900">{topic.percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${topic.percent}%`,
                              backgroundColor: topic.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </section>

          </div>

        </div>

        {/* ========================================================= */}
        {/* FOOTER BAR / BOTTOM CORE VALUES (EXACT REPLICA OF IMAGE)  */}
        {/* ========================================================= */}
        <footer className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Value 1: An toàn số */}
            <div className="p-3.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  An toàn số
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                  Sử dụng internet an toàn và có trách nhiệm.
                </div>
              </div>
            </div>

            {/* Value 2: Tư duy bền vững */}
            <div className="p-3.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  Tư duy bền vững
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                  Hôm nay em học – ngày mai Trái Đất tươi xanh hơn.
                </div>
              </div>
            </div>

            {/* Value 3: Học bằng hành động */}
            <div className="p-3.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  Học bằng hành động
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                  Những lựa chọn nhỏ tạo nên thay đổi lớn.
                </div>
              </div>
            </div>

            {/* Value 4: Vì một hành tinh xanh */}
            <div className="p-3.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  Vì một hành tinh
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                  xanh hơn cho thế hệ mai sau 💚
                </div>
              </div>
            </div>

          </div>
        </footer>

      </main>

      {/* ========================================================= */}
      {/* MODALS                                                    */}
      {/* ========================================================= */}
      {activeChallenge && (
        <ChallengeModal
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleCompleteChallenge}
        />
      )}

      {showTeacherModal && (
        <TeacherModal onClose={() => setShowTeacherModal(false)} />
      )}

      {showProfileModal && (
        <ProfileModal student={student} onClose={() => setShowProfileModal(false)} />
      )}

    </div>
  );
}
