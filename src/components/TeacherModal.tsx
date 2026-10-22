import React, { useState } from 'react';
import { X, Award, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TEACHER_DATA } from '../data/greenChoiceData';
import { sounds } from '../utils/soundEffects';

interface TeacherModalProps {
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filteredStudents = TEACHER_DATA.studentsList.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-100 tracking-wider uppercase">
                Bảng điều khiển sư phạm · {TEACHER_DATA.className}
              </span>
              <h2 className="text-xl font-black text-white">
                Góc Giáo Viên - Theo Dõi Tiến Bộ
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
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800">Tỷ lệ hoàn thành tuần</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                {TEACHER_DATA.completedPercent}%
              </div>
              <span className="text-xs text-emerald-600">{TEACHER_DATA.completedStudents} / {TEACHER_DATA.totalStudents} học sinh</span>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-xs font-bold text-blue-800">Chủ đề tích cực nhất</span>
              <div className="text-lg font-black text-blue-700 mt-1">
                Lối sống bền vững
              </div>
              <span className="text-xs text-blue-600">Đạt 90% mức độ hưởng ứng</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Hành động cần hỗ trợ</span>
              <div className="text-lg font-black text-amber-700 mt-1">
                Sử dụng tài nguyên
              </div>
              <span className="text-xs text-amber-600">Còn 4 bạn chưa hoàn thành</span>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Danh sách học sinh Lớp 5A
            </h3>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tất cả ({TEACHER_DATA.studentsList.length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Đã xong
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === 'in_progress' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Đang làm
              </button>
            </div>
          </div>

          {/* Students list table */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedStudent(student.name);
                  sounds.playClick();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-emerald-300">
                    <img 
                      src={student.avatar} 
                      alt={student.name}
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{student.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Đã làm: <strong className="text-emerald-600 font-mono">{student.completedCount} thử thách</strong></span>
                      <span>·</span>
                      <span>Điểm: <strong className="text-amber-600 font-mono">{student.points} pts</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {student.status === 'completed' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
                    </span>
                  )}
                  {student.status === 'in_progress' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> Đang học
                    </span>
                  )}
                  {student.status === 'pending' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" /> Chưa bắt đầu
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedStudent && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center justify-between">
              <span>Đang chọn học sinh: <strong>{selectedStudent}</strong></span>
              <button 
                onClick={() => {
                  sounds.playStarCoin();
                  alert(`Đã gửi lời khen và 1 Huy Hiệu Sao Xanh tới ${selectedStudent}!`);
                }}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500"
              >
                Gửi lời khen & Sao thưởng ⭐
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            Đóng bảng theo dõi
          </button>
        </div>
      </div>
    </div>
  );
};
