/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AI-IMPACT EM KIẾN TẠO - Nền tảng học tập dự án cùng AI
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Trophy,
  Layers,
  Bot,
  Search,
  FileText,
  Volume2,
  VolumeX,
  LogIn,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { AppView, UserRole, UserProfile, ProjectData, ChallengeItem } from './types/aiImpact';
import {
  INITIAL_STUDENT_USER,
  INITIAL_TEACHER_USER,
  GUEST_USER,
  INITIAL_PROJECT,
} from './data/aiImpactData';
import { HomeView } from './components/HomeView';
import { ChallengesView } from './components/ChallengesView';
import { ProjectSpaceView } from './components/ProjectSpaceView';
import { AILabView } from './components/AILabView';
import { AICheckView } from './components/AICheckView';
import { ReportView } from './components/ReportView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { AuthModal } from './components/AuthModal';
import { GuideModal } from './components/GuideModal';
import { sounds } from './utils/soundEffects';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  // Navigation & User State (Defaults to null - unauthenticated on first visit)
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentProject, setCurrentProject] = useState<ProjectData>(INITIAL_PROJECT);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('student');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sound toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.isMuted = next;
    if (!next) sounds.playClick();
  };

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('ai_impact_current_user');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr) as UserProfile;
        if (savedUser && savedUser.id) {
          setCurrentUser(savedUser);
          if (savedUser.role === 'teacher') {
            setCurrentView('teacher_dashboard');
          }
        }
      }
    } catch {}
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            const profile = snap.data() as UserProfile;
            setCurrentUser(profile);
            localStorage.setItem('ai_impact_current_user', JSON.stringify(profile));
            if (profile.role === 'teacher') {
              setCurrentView('teacher_dashboard');
            }
          }
        } catch {
          // fallback
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to student's active project updates from Firestore
  useEffect(() => {
    if (currentProject.id) {
      const unsub = onSnapshot(doc(db, 'projects', currentProject.id), (snap) => {
        if (snap.exists()) {
          setCurrentProject({ id: snap.id, ...snap.data() } as ProjectData);
        }
      });
      return () => unsub();
    }
  }, [currentProject.id]);

  // Quick Role Switching
  const handleSwitchRole = (newRole: UserRole) => {
    sounds.playStarCoin();
    setShowAccountMenu(false);
    if (newRole === 'student') {
      setCurrentUser(INITIAL_STUDENT_USER);
      setCurrentView('home');
      setNotification('Đã đăng nhập vai trò: Học sinh (Nguyễn Minh Anh) 🎒');
    } else if (newRole === 'teacher') {
      setCurrentUser(INITIAL_TEACHER_USER);
      setCurrentView('teacher_dashboard');
      setNotification('Đã đăng nhập vai trò: Giáo viên (Cô Hoàng Yến) 👩‍🏫');
    } else {
      setCurrentUser(GUEST_USER);
      setCurrentView('home');
      setNotification('Đã đăng nhập vai trò: Khách tham quan 🌟');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {}
    sounds.playClick();
    try {
      localStorage.removeItem('ai_impact_current_user');
    } catch {}
    setCurrentUser(null);
    setCurrentView('home');
    setShowAccountMenu(false);
    setNotification('Đã đăng xuất tài khoản thành công.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Open Auth Modal with specific role
  const handleOpenAuth = (role: UserRole = 'student') => {
    sounds.playClick();
    setAuthInitialRole(role);
    setIsAuthModalOpen(true);
  };

  // Select a challenge to start a project
  const handleSelectChallenge = (challenge: ChallengeItem) => {
    sounds.playClick();
    setCurrentProject((prev) => ({
      ...prev,
      title: challenge.title,
      currentStep: 1,
      status: 'in_progress',
    }));
    // If not logged in, auto start session as student
    if (!currentUser) {
      setCurrentUser(INITIAL_STUDENT_USER);
    }
    setCurrentView('project_space');
  };

  // =========================================================
  // CASE 1: TEACHER ROLE (Render full Teacher layout & header)
  // =========================================================
  if (currentUser?.role === 'teacher') {
    return (
      <div className="h-screen flex flex-col bg-[#F4F7FC] text-slate-800 font-['Nunito',sans-serif] overflow-hidden">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-18 right-5 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
            {notification}
          </div>
        )}

        <TeacherDashboardView
          onSelectProject={(proj) => {
            setCurrentProject(proj);
          }}
          onNavigate={(view) => {
            if (view !== 'teacher_dashboard') {
              setCurrentView(view);
            }
          }}
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onSignOut={handleSignOut}
          isMuted={isMuted}
          toggleSound={toggleSound}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialRole={authInitialRole}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setNotification(`Đăng nhập thành công với vai trò: ${user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}!`);
            setTimeout(() => setNotification(null), 3000);
          }}
        />
      </div>
    );
  }

  // =========================================================
  // CASE 2: UNLOGGED / STUDENT / GUEST ROLE
  // =========================================================
  
  // Navigation items for students & visitors (matching Image 1 P01)
  const navItems = [
    { id: 'home' as AppView, label: 'Trang chủ', icon: Home },
    { id: 'challenges' as AppView, label: 'Thử thách', icon: Trophy },
    { id: 'ai_lab' as AppView, label: 'AI Lab', icon: Bot },
    { id: 'project_space' as AppView, label: 'Dự án của em', icon: Layers },
    ...(currentUser ? [
      { id: 'ai_check' as AppView, label: 'AI Check', icon: Search },
      { id: 'report' as AppView, label: 'Báo cáo', icon: FileText },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F2F7F4] text-slate-800 font-['Nunito',sans-serif] selection:bg-emerald-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-18 right-5 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {notification}
        </div>
      )}

      {/* TOP NAVIGATION BAR (Faithful to Image 1 P01) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                sounds.playClick();
                setCurrentView('home');
              }}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <img
                  src="/assets/ai_impact/logo_banner.png"
                  alt="AI-IMPACT Logo"
                  className="w-full h-full object-contain rounded-[14px] bg-white p-1"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-[#14532D] tracking-tight leading-tight">
                  AI-IMPACT
                </span>
                <span className="text-xs sm:text-sm font-black text-[#15803D] tracking-wider -mt-0.5 flex items-center gap-1">
                  EM KIẾN TẠO
                  <span className="text-xs">🌱</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Matching Image 1 P01 Header) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentView(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Hướng dẫn Link */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsGuideOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-black text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hướng dẫn</span>
            </button>
          </nav>

          {/* Right Actions: Sound & Auth States */}
          <div className="flex items-center gap-2.5">
            
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl transition-colors border cursor-pointer ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* ========================================================= */}
            {/* AUTH STATE A: CHƯA ĐĂNG NHẬP (currentUser === null)        */}
            {/* HIỆN NÚT "ĐĂNG NHẬP" VÀ "TRẢI NGHIỆM" THEO ẢNH 1 P01      */}
            {/* ========================================================= */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                {/* Nút Đăng nhập */}
                <button
                  onClick={() => handleOpenAuth('student')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-2xl border-2 border-slate-200 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đăng nhập</span>
                </button>

                {/* Nút Trải nghiệm (1-chạm vào ngay như trong ảnh 1 P01) */}
                <button
                  onClick={() => {
                    sounds.playStarCoin();
                    setCurrentUser(INITIAL_STUDENT_USER);
                    setNotification('Chào mừng em Nguyễn Minh Anh bắt đầu trải nghiệm! 🎒');
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white font-black text-xs rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trải nghiệm</span>
                </button>
              </div>
            ) : (
              /* ========================================================= */
              /* AUTH STATE B: ĐÃ ĐĂNG NHẬP (ẨN NÚT ĐĂNG NHẬP, HIỆN AVATAR) */
              /* ========================================================= */
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50/60 transition-colors cursor-pointer select-none shadow-2xs"
                  title="Tài khoản của bạn"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-100 border border-emerald-300 shrink-0">
                    <img
                      src={
                        currentUser.avatar ||
                        (currentUser.role === 'guest'
                          ? '/assets/ai_impact/guest_icon.png'
                          : '/assets/ai_impact/student_icon.png')
                      }
                      alt={currentUser.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {currentUser.displayName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {currentUser.role === 'guest'
                        ? 'Khách tham quan'
                        : currentUser.classId || 'Học sinh'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Account & Role Dropdown Menu */}
                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
                        <img
                          src={
                            currentUser.avatar ||
                            (currentUser.role === 'guest'
                              ? '/assets/ai_impact/guest_icon.png'
                              : '/assets/ai_impact/student_icon.png')
                          }
                          alt={currentUser.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {currentUser.displayName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {currentUser.email || 'Thành viên'}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-700">
                          {currentUser.role === 'guest' ? '🌟 Khách tham quan' : '🎒 Học sinh'}
                        </div>
                      </div>
                    </div>

                    {/* Quick Switch Roles */}
                    <div className="px-4 pt-2.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Chuyển đổi vai trò:
                    </div>

                    <button
                      onClick={() => handleSwitchRole('student')}
                      className="w-full text-left px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>🎒</span> <span>Học sinh (Minh Anh)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchRole('teacher')}
                      className="w-full text-left px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>👩‍🏫</span> <span>Giáo viên (Cô Yến)</span>
                    </button>

                    <button
                      onClick={() => handleSwitchRole('guest')}
                      className="w-full text-left px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>🌟</span> <span>Khách tham quan</span>
                    </button>

                    {/* Log out button */}
                    <div className="border-t border-slate-100 mt-2 pt-1 px-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile dropdown navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-black transition-all ${
                      isActive ? 'bg-[#15803D] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsGuideOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-black bg-slate-50 text-slate-700 hover:bg-slate-100"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Hướng dẫn</span>
              </button>
            </div>

            {/* Mobile Auth button */}
            {currentUser && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {currentUser.displayName}
                </span>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-black text-rose-600 bg-rose-50 rounded-xl"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* STUDENT & MAIN WORKSPACE */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {currentView === 'home' && (
          <HomeView
            onNavigate={setCurrentView}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onSelectRole={handleSwitchRole}
          />
        )}

        {currentView === 'challenges' && (
          <ChallengesView
            onSelectChallenge={handleSelectChallenge}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'project_space' && (
          <ProjectSpaceView
            project={currentProject}
            onUpdateProject={setCurrentProject}
            onNavigate={setCurrentView}
            currentUser={currentUser}
          />
        )}

        {currentView === 'ai_lab' && (
          <AILabView onNavigate={setCurrentView} />
        )}

        {currentView === 'ai_check' && (
          <AICheckView
            project={currentProject}
            onUpdateProject={setCurrentProject}
            onNavigate={setCurrentView}
            currentUser={currentUser}
          />
        )}

        {currentView === 'report' && (
          <ReportView
            project={currentProject}
            onUpdateProject={setCurrentProject}
            onNavigate={setCurrentView}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* FOOTER VALUES BAR */}
      <footer className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              🛡️
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">An toàn số</div>
              <div className="text-[10px] text-slate-500 font-medium">Sử dụng AI có trách nhiệm và bảo mật.</div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              🌱
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Tư duy bền vững</div>
              <div className="text-[10px] text-slate-500 font-medium">Hôm nay em học – ngày mai Trái Đất xanh.</div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              🤝
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Học bằng hành động</div>
              <div className="text-[10px] text-slate-500 font-medium">Hành động nhỏ tạo nên thay đổi lớn.</div>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
              🌍
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Vì một hành tinh xanh</div>
              <div className="text-[10px] text-slate-500 font-medium">Kiến tạo tương lai cùng công nghệ số 💚</div>
            </div>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION & REGISTRATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authInitialRole}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'teacher') {
            setCurrentView('teacher_dashboard');
          }
          setNotification(`Đăng nhập thành công với vai trò: ${user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}!`);
          setTimeout(() => setNotification(null), 3000);
        }}
      />

      {/* USER GUIDE MODAL */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartStudent={() => {
          if (!currentUser) {
            handleSwitchRole('student');
          }
          setCurrentView('challenges');
        }}
        onStartTeacher={() => {
          if (currentUser?.role === 'teacher') {
            setCurrentView('teacher_dashboard');
          } else {
            handleOpenAuth('teacher');
          }
        }}
      />

    </div>
  );
}
