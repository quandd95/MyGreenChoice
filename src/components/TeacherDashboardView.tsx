import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  School,
  Users,
  FolderKanban,
  ClipboardCheck,
  Star,
  BarChart3,
  Target,
  Settings,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Bell,
  Award,
  BookOpen,
  MessageSquare,
  Printer,
  ChevronRight,
  Volume2,
  VolumeX,
  LogOut,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectData, AppView, UserProfile, UserRole } from '../types/aiImpact';
import { INITIAL_TEACHER_PROJECTS } from '../data/aiImpactData';
import { doc, setDoc, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { sounds } from '../utils/soundEffects';
import { ReportView } from './ReportView';

interface TeacherDashboardViewProps {
  onSelectProject: (proj: ProjectData) => void;
  onNavigate: (view: AppView) => void;
  currentUser: UserProfile;
  onSwitchRole?: (role: UserRole) => void;
  onSignOut?: () => void;
  isMuted?: boolean;
  toggleSound?: () => void;
}

type SidebarTab =
  | 'overview'
  | 'classes'
  | 'groups'
  | 'projects'
  | 'approvals'
  | 'grading'
  | 'reports'
  | 'challenges'
  | 'settings';

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  onSelectProject,
  onNavigate,
  currentUser,
  onSwitchRole,
  onSignOut,
  isMuted = false,
  toggleSound,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');
  const [projectsList, setProjectsList] = useState<ProjectData[]>(INITIAL_TEACHER_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'in_progress' | 'completed'>('all');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [viewingFullReportProject, setViewingFullReportProject] = useState<ProjectData | null>(null);

  // Inspection / Evaluation Modal
  const [inspectingProject, setInspectingProject] = useState<ProjectData | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [awardGrade, setAwardGrade] = useState('Xuất sắc');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ProjectData[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ProjectData);
          });
          setProjectsList(list);
        } else {
          // If Firestore is empty, seed initial projects into Firestore
          seedInitialProjects();
        }
      },
      (error) => {
        console.warn('Firestore real-time sync offline fallback:', error.message);
      }
    );

    return () => unsub();
  }, []);

  // Seed initial projects to Firestore if empty
  const seedInitialProjects = async () => {
    try {
      const snap = await getDocs(collection(db, 'projects'));
      if (snap.empty) {
        for (const proj of INITIAL_TEACHER_PROJECTS) {
          await setDoc(doc(db, 'projects', proj.id), proj, { merge: true });
        }
      }
    } catch {}
  };

  // Dynamic calculations
  const totalGroups = 12; // Matching P11 mockup
  const inProgressCount = projectsList.filter((p) => p.status === 'in_progress').length;
  const pendingCount = projectsList.filter((p) => p.status === 'pending_approval').length;
  const completedCount = projectsList.filter((p) => p.status === 'completed').length;

  // Filter projects for table
  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'all' || p.classId === selectedClass;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Open "Xem" / inspect modal
  const handleOpenInspect = (proj: ProjectData) => {
    sounds.playClick();
    setInspectingProject(proj);
    setFeedbackText(
      proj.teacherFeedback ||
        'Cô đánh giá cao nỗ lực làm việc nhóm của các em! Số liệu thu thập rất xác thực và bài học rút ra có giá trị thực tiễn cao.'
    );
  };

  // Submit approval or request revision
  const handleReviewProject = async (approved: boolean) => {
    if (!inspectingProject) return;
    setIsSavingFeedback(true);
    sounds.playSuccess();

    if (approved) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284C7', '#16A34A', '#F59E0B', '#10B981'],
        });
      } catch {}
    }

    const updated: ProjectData = {
      ...inspectingProject,
      status: approved ? 'completed' : 'in_progress',
      teacherApproved: approved,
      teacherFeedback: feedbackText,
      updatedAt: new Date().toLocaleString('vi-VN'),
    };

    try {
      await setDoc(doc(db, 'projects', inspectingProject.id), updated, { merge: true });
    } catch {}

    setProjectsList((prev) =>
      prev.map((item) => (item.id === inspectingProject.id ? updated : item))
    );

    setIsSavingFeedback(false);
    setInspectingProject(null);
    setToastMessage(
      approved
        ? `Đã duyệt và trao thưởng cho nhóm ${inspectingProject.groupName}!`
        : `Đã gửi góp ý yêu cầu bổ sung cho nhóm ${inspectingProject.groupName}!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sidebar navigation items
  const sidebarItems: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'classes', label: 'Lớp học', icon: School },
    { id: 'groups', label: 'Nhóm học sinh', icon: Users, badge: totalGroups },
    { id: 'projects', label: 'Dự án', icon: FolderKanban },
    { id: 'approvals', label: 'Duyệt kế hoạch', icon: ClipboardCheck, badge: pendingCount },
    { id: 'grading', label: 'Đánh giá', icon: Star },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { id: 'challenges', label: 'Thử thách', icon: Target },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  // If teacher is viewing a student's full report, render the report with a back-to-dashboard bar
  if (viewingFullReportProject) {
    return (
      <div className="h-full flex flex-col overflow-hidden font-['Nunito',sans-serif]">
        <div className="shrink-0 bg-[#0284C7] text-white px-6 py-3 flex items-center justify-between shadow-xs z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setViewingFullReportProject(null);
              }}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>← Quay lại Bảng điều khiển</span>
            </button>
            <span className="text-xs text-sky-100 font-semibold hidden sm:inline">
              Đang xem báo cáo học sinh: <strong>{viewingFullReportProject.title} ({viewingFullReportProject.groupName})</strong>
            </span>
          </div>
          <button
            onClick={() => handleOpenInspect(viewingFullReportProject)}
            className="px-4 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Nhận xét / Duyệt dự án</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ReportView
            project={viewingFullReportProject}
            onUpdateProject={(updated) => {
              setViewingFullReportProject(updated);
              setProjectsList((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item))
              );
            }}
            onNavigate={(view) => {
              if (view === 'teacher_dashboard') {
                setViewingFullReportProject(null);
              } else {
                onNavigate(view);
              }
            }}
            currentUser={currentUser}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F4F7FC] text-slate-800 font-['Nunito',sans-serif] overflow-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TEACHER TOP HEADER BAR (EXACT MOCKUP PANEL 7)            */}
      {/* ========================================================= */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200/90 shadow-2xs z-30 w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left Brand: AI-IMPACT EM KIẾN TẠO */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <span className="text-xl">🌱</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#0F3E76] tracking-tight">
                AI-IMPACT
              </span>
              <span className="text-xs sm:text-sm font-black text-[#16A34A] tracking-wider">
                EM KIẾN TẠO
              </span>
            </div>
            <span className="hidden md:inline-block ml-3 px-2.5 py-0.5 bg-sky-50 text-[#0284C7] text-[11px] font-extrabold rounded-full border border-sky-200">
              Bảng điều khiển giáo viên (P11)
            </span>
          </div>

          {/* Right Controls: Sound, Notification Bell, Teacher Profile */}
          <div className="flex items-center gap-3">
            
            {/* Audio Toggle */}
            {toggleSound && (
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('approvals');
                setStatusFilter('pending_approval');
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Thông báo dự án cần duyệt"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EA580C] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Teacher Profile with Dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer select-none py-1 hover:opacity-90"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#0284C7]/50 p-0.5 bg-blue-50 shrink-0">
                  <img
                    src={currentUser.avatar || '/assets/ai_impact/teacher_icon.png'}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Giáo viên phụ trách
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </div>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <div className="text-xs font-black text-slate-900">{currentUser.displayName}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.email || 'GiaoVien@truonghoc.edu.vn'}</div>
                  </div>

                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Đổi chế độ xem:
                  </div>

                  {onSwitchRole && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSwitchRole('student');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Xem giao diện Học sinh</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  {onSignOut && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2-COLUMN TEACHER DASHBOARD BODY (EXACT P11 STRUCTURE)     */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-[1600px] mx-auto">
        
        {/* LEFT SIDEBAR: P11 Navigation Menu - Fixed height, independently scrolls or stays fixed */}
        <aside className="w-full lg:w-60 bg-white border-r border-slate-200/90 p-3 shrink-0 lg:h-full lg:overflow-y-auto z-10 shadow-2xs">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(item.id);
                    if (item.id === 'approvals') {
                      setStatusFilter('pending_approval');
                    } else if (item.id === 'overview' || item.id === 'projects') {
                      setStatusFilter('all');
                    }
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal shrink-0 ${
                    isActive
                      ? 'bg-[#EBF5FF] text-[#0284C7]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0284C7]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#0284C7] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT MAIN CONTENT AREA - Only this scrolls */}
        <main className="flex-1 h-full overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* VIEW: OVERVIEW (Matching exact Panel 7 in image_8f6ce7bc.png) */}
          {(activeTab === 'overview' || activeTab === 'projects' || activeTab === 'approvals') && (
            <>
              {/* 4 KPI Metric Cards: 12 Nhóm, 8 Đang thực hiện, 3 Chờ duyệt, 5 Đã hoàn thành */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {/* Card 1: 12 Nhóm */}
                <div
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('groups');
                  }}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer"
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#0369A1] tracking-tight">
                    {totalGroups}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                    Nhóm
                  </div>
                </div>

                {/* Card 2: 8 Đang thực hiện */}
                <div
                  onClick={() => {
                    sounds.playClick();
                    setStatusFilter('in_progress');
                  }}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
                    statusFilter === 'in_progress' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200/90'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#16A34A] tracking-tight">
                    {inProgressCount}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                    Dự án đang thực hiện
                  </div>
                </div>

                {/* Card 3: 3 Chờ duyệt */}
                <div
                  onClick={() => {
                    sounds.playClick();
                    setStatusFilter('pending_approval');
                  }}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
                    statusFilter === 'pending_approval' ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-200/90'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#EA580C] tracking-tight">
                    {pendingCount}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                    Chờ duyệt
                  </div>
                </div>

                {/* Card 4: 5 Đã hoàn thành */}
                <div
                  onClick={() => {
                    sounds.playClick();
                    setStatusFilter('completed');
                  }}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
                    statusFilter === 'completed' ? 'border-teal-500 ring-2 ring-teal-100' : 'border-slate-200/90'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#0D9488] tracking-tight">
                    {completedCount}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                    Đã hoàn thành
                  </div>
                </div>
              </div>

              {/* Section: Danh sách dự án (Matching exact Table in P11) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                
                {/* Table Header Controls */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Danh sách dự án
                    </h2>
                    <span className="text-xs font-semibold text-slate-400">
                      ({filteredProjects.length} dự án)
                    </span>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm dự án, nhóm..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    {/* Class selector */}
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        sounds.playClick();
                        setSelectedClass(e.target.value);
                      }}
                      className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="all">Tất cả các lớp</option>
                      <option value="Lớp 5A">Lớp 5A</option>
                      <option value="Lớp 5B">Lớp 5B</option>
                      <option value="Lớp 4A">Lớp 4A</option>
                    </select>

                    {/* Status toggle pill */}
                    {statusFilter !== 'all' && (
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Xóa lọc</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Projects Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-bold text-slate-500">
                        <th className="py-3 px-4 sm:px-6">Tên dự án</th>
                        <th className="py-3 px-4">Nhóm</th>
                        <th className="py-3 px-4">Tiến độ</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4 sm:px-6 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredProjects.map((proj) => {
                        const isCompleted = proj.status === 'completed';
                        const isPending = proj.status === 'pending_approval';

                        return (
                          <tr
                            key={proj.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            {/* Tên dự án */}
                            <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                              <div className="leading-snug">{proj.title}</div>
                              <div className="text-[11px] text-slate-400 font-normal sm:hidden mt-0.5">
                                {proj.classId}
                              </div>
                            </td>

                            {/* Nhóm */}
                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              <span>{proj.groupName}</span>
                            </td>

                            {/* Tiến độ (e.g. 3/8) */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-xs">
                                  {proj.currentStep}/8
                                </span>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                  <div
                                    className={`h-full rounded-full ${
                                      isCompleted
                                        ? 'bg-[#10B981]'
                                        : isPending
                                        ? 'bg-[#EA580C]'
                                        : 'bg-[#0284C7]'
                                    }`}
                                    style={{ width: `${(proj.currentStep / 8) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Trạng thái */}
                            <td className="py-3.5 px-4">
                              {isCompleted ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#137333]">
                                  Hoàn thành
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309]">
                                  Chờ duyệt
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0369A1]">
                                  Đang thực hiện
                                </span>
                              )}
                            </td>

                            {/* Thao tác (Xem) */}
                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              <button
                                onClick={() => handleOpenInspect(proj)}
                                className="text-[#0284C7] hover:text-[#0369A1] hover:underline font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>Xem</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Empty state if search finds nothing */}
                {filteredProjects.length === 0 && (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <div className="text-2xl">🔍</div>
                    <div className="text-xs font-semibold">Không tìm thấy dự án nào phù hợp</div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedClass('all');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                )}

              </div>
            </>
          )}

          {/* VIEW: CLASSES (Lớp học) */}
          {activeTab === 'classes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Quản lý các lớp học tham gia
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  Năm học 2024 - 2025
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Lớp 5A', teacher: 'Cô Trần Hải Yến', students: 32, groups: 6, completed: 3, pending: 2 },
                  { name: 'Lớp 5B', teacher: 'Thầy Lê Văn Hùng', students: 30, groups: 4, completed: 1, pending: 1 },
                  { name: 'Lớp 4A', teacher: 'Cô Nguyễn Mai Hương', students: 28, groups: 2, completed: 1, pending: 0 },
                ].map((cls) => (
                  <div key={cls.name} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900">{cls.name}</span>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                        {cls.students} học sinh
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      GV chủ nhiệm: <strong className="text-slate-700">{cls.teacher}</strong>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 rounded-xl p-2">
                        <div className="text-xs font-bold text-slate-500">Nhóm</div>
                        <div className="text-sm font-extrabold text-[#0369A1]">{cls.groups}</div>
                      </div>
                      <div className="bg-amber-50/60 rounded-xl p-2">
                        <div className="text-xs font-bold text-amber-700">Chờ duyệt</div>
                        <div className="text-sm font-extrabold text-amber-700">{cls.pending}</div>
                      </div>
                      <div className="bg-emerald-50/60 rounded-xl p-2">
                        <div className="text-xs font-bold text-emerald-700">Đã xong</div>
                        <div className="text-sm font-extrabold text-emerald-700">{cls.completed}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedClass(cls.name);
                        setActiveTab('overview');
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Xem danh sách dự án lớp này</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: GROUPS (Nhóm học sinh) */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  12 Nhóm học sinh tham gia dự án
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  Học sinh tiểu học làm việc nhóm
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectsList.slice(0, 12).map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          👥
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">
                            {item.groupName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold">
                            {item.classId} · Trưởng nhóm: {item.studentName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-slate-700 truncate">
                        🎯 {item.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Tiến độ: {item.currentStep}/8 bước</span>
                        <span className="font-bold text-emerald-600">
                          {Math.round((item.currentStep / 8) * 100)}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenInspect(item)}
                      className="w-full py-1.5 text-xs text-[#0284C7] hover:bg-sky-50 font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Xem chi tiết & nhận xét
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: GRADING (Đánh giá) */}
          {activeTab === 'grading' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Bảng tiêu chí đánh giá sư phạm
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  Chuẩn chương trình GDPT 2018
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Phát hiện vấn đề thực tiễn',
                    desc: 'Quan sát tỉ mỉ, tìm ra vấn đề rác thải, điện nước trong lớp học hoặc khuôn viên trường.',
                    points: '25%',
                    badge: 'Thực tế',
                  },
                  {
                    title: '2. Thu thập & Xử lý số liệu',
                    desc: 'Ghi chép số đếm cụ thể, có ảnh chụp minh chứng, biểu đồ trực quan.',
                    points: '25%',
                    badge: 'Khoa học',
                  },
                  {
                    title: '3. Khai thác trợ lý AI có trách nhiệm',
                    desc: 'Hỏi AI các câu hỏi gợi mở, biết kiểm chứng đối chiếu và không phụ thuộc mù quáng.',
                    points: '25%',
                    badge: 'Tư duy phản biện',
                  },
                  {
                    title: '4. Hành động & Thay đổi cộng đồng',
                    desc: 'Thực hiện giải pháp thực tế, dán áp phích, tuyên truyền các bạn cùng hưởng ứng.',
                    points: '25%',
                    badge: 'Lan tỏa',
                  },
                ].map((rubric) => (
                  <div key={rubric.title} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rubric.title}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-full">
                        {rubric.points}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{rubric.desc}</p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                      {rubric.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: REPORTS (Báo cáo) */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Tổng kết báo cáo các nhóm
                </h2>
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    window.print();
                  }}
                  className="px-3.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In / Xuất PDF</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 font-semibold">Tổng dự án</div>
                    <div className="text-xl font-extrabold text-slate-900">{projectsList.length}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <div className="text-xs text-emerald-700 font-semibold">Tỷ lệ hoàn thành</div>
                    <div className="text-xl font-extrabold text-emerald-800">
                      {Math.round((completedCount / projectsList.length) * 100)}%
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-xs text-blue-700 font-semibold">Số liệu thu thập</div>
                    <div className="text-xl font-extrabold text-blue-800">385+ mục</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <div className="text-xs text-amber-700 font-semibold">Huy hiệu trao tặng</div>
                    <div className="text-xl font-extrabold text-amber-800">18 huy hiệu</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                  🌟 <strong>Nhận định sư phạm:</strong> Học sinh các khối 4 và 5 thể hiện sự hứng thú vượt bậc khi được tiếp cận với Trợ lý AI trong vai trò người bạn đồng hành gợi ý. Đa số các nhóm nắm chắc kỹ năng kiểm chứng thông tin thực tế thay vì tin ngay vào kết quả AI.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CHALLENGES (Thử thách) */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Kho thử thách dự án dành cho học sinh
                </h2>
                <span className="text-xs text-slate-500 font-semibold">
                  6 thử thách thực tiễn
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Lớp em giảm rác nhựa', category: 'Môi trường', duration: '30-60 phút', assigned: 'Lớp 5A, 5B' },
                  { title: 'Trường học tiết kiệm điện', category: 'Tiết kiệm', duration: '30-60 phút', assigned: 'Lớp 5A' },
                  { title: 'Góc xanh trường em', category: 'Môi trường', duration: '30-60 phút', assigned: 'Lớp 5A, 4A' },
                  { title: 'Bữa ăn không lãng phí', category: 'Sức khỏe', duration: '30-60 phút', assigned: 'Lớp 5B' },
                  { title: 'Giọt nước quý giá', category: 'Tiết kiệm', duration: '30-60 phút', assigned: 'Lớp 5A' },
                  { title: 'Sân trường sạch đẹp', category: 'Môi trường', duration: '30-60 phút', assigned: 'Lớp 5B' },
                ].map((ch) => (
                  <div key={ch.title} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{ch.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                        {ch.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Thời lượng: {ch.duration} · Đã giao cho: <strong>{ch.assigned}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS (Cài đặt) */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Cài đặt lớp học & Trợ lý AI
              </h2>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4 text-xs text-slate-700">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Tên trường & Khối lớp phụ trách:</label>
                  <input
                    type="text"
                    defaultValue="Trường Tiểu học Thực Nghiệm - Khối 5"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Mức độ hỗ trợ của Trợ lý AI:</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                    <option>Tiểu học (Gợi ý câu hỏi mở, không làm thay học sinh)</option>
                    <option>Khuyến khích phản biện (Nhắc nhở tìm bằng chứng liên tục)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      setToastMessage('Đã lưu cấu hình giáo viên thành công!');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: "Xem" Project Detail & Teacher Evaluation          */}
      {/* ========================================================= */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0284C7] text-white flex items-center justify-between shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-full uppercase">
                    Chi tiết & Duyệt dự án
                  </span>
                  <span className="text-xs text-sky-100 font-semibold">
                    {inspectingProject.classId}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  {inspectingProject.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectingProject(null)}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              {/* Group Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Nhóm: {inspectingProject.groupName}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Trưởng nhóm: <strong className="text-slate-700">{inspectingProject.studentName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Tiến độ hiện tại:</span>
                  <span className="px-3 py-1 bg-white font-extrabold text-blue-700 rounded-full border border-blue-200">
                    Bước {inspectingProject.currentStep} / 8
                  </span>
                </div>
              </div>

              {/* Data collected by students */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>📊</span>
                  <span>Dữ liệu quan sát thực tế (Bước 3):</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Số lượng đếm được</div>
                    <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                      {inspectingProject.step3Data?.itemCount || 12} {inspectingProject.step3Data?.itemType || 'Chai nhựa'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Ngày khảo sát</div>
                    <div className="text-xs font-bold text-slate-700 mt-0.5">
                      {inspectingProject.step3Data?.observationDate || '2024-10-23'}
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Đối chiếu AI Check</div>
                    <div className="text-xs font-bold text-purple-700 mt-0.5">
                      {inspectingProject.aiCheckConclusion === 'supported' ? '✓ Có bằng chứng hỗ trợ' : '⚡ Cần khảo sát thêm'}
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Ghi chú của học sinh:</div>
                    <p className="text-xs text-slate-600 mt-0.5 italic">
                      "{inspectingProject.step3Data?.observationNotes || 'Quan sát trong giờ ra chơi tại khu vực thùng rác cuối lớp.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Evaluation: Grade Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs">
                  Xếp loại & Khen thưởng:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Xuất sắc ⭐', 'Giỏi 🥇', 'Khá 🥈'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setAwardGrade(grade)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        awardGrade === grade
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teacher Feedback Textarea */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-xs">
                  Lời nhận xét động viên của giáo viên:
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Ghi nhận xét, góp ý hướng dẫn nhóm..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white leading-relaxed"
                />

                {/* Quick teacher comment suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold">Mẫu nhanh:</span>
                  {[
                    'Nhóm quan sát rất kỹ, số liệu rõ ràng!',
                    'Ý tưởng sáng tạo, cần thêm ảnh chụp minh chứng.',
                    'Khen ngợi tinh thần làm việc nhóm và ý thức bảo vệ môi trường!',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFeedbackText(preset)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      + {preset.slice(0, 26)}...
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewingFullReportProject(inspectingProject);
                  setInspectingProject(null);
                }}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Xem toàn bộ báo cáo (P10)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewProject(false)}
                  disabled={isSavingFeedback}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Yêu cầu sửa thêm
                </button>

                <button
                  type="button"
                  onClick={() => handleReviewProject(true)}
                  disabled={isSavingFeedback}
                  className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSavingFeedback ? 'Đang lưu...' : 'Duyệt & Trao thưởng'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
