/**
 * Green Choice Lab AI - Phòng Thí Nghiệm Lựa Chọn Bền Vững
 * Exact replica of the reference design with full interactive features.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  Bell,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Users,
  Send,
  CheckCircle,
  Lightbulb,
  Search,
  Brain,
  Leaf,
  Volume2,
  VolumeX,
  Lock,
  Star,
  MoreVertical,
  RotateCw,
  ArrowLeft,
  ArrowRight as BrowserForward,
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

  // Challenge Completed Handler with Victory Confetti
  const handleCompleteChallenge = (challengeId: string, earnedPoints: number) => {
    // Trigger Victory Confetti Animation
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#FBBF24', '#60A5FA', '#F59E0B'],
      });

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
    <div className="min-h-screen bg-[#F0F5F2] text-slate-800 font-['Outfit',sans-serif] selection:bg-emerald-200">
      
      {/* ========================================================= */}
      {/* MACOS BROWSER BAR (Matching the mockup frame)             */}
      {/* ========================================================= */}
      <div className="bg-[#E5E9EC] border-b border-[#CBD5E1] px-4 py-2 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5 mr-3">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block" />
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500">
            <ArrowLeft className="w-3.5 h-3.5 cursor-pointer hover:text-slate-700" />
            <BrowserForward className="w-3.5 h-3.5 text-slate-300" />
            <RotateCw className="w-3.5 h-3.5 cursor-pointer hover:text-slate-700 ml-1" />
          </div>
        </div>

        {/* Address bar pill */}
        <div className="flex-1 max-w-xl mx-4 bg-white rounded-md px-3 py-1 flex items-center gap-2 border border-[#CBD5E1] text-[11px] text-slate-700 shadow-2xs">
          <Lock className="w-3 h-3 text-slate-400" />
          <span className="font-mono text-slate-600">https://www.greenchoicelab.ai</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <Star className="w-3.5 h-3.5 cursor-pointer hover:text-amber-500" />
          <MoreVertical className="w-3.5 h-3.5 cursor-pointer hover:text-slate-700" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* APP TOP NAVIGATION BAR                                    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-17 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Grade Dropdown */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div 
              onClick={() => {
                sounds.playClick();
                setActiveNav('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <img
                src="/assets/extracted/app_logo.png"
                alt="Green Choice Lab AI"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-[#14532D] tracking-tight leading-tight">
                  GREEN CHOICE
                </span>
                <span className="text-xs sm:text-sm font-black text-[#15803D] tracking-wider -mt-0.5 flex items-center gap-0.5">
                  LAB AI
                  <span className="text-xs">🍃</span>
                </span>
              </div>
            </div>

            {/* Grade Selector Pill */}
            <div className="relative ml-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowGradeMenu(!showGradeMenu);
                }}
                className="flex items-center gap-1 px-3 py-1 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] text-xs font-black rounded-full transition-colors cursor-pointer"
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
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveNav('home');
              }}
              className={`flex items-center gap-1.5 text-sm font-black transition-colors ${
                activeNav === 'home'
                  ? 'text-[#15803D]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🏠</span>
              <span>Trang chủ</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveNav('challenges');
              }}
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${
                activeNav === 'challenges'
                  ? 'text-[#15803D]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🏆</span>
              <span>Thử thách</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowTeacherModal(true);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span className="text-base">👥</span>
              <span>Góc giáo viên</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span className="text-base">👤</span>
              <span>Hồ sơ của em</span>
            </button>
          </nav>

          {/* Right: Sound, Notification Bell, User Avatar */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-lg transition-colors border ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                sounds.playClick();
                setHasUnreadNotification(false);
              }}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
              title="Thông báo mới"
            >
              <Bell className="w-4 h-4 text-rose-500" />
              {hasUnreadNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* User Profile Info */}
            <div 
              onClick={() => {
                sounds.playClick();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 cursor-pointer select-none pl-1"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 shrink-0">
                <img
                  src="/assets/extracted/top_avatar.png"
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 leading-tight">
                  {student.name}
                </span>
                <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5 -mt-0.5">
                  <span>⭐ {student.grade}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-5 space-y-5">
        
        {/* ========================================================= */}
        {/* HERO BANNER SECTION (Exact Artwork & Interactive Buttons) */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden rounded-3xl border-2 border-[#BFEAD3] shadow-sm bg-white">
          <img
            src="/assets/extracted/hero_full_banner.png"
            alt="Green Choice Lab AI"
            className="w-full h-auto block select-none"
          />

          {/* Clickable interactive overlay buttons matching exact design hotspots */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveChallenge(challenges[0]);
            }}
            className="absolute left-[2.8%] bottom-[19%] w-[11.2%] h-[16%] opacity-0 hover:opacity-20 bg-white rounded-full cursor-pointer transition-opacity"
            title="Bắt đầu khám phá"
            aria-label="Bắt đầu khám phá"
          />

          <button
            onClick={() => {
              sounds.playClick();
              setActiveNav('challenges');
            }}
            className="absolute left-[14.8%] bottom-[19%] w-[7.8%] h-[16%] opacity-0 hover:opacity-20 bg-emerald-900 rounded-full cursor-pointer transition-opacity"
            title="Xem thử thách"
            aria-label="Xem thử thách"
          />
        </section>

        {/* ========================================================= */}
        {/* MAIN TWO-COLUMN WORKSPACE                                 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: CHALLENGES & STUDENT PROFILE (~65% width)   */}
          {/* ======================================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* CARD 1: THỬ THÁCH HÔM NAY */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
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
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Xem tất cả thử thách</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Challenge Cards Grid (Matching reference layout) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {challenges.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FCFDFB] rounded-2xl p-2.5 border border-[#E2EAE5] flex flex-col justify-between hover:shadow-sm transition-shadow group"
                  >
                    <div>
                      {/* Exact Clean Cropped Banner Graphic */}
                      <div className="relative rounded-xl overflow-hidden aspect-[326/74] bg-[#E8F4EC] mb-2.5 border border-[#E2EAE5]/60">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                        {item.completed && (
                          <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-emerald-600 text-white font-black text-[9px] rounded-full shadow-xs flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" /> Đã xong
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs sm:text-sm font-black text-[#0F172A] leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Capsule Pill Button (Green like image) */}
                    <div className="pt-2.5">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setActiveChallenge(item);
                        }}
                        className="px-4 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
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
            <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                  <span className="text-xl">🏕️</span>
                  <span>Hồ sơ Nhà thám hiểm xanh</span>
                </h2>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowProfileModal(true);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-grid: Left Student Card & Right 4 Competency Bars */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Left Mini Profile Box */}
                <div className="md:col-span-5 flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-emerald-300 shrink-0 shadow-2xs">
                    <img
                      src="/assets/extracted/student_big_avatar.png"
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      {student.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                        🌱
                      </span>
                      <span>Cấp độ {student.level}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium -mt-0.5">
                      {student.levelTitle}
                    </div>
                    {/* Points bar */}
                    <div className="space-y-0.5 pt-0.5">
                      <div className="text-[10px] font-mono font-bold text-slate-500">
                        {student.currentPoints} / {student.maxPoints} điểm
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#15803D] rounded-full transition-all duration-500"
                          style={{ width: `${(student.currentPoints / student.maxPoints) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Competency Columns (Exact replication from image) */}
                <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  
                  {/* Skill 1: Phân tích lựa chọn */}
                  <div className="space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Phân tích lựa chọn
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${(student.skills.analysis / 5) * 100}%` }} />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {student.skills.analysis}/5
                    </div>
                  </div>

                  {/* Skill 2: Sử dụng bằng chứng */}
                  <div className="space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Sử dụng bằng chứng
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#0284C7] rounded-full" style={{ width: `${(student.skills.evidence / 5) * 100}%` }} />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {student.skills.evidence}/5
                    </div>
                  </div>

                  {/* Skill 3: Tư duy phản biện */}
                  <div className="space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#9333EA]">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Tư duy phản biện
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#9333EA] rounded-full" style={{ width: `${(student.skills.criticalThinking / 5) * 100}%` }} />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {student.skills.criticalThinking}/5
                    </div>
                  </div>

                  {/* Skill 4: Hành động xanh */}
                  <div className="space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      Hành động xanh
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${(student.skills.greenAction / 5) * 100}%` }} />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {student.skills.greenAction}/5
                    </div>
                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: AI ĐỒNG HÀNH & GÓC GIÁO VIÊN (~35% width)  */}
          {/* ======================================================= */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* WIDGET 1: AI ĐỒNG HÀNH */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs space-y-3">
              
              {/* Header with Mint Capsule */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-base font-black text-slate-900">
                    AI đồng hành
                  </h2>
                </div>

                <div className="px-2.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-extrabold rounded-full">
                  Cùng em suy nghĩ – Cùng em khám phá
                </div>
              </div>

              {/* Chat Stream */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-emerald-200">
                        <img
                          src="/assets/extracted/robot_clean.png"
                          alt="AI Robot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-300 shrink-0">
                        <img
                          src="/assets/extracted/top_avatar.png"
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        msg.sender === 'ai'
                          ? 'bg-[#EBF7F0] text-slate-800 rounded-tl-xs'
                          : 'bg-[#15803D] text-white rounded-tr-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-0.5 ${
                          msg.sender === 'ai' ? 'text-slate-400' : 'text-emerald-200'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
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
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="absolute right-1.5 top-1.5 p-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-colors cursor-pointer"
                  title="Gửi câu trả lời"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>

              {/* 4 Quick Suggestion Chips (from image) */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['Ví dụ: số liệu', 'Kết quả thí nghiệm', 'Ý kiến chuyên gia', 'Trải nghiệm thực tế'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSendMessage(tag)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[10px] rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

            </section>

            {/* WIDGET 2: GÓC GIÁO VIÊN */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs space-y-3.5">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
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
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Summary: Donut Gauge + Topic Progress */}
              <div className="space-y-3">
                
                {/* Donut Gauge Row */}
                <div className="flex items-center gap-4 p-2 bg-[#F8FAFB] rounded-xl border border-slate-100">
                  {/* Donut graphic */}
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3.6"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#10B981]"
                        strokeDasharray="85, 100"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-black text-xs text-slate-900 font-mono">
                      85%
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-slate-900">
                      Hoàn thành thử thách tuần này
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold font-mono">
                      {TEACHER_DATA.completedStudents} / {TEACHER_DATA.totalStudents} học sinh
                    </div>
                  </div>
                </div>

                {/* Topic Breakdown List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Tiến độ theo chủ đề</span>
                    <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-0.5 cursor-pointer">
                      <span>{TEACHER_DATA.className}</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {TEACHER_DATA.topics.map((topic, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between items-center text-slate-700 font-bold text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <span>{topic.icon}</span>
                            <span>{topic.name}</span>
                          </span>
                          <span className="font-mono text-slate-800 text-[10px]">{topic.percent}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
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
        {/* FOOTER VALUES BAR (Exact 4 pillars from image)            */}
        {/* ========================================================= */}
        <footer className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* 1. An toàn số */}
            <div className="p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  An toàn số
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Sử dụng internet an toàn và có trách nhiệm.
                </div>
              </div>
            </div>

            {/* 2. Tư duy bền vững */}
            <div className="p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  Tư duy bền vững
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Hôm nay em học – ngày mai Trái Đất tươi xanh hơn.
                </div>
              </div>
            </div>

            {/* 3. Học bằng hành động */}
            <div className="p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  Học bằng hành động
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Những lựa chọn nhỏ tạo nên thay đổi lớn.
                </div>
              </div>
            </div>

            {/* 4. Vì một hành tinh xanh */}
            <div className="p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 text-xs">
                🌍
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  Vì một hành tinh
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  xanh hơn cho thế hệ mai sau 💚
                </div>
              </div>
            </div>

          </div>
        </footer>

      </main>

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS                                        */}
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
