import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
  Play,
  Target,
  BookOpen,
  CheckCircle2,
  Video,
  Lightbulb,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { ChallengeItem, AppView } from '../types/aiImpact';
import { CHALLENGES_LIST } from '../data/aiImpactData';
import { sounds } from '../utils/soundEffects';

interface ChallengesViewProps {
  onSelectChallenge: (challenge: ChallengeItem) => void;
  onNavigate: (view: AppView) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ onSelectChallenge, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState<ChallengeItem | null>(null);
  const [studentNote, setStudentNote] = useState('');

  const categories = ['Tất cả', 'Môi trường', 'Tiết kiệm', 'Sức khỏe', 'An toàn', 'Trường học', 'Khác'];

  const filteredChallenges = CHALLENGES_LIST.filter((item) => {
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Khi chọn một bài học thử thách để xem chi tiết
  const handleOpenLesson = (challenge: ChallengeItem) => {
    sounds.playClick();
    setActiveLesson(challenge);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút TIẾP TỤC chuyển sang Không gian 8 bước (Số 3)
  const handleContinueToProjectSpace = (challenge: ChallengeItem) => {
    sounds.playSuccess();
    onSelectChallenge(challenge);
    onNavigate('project_space');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* NẾU ĐANG XEM CHI TIẾT BÀI HỌC THỬ THÁCH (Giống Em Là Công Dân Số) */}
      {/* ========================================================= */}
      {activeLesson ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Top Bar: Nút quay lại + Tiến trình chặng Số 2 */}
          <div className="bg-white rounded-3xl px-6 py-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveLesson(null);
              }}
              className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Quay lại danh sách 6 thử thách</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                Chặng Số 2: Khám phá thử thách
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Chuẩn bị bước vào Số 3
              </span>
            </div>
          </div>

          {/* Banner Thử Thách & Mục tiêu */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Header thông tin thử thách */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${activeLesson.badgeColor}`}>
                    {activeLesson.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {activeLesson.duration}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Thử thách: {activeLesson.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
                  {activeLesson.description}
                </p>
              </div>

              {/* Nút Tiếp Tục Nhanh ở trên */}
              <button
                onClick={() => handleContinueToProjectSpace(activeLesson)}
                className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:translate-y-0.5"
              >
                <span>TIẾP TỤC → BƯỚC VÀO DỰ ÁN 8 BƯỚC (SỐ 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* =================================================== */}
            {/* 1. MỤC TIÊU BÀI HỌC (Kiến thức, Kỹ năng, Phẩm chất) */}
            {/* =================================================== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                  🎯
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  1. Mục tiêu thử thách (Em sẽ học được gì?)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Kiến thức */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-700" />
                    <span>Về kiến thức:</span>
                  </div>
                  <ul className="text-xs text-emerald-900/90 space-y-1.5 pl-1 font-medium">
                    {activeLesson.objectives.knowledge.map((k, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kỹ năng */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    <span>Về kỹ năng số & AI:</span>
                  </div>
                  <ul className="text-xs text-blue-900/90 space-y-1.5 pl-1 font-medium">
                    {activeLesson.objectives.skills.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Thái độ / Phẩm chất */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                  <div className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-700" />
                    <span>Về thái độ & hành động:</span>
                  </div>
                  <ul className="text-xs text-purple-900/90 space-y-1.5 pl-1 font-medium">
                    {activeLesson.objectives.attitude.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-600 font-bold">✓</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* =================================================== */}
            {/* 2. KHÁM PHÁ (Gắn Video YouTube + Câu hỏi gợi mở)    */}
            {/* =================================================== */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-sm font-bold">
                  🎬
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    2. Khám phá (Video tình huống & vai trò của thử thách)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Xem video ngắn dưới đây để hiểu rõ vấn đề thực tiễn cần giải quyết
                  </p>
                </div>
              </div>

              {/* Responsive Video Frame */}
              <div className="relative rounded-3xl overflow-hidden aspect-video max-w-4xl mx-auto bg-slate-900 shadow-md border-2 border-slate-200">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtubeVideoId}?rel=0`}
                  title={activeLesson.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="text-xs text-slate-600 font-bold text-center">
                📺 {activeLesson.videoTitle}
              </div>

              {/* Câu hỏi suy ngẫm sau video */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>Câu hỏi gợi mở khám phá:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 font-semibold leading-relaxed">
                  “{activeLesson.discoveryPrompt}”
                </p>

                {/* Quick note input */}
                <div className="pt-2">
                  <input
                    type="text"
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    placeholder="Ghi nhanh suy nghĩ hoặc quan sát đầu tiên của em vào đây..."
                    className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* =================================================== */}
            {/* 3. NHIỆM VỤ TRỌNG TÂM CỦA DỰ ÁN 8 BƯỚC              */}
            {/* =================================================== */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                  📋
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  3. Nhiệm vụ trọng tâm của nhóm em
                </h2>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                👉 <strong className="text-slate-900">{activeLesson.coreMission}</strong>
                <p className="text-xs text-slate-500 mt-1">
                  Nhóm sẽ lần lượt trải qua 8 bước: Khám phá → Đặt câu hỏi → Thu thập số liệu → Phân tích cùng AI → Kiểm chứng thực tế → Lập kế hoạch → Hành động → Báo cáo.
                </p>
              </div>
            </div>

            {/* =================================================== */}
            {/* NÚT TIẾP TỤC BẮT ĐẦU KHÔNG GIAN DỰ ÁN 8 BƯỚC        */}
            {/* =================================================== */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveLesson(null);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                ← Chọn thử thách khác
              </button>

              <button
                onClick={() => handleContinueToProjectSpace(activeLesson)}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-black rounded-2xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:translate-y-0.5"
              >
                <span>TIẾP TỤC → BẮT ĐẦU KHÔNG GIAN DỰ ÁN 8 BƯỚC (CHỖ SỐ 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* ========================================================= */
        /* DANH SÁCH 6 THỬ THÁCH TIÊU BIỂU (P04)                     */
        /* ========================================================= */
        <div className="space-y-6">
          
          {/* Header Banner (P04: Thư viện thử thách) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                    Chặng Số 2
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Hệ thống bài học thử thách
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Thư viện thử thách (Số 2)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  Bấm vào thử thách để xem mục tiêu, xem video khám phá và nhấn <strong>TIẾP TỤC</strong> để bước vào dự án 8 bước (Số 3)!
                </p>
              </div>
            </div>

            {/* Search & Topic Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm thử thách..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Topic Dropdown */}
              <div className="relative">
                <button
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span>Chủ đề: {selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Filter Chips Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Challenges 6-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredChallenges.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border-2 border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => handleOpenLesson(item)}
                    className="relative rounded-2xl overflow-hidden aspect-[120/80] bg-slate-100 border border-slate-200/60 cursor-pointer"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-black rounded-full shadow-xs ${item.badgeColor}`}>
                      {item.category}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold bg-black/60 text-white rounded-full flex items-center gap-1 backdrop-blur-xs">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      onClick={() => handleOpenLesson(item)}
                      className="text-base font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Video className="w-3 h-3 text-rose-500" />
                    <span>Có video khám phá</span>
                  </span>

                  <button
                    onClick={() => handleOpenLesson(item)}
                    className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:translate-y-0.5"
                  >
                    <span>Khám phá & Mục tiêu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
