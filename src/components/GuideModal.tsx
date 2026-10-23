import React, { useState } from 'react';
import { X, BookOpen, GraduationCap, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStudent: () => void;
  onStartTeacher: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onStartStudent,
  onStartTeacher,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-emerald-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                Hướng dẫn sử dụng nền tảng AI-IMPACT
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Quy trình học tập dự án và quản lý sư phạm cùng AI
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-2xl">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('student');
              }}
              className={`py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Dành cho HỌC SINH 🎒</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('teacher');
              }}
              className={`py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Dành cho GIÁO VIÊN 👩‍🏫</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700">
          {activeTab === 'student' ? (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-medium text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quy trình 6 chặng giúp em hoàn thành một dự án tác động thực tế:</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Chọn Thử thách & Xem video bài học</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Vào mục <strong>Thử thách</strong>, xem video YouTube hướng dẫn về các chủ đề môi trường, rác thải nhựa, tiết kiệm điện nước.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Thực hiện dự án 8 bước</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Vào <strong>Không gian dự án</strong>, thực hiện thu thập dữ liệu (đếm chai nhựa, đo điện nước), ghi nhật ký quan sát và lưu bản nháp lên Firestore.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Thảo luận cùng 6 bạn AI tại AI Lab</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Trò chuyện với AI Đặt câu hỏi, AI Phân tích, AI Ý tưởng để tìm giải pháp cải tiến môi trường trường học.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Kiểm chứng khoa học cùng AI Check</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tải ảnh chụp minh chứng thực địa, đối chiếu ý kiến của AI với thực tế quan sát, không tin ngay mà luôn kiểm chứng!
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Xuất Báo cáo & Gửi cô giáo</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tổng hợp báo cáo, in PDF và gửi nộp cho cô giáo để nhận phản hồi và huy hiệu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs font-medium text-blue-950 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Tính năng sư phạm đồng bộ theo thời gian thực (Real-time Firebase):</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Bảng điều khiển 9 danh mục</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Gồm: Tổng quan, Lớp học, Nhóm học sinh, Dự án, Duyệt kế hoạch, Đánh giá, Báo cáo, Thử thách, Cài đặt.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Duyệt & Phê duyệt kế hoạch trực tiếp</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Xem chi tiết tiến độ 8 bước của từng nhóm học sinh, duyệt kế hoạch hành động và cấp huy hiệu.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Gửi phản hồi & chấm điểm lưu Firebase</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Lời nhận xét của cô giáo được tự động cập nhật ngay trên báo cáo của học sinh theo thời gian thực.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            AI-IMPACT Em Kiến Tạo · Nền tảng STEM & AI Tiểu học
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
                if (activeTab === 'student') {
                  onStartStudent();
                } else {
                  onStartTeacher();
                }
              }}
              className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white font-black text-xs rounded-2xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{activeTab === 'student' ? 'Vào Thử thách học sinh' : 'Vào Bảng điều khiển giáo viên'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
