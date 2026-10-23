import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Camera, FileCheck, Save, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectData, AppView, UserProfile } from '../types/aiImpact';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sounds } from '../utils/soundEffects';

interface AICheckViewProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  onNavigate: (view: AppView) => void;
  currentUser?: UserProfile | null;
}

export const AICheckView: React.FC<AICheckViewProps> = ({
  project,
  onUpdateProject,
  onNavigate,
  currentUser,
}) => {
  const [conclusion, setConclusion] = useState<ProjectData['aiCheckConclusion']>(
    project.aiCheckConclusion || 'supported'
  );
  const [notes, setNotes] = useState(
    'Dữ liệu quan sát thực tế vào thứ Ba khớp một phần với AI: số chai nhựa tập trung sau giờ ra chơi, nhưng nguyên nhân là do các bạn quên bình nước cá nhân ở nhà.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const conclusionOptions = [
    {
      id: 'supported',
      label: 'Ủng hộ gợi ý của AI (khớp một phần)',
      desc: 'Dữ liệu thực tế nhóm thu thập tương đồng với dự đoán của AI.',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
    {
      id: 'insufficient',
      label: 'Chưa đủ bằng chứng để khẳng định',
      desc: 'Cần thêm thời gian hoặc mẫu khảo sát lớn hơn để kết luận chắc chắn.',
      color: 'text-amber-700 bg-amber-50 border-amber-300',
    },
    {
      id: 'contradicting',
      label: 'Trái ngược với gợi ý của AI',
      desc: 'Thực tế diễn ra hoàn toàn khác với phỏng đoán ban đầu của AI.',
      color: 'text-rose-700 bg-rose-50 border-rose-300',
    },
    {
      id: 'needs_more',
      label: 'Cần quan sát thêm 2 ngày nữa',
      desc: 'Nhóm sẽ tiếp tục theo dõi vào thứ Năm và thứ Sáu để có số liệu đầy đủ.',
      color: 'text-blue-700 bg-blue-50 border-blue-300',
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    sounds.playSuccess();

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#60A5FA', '#FBBF24'],
      });
    } catch {}

    const updated: ProjectData = {
      ...project,
      aiCheckConclusion: conclusion,
      updatedAt: new Date().toLocaleString('vi-VN'),
    };

    try {
      await setDoc(doc(db, 'projects', project.id), updated, { merge: true });
    } catch {}

    onUpdateProject(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner (P08) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
            🔍
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Check – Kiểm chứng cùng AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Không tin ngay – luôn đối chiếu với thực tế và bằng chứng khách quan!
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid: AI Suggestion vs Real Observation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Box: Gợi ý của AI */}
        <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black rounded-full uppercase tracking-wider">
                🤖 Gợi ý của AI
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Dự đoán giả thuyết</span>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
              <p className="text-sm font-semibold text-purple-950 leading-relaxed italic">
                “Học sinh lớp 5 thường dùng chai nhựa nhiều nhất vào giờ ra chơi thứ Hai do mới mua nước ngọt từ cổng trường mang vào lớp.”
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-black">Nguồn phân tích:</span>
                <span>Mô hình trợ lý AI phân tích theo mẫu thói quen chung</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-black">Mục đích:</span>
                <span>Gợi ý hướng để nhóm học sinh bắt đầu khảo sát</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 font-semibold border border-slate-200">
            💡 Lời khuyên: AI có thể đưa ra giả định chưa chính xác với hoàn cảnh riêng của lớp em!
          </div>
        </div>

        {/* Right Box: Thực tế em quan sát được */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                🌿 Thực tế em quan sát được
              </span>
              <span className="text-[11px] text-emerald-600 font-black">Dữ liệu Bước 3</span>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>Số liệu nhóm thu thập:</span>
                <span className="font-mono text-base font-black text-emerald-700">
                  {project.step3Data.itemCount} {project.step3Data.itemType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Thời gian khảo sát:</span>
                <span className="font-semibold text-slate-800">
                  {project.step3Data.observationDate} (Giờ ra chơi)
                </span>
              </div>
              <div className="text-xs text-slate-600 pt-1 border-t border-emerald-200/50">
                <span className="font-bold text-slate-700">Ghi chú thực địa: </span>
                <span>{project.step3Data.observationNotes}</span>
              </div>
            </div>

            {/* Photo Evidence Box */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                <img
                  src="/assets/ai_impact/thumb_waste.png"
                  alt="Ảnh minh chứng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-black text-slate-800 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ảnh minh chứng thực tế</span>
                </div>
                <div className="text-slate-500 text-[11px]">Thùng rác lớp 5A và góc hành lang (23/10)</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl text-[11px] text-emerald-800 font-semibold border border-emerald-200">
            ✅ Bằng chứng thực tế do chính nhóm em thu thập luôn là cơ sở quan trọng nhất!
          </div>
        </div>

      </div>

      {/* Conclusion Radio Choices */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <span>Kết luận kiểm chứng của nhóm em:</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Chọn nhận định phản ánh đúng nhất mối quan hệ giữa gợi ý của AI và số liệu thực tế em tìm được:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {conclusionOptions.map((opt) => {
            const isSelected = conclusion === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  sounds.playClick();
                  setConclusion(opt.id as ProjectData['aiCheckConclusion']);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="conclusion"
                  checked={isSelected}
                  onChange={() => setConclusion(opt.id as ProjectData['aiCheckConclusion'])}
                  className="mt-1 w-4 h-4 text-emerald-600 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    {opt.label}
                  </div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed">
                    {opt.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Verification Notes */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-slate-700">
            Giải thích chi tiết nhận định của nhóm em:
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
            placeholder="Ghi rõ tại sao nhóm em đưa ra kết luận trên..."
          />
        </div>
      </div>

      {/* Caution Reminder Banner (Exact from mockup) */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-amber-900 font-medium">
          <strong className="font-black text-amber-950">LƯU Ý QUAN TRỌNG: </strong>
          AI chỉ là công cụ tham khảo và hỗ trợ tư duy. Quan sát thực tế và bằng chứng khách quan do chính em thu thập mới là căn cứ chuẩn xác để ra quyết định!
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('ai_lab');
          }}
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black rounded-2xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại AI Lab (Số 4)</span>
        </button>

        <div className="flex items-center gap-2.5">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-in fade-in">
              ✅ Đã lưu kết quả kiểm chứng!
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu kết quả'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playSuccess();
              handleSave();
              onNavigate('report');
            }}
            className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:translate-y-0.5"
          >
            <span>TIẾP TỤC → HOÀN THÀNH BÁO CÁO DỰ ÁN (SỐ 6)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
