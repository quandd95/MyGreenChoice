import React, { useState } from 'react';
import { CheckCircle2, Save, ArrowLeft, ArrowRight, Bot, Lightbulb, Calendar, HelpCircle, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectData, AppView, UserProfile } from '../types/aiImpact';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sounds } from '../utils/soundEffects';

interface ProjectSpaceViewProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  onNavigate: (view: AppView) => void;
  currentUser?: UserProfile | null;
}

export const ProjectSpaceView: React.FC<ProjectSpaceViewProps> = ({
  project,
  onUpdateProject,
  onNavigate,
  currentUser,
}) => {
  const [activeStep, setActiveStep] = useState<number>(project.currentStep || 3);
  const [itemCount, setItemCount] = useState<number>(project.step3Data.itemCount || 12);
  const [itemType, setItemType] = useState<string>(project.step3Data.itemType || 'Chai nhựa');
  const [observationDate, setObservationDate] = useState<string>(project.step3Data.observationDate || '2024-10-23');
  const [observationNotes, setObservationNotes] = useState<string>(
    project.step3Data.observationNotes || 'Quan sát trong giờ ra chơi.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const stepsList = [
    { num: 1, title: 'Khám phá' },
    { num: 2, title: 'Đặt câu hỏi' },
    { num: 3, title: 'Thu thập' },
    { num: 4, title: 'Phân tích' },
    { num: 5, title: 'Kiểm chứng' },
    { num: 6, title: 'Lập kế hoạch' },
    { num: 7, title: 'Hành động' },
    { num: 8, title: 'Báo cáo' },
  ];

  // Save to Firebase Firestore
  const handleSaveDraft = async () => {
    setIsSaving(true);
    sounds.playClick();

    const updated: ProjectData = {
      ...project,
      currentStep: activeStep,
      step3Data: {
        itemCount,
        itemType,
        observationDate,
        observationNotes,
      },
      updatedAt: new Date().toLocaleString('vi-VN'),
    };

    try {
      await setDoc(doc(db, 'projects', project.id), updated, { merge: true });
      setSaveStatus('Đã lưu dữ liệu vào Firebase!');
    } catch {
      setSaveStatus('Đã lưu bản nháp cục bộ!');
    } finally {
      setIsSaving(false);
      onUpdateProject(updated);
      setTimeout(() => setSaveStatus(''), 2500);
    }
  };

  const handleNextStep = async () => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#60A5FA', '#FBBF24'],
      });
    } catch {}

    const next = Math.min(8, activeStep + 1);
    const updated: ProjectData = {
      ...project,
      currentStep: next,
      step3Data: {
        itemCount,
        itemType,
        observationDate,
        observationNotes,
      },
      updatedAt: new Date().toLocaleString('vi-VN'),
    };

    setActiveStep(next);
    onUpdateProject(updated);

    try {
      await setDoc(doc(db, 'projects', project.id), updated, { merge: true });
    } catch {}
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Project Bar (P06 Header) */}
      <div className="bg-white rounded-3xl px-6 py-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Dự án của em:</span>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {project.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-0.5">
              <span>{project.groupName}</span>
              <span>·</span>
              <span className="font-mono text-emerald-700 font-bold">{activeStep}/8 bước</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {saveStatus && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in">
              ✅ {saveStatus}
            </span>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu & Thoát'}</span>
          </button>
        </div>

      </div>

      {/* Main Workspace Split: Left 8-Step Navigation + Center Step 3 Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: 8 Steps Index Navigation */}
        <div className="lg:col-span-3 space-y-2 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs h-fit">
          <div className="px-2 pb-2 text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quy trình 8 bước</span>
          </div>

          <div className="space-y-1">
            {stepsList.map((st) => (
              <button
                key={st.num}
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(st.num);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  activeStep === st.num
                    ? 'bg-[#15803D] text-white shadow-xs scale-101'
                    : st.num < activeStep
                    ? 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    activeStep === st.num
                      ? 'bg-white text-emerald-800'
                      : st.num < activeStep
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {st.num}
                  </span>
                  <span>{st.title}</span>
                </div>

                {st.num < activeStep && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Right Column: Main Step Working Canvas */}
        <div className="lg:col-span-9 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Active Step Content Header */}
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full">
                Bước {activeStep}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {activeStep === 3
                  ? 'Bước 3 – Thu thập dữ liệu'
                  : activeStep === 1
                  ? 'Bước 1 – Khám phá vấn đề'
                  : activeStep === 2
                  ? 'Bước 2 – Đặt câu hỏi nghiên cứu'
                  : activeStep === 4
                  ? 'Bước 4 – Phân tích số liệu'
                  : activeStep === 5
                  ? 'Bước 5 – Kiểm chứng cùng AI'
                  : activeStep === 6
                  ? 'Bước 6 – Lập kế hoạch hành động'
                  : activeStep === 7
                  ? 'Bước 7 – Hành động thực tế'
                  : 'Bước 8 – Báo cáo tổng kết'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1">
              {activeStep === 3
                ? 'Hãy cùng nhóm khảo sát số chai nhựa dùng một lần trong lớp. Ghi lại kết quả em quan sát được.'
                : 'Thực hiện nhiệm vụ học tập theo hướng dẫn dưới đây.'}
            </p>
          </div>

          {/* Step 3 Form Layout (Exact from P06 in mockup) */}
          {activeStep === 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Form: Inputs */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Field 1: Số chai nhựa quan sát được */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Số chai nhựa quan sát được (*)</span>
                    <span className="text-[11px] text-slate-400">Đếm theo ngày</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={itemCount}
                      onChange={(e) => setItemCount(Number(e.target.value))}
                      className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Chai nhựa">Chai nhựa dùng 1 lần</option>
                      <option value="Hộp xốp">Hộp xốp đựng đồ ăn</option>
                      <option value="Ly nhựa">Ly nhựa trà sữa</option>
                      <option value="Túi nilon">Túi nilon mỏng</option>
                    </select>
                  </div>
                </div>

                {/* Field 2: Ngày quan sát */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ngày quan sát (*)</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={observationDate}
                      onChange={(e) => setObservationDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Field 3: Em đã quan sát như thế nào? */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Em đã quan sát như thế nào? (*)</label>
                  <textarea
                    rows={4}
                    value={observationNotes}
                    onChange={(e) => setObservationNotes(e.target.value)}
                    placeholder="Ghi lại hoàn cảnh quan sát (trong giờ ra chơi, sau bữa ăn, kiểm tra tại thùng rác...)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                  />
                </div>

              </div>

              {/* Right Side: Tips Card & AI Callout */}
              <div className="md:col-span-5 space-y-4">
                
                {/* Gợi ý Card */}
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Gợi ý cho nhóm:</span>
                  </div>
                  <ul className="text-xs text-amber-900/90 space-y-1.5 font-medium pl-1">
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500">✓</span> Quan sát trực tiếp tại lớp
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500">✓</span> Đếm cẩn thận từng loại rác
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500">✓</span> Ghi rõ thời gian và địa điểm
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-500">✓</span> Có thể chụp ảnh minh chứng
                    </li>
                  </ul>
                </div>

                {/* Nhờ AI gợi ý Card */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-purple-900">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span>Nhờ AI gợi ý</span>
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed font-medium">
                    Em cần hỗ trợ cách thu thập dữ liệu nhanh và chuẩn xác? Hãy hỏi các bạn trợ lý AI nhé!
                  </p>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onNavigate('ai_lab');
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Mở AI Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <span className="text-3xl">📝</span>
              <h3 className="text-sm font-black text-slate-800">
                Nội dung bước {activeStep}: {stepsList[activeStep - 1]?.title}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Nhóm em đang phối hợp cùng các bạn trợ lý AI để hoàn thiện bước này và chuyển sang bước tiếp theo.
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveStep(Math.max(1, activeStep - 1));
              }}
              disabled={activeStep <= 1}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
              >
                💾 Lưu bản nháp
              </button>

              <button
                onClick={handleNextStep}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Bước tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  handleSaveDraft();
                  onNavigate('ai_lab');
                }}
                className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <span>TIẾP TỤC → SANG AI LAB (SỐ 4)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
