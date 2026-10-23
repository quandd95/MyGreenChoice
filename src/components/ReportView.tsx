import React, { useState } from 'react';
import { FileText, Download, Send, CheckCircle2, ArrowLeft, Printer, Award, MessageSquare, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectData, AppView, UserProfile } from '../types/aiImpact';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sounds } from '../utils/soundEffects';

interface ReportViewProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  onNavigate: (view: AppView) => void;
  currentUser?: UserProfile | null;
}

export const ReportView: React.FC<ReportViewProps> = ({
  project,
  onUpdateProject,
  onNavigate,
  currentUser,
}) => {
  const [activeSection, setActiveSection] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleExportPDF = () => {
    sounds.playStarCoin();
    try {
      window.print();
    } catch {
      alert('Đang chuẩn bị bản in PDF...');
    }
  };

  const handleSubmitToTeacher = async () => {
    setIsSubmitting(true);
    sounds.playSuccess();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#60A5FA', '#FBBF24'],
      });
    } catch {}

    const updated: ProjectData = {
      ...project,
      status: 'pending_approval',
      updatedAt: new Date().toLocaleString('vi-VN'),
    };

    try {
      await setDoc(doc(db, 'projects', project.id), updated, { merge: true });
      setSubmittedMessage('Đã gửi báo cáo tới cô Hoàng Yến thành công!');
    } catch {
      setSubmittedMessage('Đã lưu trạng thái nộp báo cáo!');
    } finally {
      setIsSubmitting(false);
      onUpdateProject(updated);
      setTimeout(() => setSubmittedMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 print:bg-white print:p-0">
      
      {/* Top Banner & Control Bar (P10) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                Báo cáo tổng kết dự án
              </span>
              <span className="text-xs text-slate-400 font-semibold">Mã: {project.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {project.title}
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {project.groupName} · {project.classId} · Trưởng nhóm: {project.studentName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {submittedMessage && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200">
              🎉 {submittedMessage}
            </span>
          )}

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-2xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Xuất bản PDF / In</span>
          </button>

          {(!currentUser || currentUser.role === 'student') && (
            <button
              onClick={handleSubmitToTeacher}
              disabled={isSubmitting || project.status === 'completed'}
              className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:translate-y-0.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi...' : project.status === 'pending_approval' ? 'Đã nộp cô duyệt' : 'Gửi giáo viên duyệt'}</span>
            </button>
          )}

          {currentUser?.role === 'teacher' && (
            <button
              onClick={() => onNavigate('teacher_dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Về Bảng điều khiển giáo viên</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Report Document Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
        
        {/* Cover / Title Heading */}
        <div className="text-center pb-6 border-b-2 border-slate-100 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full mb-1">
            <span>🌱</span>
            <span>HỆ THỐNG GIÁO DỤC KIẾN TẠO AI-IMPACT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14532D] tracking-tight">
            BÁO CÁO KẾT QUẢ DỰ ÁN HÀNH ĐỘNG
          </h2>
          <p className="text-base font-bold text-slate-700">
            Chủ đề: {project.title}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-semibold pt-2">
            <span>Tập thể thực hiện: <strong className="text-slate-800">{project.groupName}</strong></span>
            <span>·</span>
            <span>Lớp: <strong className="text-slate-800">{project.classId}</strong></span>
            <span>·</span>
            <span>Giáo viên hướng dẫn: <strong className="text-slate-800">Cô Hoàng Yến</strong></span>
          </div>
        </div>

        {/* Section 1: Tổng quan dự án */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>1. TỔNG QUAN DỰ ÁN</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-4">
            Dự án được khởi xướng nhằm giải quyết vấn đề rác thải nhựa dùng một lần trong không gian lớp học và khuôn viên trường tiểu học. Nhóm học sinh áp dụng quy trình 8 bước giải quyết vấn đề có sự trợ giúp của các bạn AI trong việc phân tích số liệu, phản biện và kiểm chứng thực tế.
          </p>
        </section>

        {/* Section 2: Vấn đề em thấy */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>2. VẤN ĐỀ EM THẤY & QUAN SÁT ĐƯỢC</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-4">
            Mỗi giờ ra chơi, thùng rác cuối lớp 5A và góc hành lang luôn đầy ắp các loại chai nước ngọt, ly nhựa dùng một lần. Điều này không chỉ gây mất mỹ quan lớp học mà còn làm phát sinh lượng lớn rác thải nhựa khó phân hủy.
          </p>
        </section>

        {/* Section 3: Số liệu đã thu thập */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>3. SỐ LIỆU ĐÃ THU THẬP (BƯỚC 3)</span>
          </h3>
          <div className="pl-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {project.step3Data.itemCount}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                {project.step3Data.itemType} quan sát/ngày
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-blue-700 font-mono">
                32/35
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                Bạn học sinh tham gia khảo sát
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-amber-700 font-mono">
                75%
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                Rác phát sinh vào giờ ra chơi
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 italic pl-4">
            * Phương pháp khảo sát: {project.step3Data.observationNotes} (Ngày ghi nhận: {project.step3Data.observationDate}).
          </p>
        </section>

        {/* Section 4: AI đã giúp gì & Kiểm chứng */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>4. AI ĐÃ GIÚP GÌ & EM KIỂM CHỨNG NHƯ THẾ NÀO (BƯỚC 5)</span>
          </h3>
          <div className="pl-4 space-y-2">
            <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs text-purple-950 font-medium leading-relaxed">
              <strong>🤖 AI gợi ý:</strong> Các bạn mua chai nhựa vì tiện lợi từ cổng trường vào thứ Hai.
            </div>
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
              <strong>🔍 Thực tế nhóm kiểm chứng:</strong> Các bạn thực tế muốn uống nước nhưng quên mang bình nước hoặc hết nước giữa buổi. Nhóm đã đối chiếu số liệu và kết luận: <span className="font-bold underline">Cần tạo trạm nước sạch thay vì chỉ cấm mua chai nhựa</span>.
            </div>
          </div>
        </section>

        {/* Section 5: Giải pháp & Hành động */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>5. GIẢI PHÁP & HÀNH ĐỘNG CỤ THỂ CỦA NHÓM</span>
          </h3>
          <ul className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-8 list-disc space-y-1.5">
            <li><strong>Chiến dịch bình nước cá nhân:</strong> 100% thành viên nhóm mang bình nước từ nhà và kêu gọi lớp hưởng ứng.</li>
            <li><strong>Tái sinh chai nhựa cũ:</strong> Gom các chai nhựa sạch làm chậu cây treo tại góc cửa sổ lớp 5A.</li>
            <li><strong>Bảng theo dõi thi đua xanh:</strong> Tuyên dương những bạn kiên trì duy trì tuần lễ không rác nhựa.</li>
          </ul>
        </section>

        {/* Section 6: Kết quả đạt được */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>6. KẾT QUẢ ĐẠT ĐƯỢC SAU 2 TUẦN</span>
          </h3>
          <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-100/70 rounded-2xl border border-emerald-300">
              <div className="text-xs font-bold text-emerald-800">Giảm thiểu rác thải nhựa</div>
              <div className="text-lg font-black text-emerald-950 mt-1">Từ 12 chai → 2 chai/ngày</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Giảm hơn 80% lượng rác phát sinh</div>
            </div>

            <div className="p-3.5 bg-blue-100/70 rounded-2xl border border-blue-300">
              <div className="text-xs font-bold text-blue-800">Góc xanh lớp học</div>
              <div className="text-lg font-black text-blue-950 mt-1">15 chậu cây sen đá</div>
              <div className="text-[11px] text-blue-700 mt-0.5">Được tái chế từ chính các chai đã thu hồi</div>
            </div>
          </div>
        </section>

        {/* Section 7: Bài học & Cảm nghĩ */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>7. BÀI HỌC VÀ CẢM NGHĨ CỦA EM</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-4">
            “Qua dự án này, nhóm em hiểu rằng AI là một người bạn đồng hành rất thông minh để gợi ý ý tưởng, nhưng chính con người và những hành động thực tế mỗi ngày mới làm thay đổi môi trường. Chúng em rất tự hào vì đã cùng nhau làm cho lớp học xanh và sạch đẹp hơn!”
          </p>
        </section>

        {/* Section 8: Minh chứng hình ảnh */}
        <section className="space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <span>8. MINH CHỨNG & HÌNH ẢNH HOẠT ĐỘNG</span>
          </h3>
          <div className="pl-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-2xs">
              <img src="/assets/ai_impact/thumb_waste.png" alt="Khảo sát rác" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-2xs">
              <img src="/assets/ai_impact/thumb_green.png" alt="Trồng cây" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-2xs">
              <img src="/assets/ai_impact/hero_kids.png" alt="Nhóm thực hiện" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Teacher Feedback Box (P10) */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black text-blue-950">
                Nhận xét & Đánh giá của Giáo viên
              </h4>
            </div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
              Cô Hoàng Yến
            </span>
          </div>

          <p className="text-xs sm:text-sm text-blue-900 font-medium leading-relaxed italic">
            “{project.teacherFeedback || 'Dự án của nhóm Mầm Xanh có tính thực tiễn cao, dữ liệu minh chứng rõ ràng và sự phối hợp nhóm rất tốt. Cô đánh giá loại Xuất sắc!'}”
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-blue-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Trạng thái: {project.teacherApproved ? 'Đã phê duyệt hoàn thành' : 'Đang trong danh sách đánh giá của tuần'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
