import React from 'react';
import {
  ArrowRight,
  Compass,
  Video,
  Shield,
  Layers,
  Sparkles,
  Play,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { AppView, UserProfile } from '../types/aiImpact';
import { sounds } from '../utils/soundEffects';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (initialRole?: 'student' | 'teacher' | 'guest') => void;
  onSelectRole: (role: 'student' | 'teacher' | 'guest') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  currentUser,
  onOpenAuth,
  onSelectRole,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* KHỐI TRANG CHỦ (P01) - GIỐNG CHÍNH XÁC ẢNH SỐ 1          */}
      {/* ========================================================= */}

      {/* 1. HERO BANNER (P01) - FULL IMAGE LIKE IMAGE 1 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF8F1] via-[#F4FAF6] to-[#E5F5FD] border-2 border-[#BFE6D0] shadow-sm">
        
        {/* Soft atmospheric gradients */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch relative z-10 min-h-[380px] lg:min-h-[440px]">
          
          {/* Left: Text & Main Actions */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14532D] tracking-tight leading-[1.2] text-balance">
              Em kiến tạo<br />tương lai cùng AI
            </h1>

            <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed max-w-xl">
              Khám phá những vấn đề quanh em, phát triển ý tưởng và tạo ra thay đổi tích cực bằng chính hành động của em.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (!currentUser) {
                    onSelectRole('student');
                  }
                  onNavigate('challenges');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white font-black text-sm rounded-2xl shadow-md shadow-emerald-700/20 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Bắt đầu khám phá</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('report');
                }}
                className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-2xl border-2 border-slate-200 shadow-xs active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Xem demo</span>
              </button>
            </div>

          </div>

          {/* Right: Hero Illustration - Full & uncropped edge-to-edge as in Image 1 */}
          <div className="lg:col-span-6 relative w-full min-h-[280px] sm:min-h-[340px] lg:min-h-full flex items-center justify-center lg:justify-end overflow-hidden">
            <img
              src="/assets/ai_impact/hero_hd.jpg"
              alt="Em kiến tạo tương lai cùng AI"
              className="w-full h-full object-cover object-center lg:rounded-r-3xl transition-transform duration-700 hover:scale-102"
            />
            {/* Subtle soft gradient fade into the left side for seamless blend */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#F4FAF6] via-[#F4FAF6]/40 to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 2. 3 THẺ CHỌN VAI TRÒ CHÍNH (P01) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Dành cho HỌC SINH */}
        <div
          onClick={() => {
            sounds.playClick();
            if (!currentUser) {
              onSelectRole('student');
            }
            onNavigate('challenges');
          }}
          className="bg-white rounded-3xl p-6 border-2 border-emerald-200/90 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-emerald-100 border border-emerald-200 shrink-0 group-hover:scale-105 transition-transform p-0.5">
                <img
                  src="/assets/ai_impact/student_icon.png"
                  alt="Dành cho Học Sinh"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Dành cho HỌC SINH
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Tham gia thử thách, thực hiện dự án, nhận hỗ trợ AI
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#15803D] group-hover:text-white flex items-center justify-center transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: Dành cho GIÁO VIÊN */}
        <div
          onClick={() => {
            sounds.playClick();
            if (currentUser?.role === 'teacher') {
              onNavigate('teacher_dashboard');
            } else {
              onOpenAuth('teacher');
            }
          }}
          className="bg-white rounded-3xl p-6 border-2 border-blue-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-blue-100 border border-blue-200 shrink-0 group-hover:scale-105 transition-transform p-0.5">
                <img
                  src="/assets/ai_impact/teacher_icon.png"
                  alt="Dành cho Giáo Viên"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                Dành cho GIÁO VIÊN
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Quản lý nhóm, hướng dẫn, đánh giá và theo dõi tiến độ
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 3: Dành cho KHÁCH THAM QUAN */}
        <div
          onClick={() => {
            sounds.playClick();
            onSelectRole('guest');
            onNavigate('report');
          }}
          className="bg-white rounded-3xl p-6 border-2 border-purple-200/90 shadow-xs hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-purple-100 border border-purple-200 shrink-0 group-hover:scale-105 transition-transform p-0.5">
                <img
                  src="/assets/ai_impact/guest_icon.png"
                  alt="Dành cho Khách Tham Quan"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                Dành cho KHÁCH THAM QUAN
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Tìm hiểu dự án mẫu, trải nghiệm AI và xem minh chứng
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </section>

      {/* 3. 4 FEATURE BADGES (DƯỚI 3 THẺ VAI TRÒ - P01) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Badge 1: Thử thách đa dạng chủ đề */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            🎯
          </div>
          <div className="text-xs font-black text-slate-800 leading-snug">
            Thử thách đa dạng chủ đề
          </div>
        </div>

        {/* Badge 2: 8 bước dự án rõ ràng */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            📐
          </div>
          <div className="text-xs font-black text-slate-800 leading-snug">
            8 bước dự án rõ ràng
          </div>
        </div>

        {/* Badge 3: AI đồng hành gợi ý và kiểm chứng */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            🤖
          </div>
          <div className="text-xs font-black text-slate-800 leading-snug">
            AI đồng hành gợi ý và kiểm chứng
          </div>
        </div>

        {/* Badge 4: Tạo tác động trong thực tiễn */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            🌍
          </div>
          <div className="text-xs font-black text-slate-800 leading-snug">
            Tạo tác động trong thực tiễn
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* PHẦN GIỚI THIỆU BỔ TRỢ CHI TIẾT BÊN DƯỚI                  */}
      {/* ========================================================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
        
        {/* Tiêu đề giới thiệu */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
            Về dự án giáo dục
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI-IMPACT Em Kiến Tạo: Năng Lực Công Dân Số Thế Kỷ 21
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Mô hình giáo dục tích hợp STEAM và AI dành cho học sinh tiểu học. Giúp các em phát hiện vấn đề thực tiễn, sử dụng AI như bạn đồng hành tư duy, kiểm chứng dữ liệu khách quan và kiến tạo hành động bền vững.
          </p>
        </div>

        {/* Lộ trình tuần tự 6 bước */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Hành trình học tập 6 chặng tuần tự của học sinh:</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700">Quy trình chuẩn</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { num: 'Chặng 1', title: 'Cánh cửa kiến tạo', desc: 'Chọn thử thách & phân vai trò', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
              { num: 'Chặng 2', title: 'Khám phá bài học', desc: 'Xem video & nắm rõ mục tiêu', color: 'bg-teal-50 text-teal-900 border-teal-200' },
              { num: 'Chặng 3', title: 'Dự án 8 bước', desc: 'Khảo sát số liệu thực địa', color: 'bg-sky-50 text-sky-900 border-sky-200' },
              { num: 'Chặng 4', title: 'AI Lab', desc: 'Thảo luận cùng 6 bạn AI', color: 'bg-purple-50 text-purple-900 border-purple-200' },
              { num: 'Chặng 5', title: 'AI Check', desc: 'Đối chiếu & kiểm chứng khoa học', color: 'bg-amber-50 text-amber-900 border-amber-200' },
              { num: 'Chặng 6', title: 'Báo cáo & Gửi cô', desc: 'Tổng kết và nhận khen thưởng', color: 'bg-rose-50 text-rose-900 border-rose-200' },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${step.color} space-y-1.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider opacity-70">
                    {step.num}
                  </div>
                  <div className="text-xs font-black leading-snug">
                    {step.title}
                  </div>
                </div>
                <div className="text-[10px] opacity-80 leading-relaxed font-medium">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video nhúng & 3 nguyên tắc giáo dục */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          
          {/* Cột trái: Khung Video YouTube Giới thiệu */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-md border-2 border-slate-200">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/V9y0hZ30s8A?rel=0"
                title="Giới thiệu AI-IMPACT Em Kiến Tạo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span>Video: Nhập môn Em Là Công Dân Số Kiến Tạo Tương Lai</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Thời lượng: 3:45</span>
            </div>
          </div>

          {/* Cột phải: 3 Nguyên tắc giáo dục vàng */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">1</span>
                <span>AI là bạn đồng hành, không làm thay</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed pl-7 font-medium">
                AI chỉ đưa ra câu hỏi gợi mở, giả thuyết và số liệu tham khảo. Quyết định và quan sát thực địa luôn thuộc về các em.
              </p>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-purple-950">
                <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px]">2</span>
                <span>Không tin ngay – Luôn kiểm chứng</span>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed pl-7 font-medium">
                Mọi thông tin từ AI đều phải qua trạm kiểm chứng thực tế tại Bước 5 (AI Check) bằng ảnh chụp và số đếm cụ thể.
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-blue-950">
                <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px]">3</span>
                <span>Thực hiện tuần tự để đạt kết quả tốt nhất</span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed pl-7 font-medium">
                Học sinh bắt đầu từ Thử thách → Không gian dự án 8 bước → AI Lab → AI Check → Báo cáo và nhận huy hiệu.
              </p>
            </div>
          </div>

        </div>

        {/* Lời chứng thực từ giáo viên & học sinh */}
        <div className="pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 shrink-0 border border-blue-200">
                <img src="/assets/ai_impact/teacher_icon.png" alt="Cô Hoàng Yến" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-black text-slate-900">Cô Hoàng Yến · Giáo viên Chủ nhiệm Khối 5</div>
                <p className="text-slate-600 italic leading-relaxed">
                  “AI-IMPACT giúp các em học sinh không chỉ học thuộc lòng lý thuyết mà thực sự xắn tay áo khảo sát rác, đo điện nước và đưa ra giải pháp bảo vệ môi trường trường học!”
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 shrink-0 border border-emerald-200">
                <img src="/assets/ai_impact/student_icon.png" alt="Minh Anh" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-black text-slate-900">Nguyễn Minh Anh · Trưởng nhóm Mầm Xanh</div>
                <p className="text-slate-600 italic leading-relaxed">
                  “Nhóm em rất thích bạn AI Phân Tích và bạn AI Kiểm Chứng. Nhờ có các bạn mà nhóm em đếm được 12 chai nhựa và giảm xuống chỉ còn 2 chai sau 2 tuần!”
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Nút Kêu gọi Hành động lớn ở cuối */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-black">
              Sẵn sàng trở thành Công Dân Số Kiến Tạo?
            </h4>
            <p className="text-xs text-emerald-100 font-medium">
              Chọn ngay một thử thách để cùng nhóm của em thực hiện dự án thực tế!
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              if (!currentUser) {
                onSelectRole('student');
              }
              onNavigate('challenges');
            }}
            className="px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 active:translate-y-0.5"
          >
            <span>Bắt đầu thử thách ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

    </div>
  );
};
