import React from 'react';
import { X, Award, CheckCircle, ShieldCheck, Flame } from 'lucide-react';
import { StudentProfile } from '../types/greenChoice';
import { sounds } from '../utils/soundEffects';

interface ProfileModalProps {
  student: StudentProfile;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              🏕️
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-100 tracking-wider uppercase">
                Hồ sơ học tập cá nhân · {student.grade}
              </span>
              <h2 className="text-xl font-black text-white">
                Nhà Thám Hiểm Xanh - {student.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Main ID Card */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-400 shadow-md shrink-0">
              <img 
                src={student.avatar} 
                alt={student.name}
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">{student.name}</h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {student.grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Danh hiệu: <strong className="text-emerald-700">{student.levelTitle}</strong> (Cấp độ {student.level})
              </p>
              
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Tiến độ thăng hạng:</span>
                  <span className="font-mono text-emerald-700">{student.currentPoints} / {student.maxPoints} điểm</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${(student.currentPoints / student.maxPoints) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Competency Bars */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Bộ Kỹ Năng Phát Triển Bền Vững (Dựa trên khung năng lực xanh)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span>💡</span> Phân tích lựa chọn
                  </span>
                  <span className="font-mono text-emerald-600">{student.skills.analysis}/5</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(student.skills.analysis / 5) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span>🔍</span> Sử dụng bằng chứng
                  </span>
                  <span className="font-mono text-blue-600">{student.skills.evidence}/5</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(student.skills.evidence / 5) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span>🧠</span> Tư duy phản biện
                  </span>
                  <span className="font-mono text-purple-600">{student.skills.criticalThinking}/5</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(student.skills.criticalThinking / 5) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span>🌿</span> Hành động xanh
                  </span>
                  <span className="font-mono text-emerald-600">{student.skills.greenAction}/5</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(student.skills.greenAction / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Badges unlocked */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Huy hiệu đã đạt được
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
                <span className="text-2xl">🌱</span>
                <div className="text-xs font-bold text-amber-900">Mầm Xanh Đầu Tiên</div>
                <span className="text-[10px] text-amber-700">Gia nhập phòng lab</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-1">
                <span className="text-2xl">💧</span>
                <div className="text-xs font-bold text-blue-900">Hiệp Sĩ Nước Sạch</div>
                <span className="text-[10px] text-blue-700">Khóa vòi rò rỉ</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                <span className="text-2xl">🍼</span>
                <div className="text-xs font-bold text-emerald-900">Nói Không Nhựa</div>
                <span className="text-[10px] text-emerald-700">Dùng bình inox 180 ngày</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center space-y-1">
                <span className="text-2xl">⚡</span>
                <div className="text-xs font-bold text-purple-900">Ngôi Nhà Xanh</div>
                <span className="text-[10px] text-purple-700">Tắt điện tiết kiệm</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
