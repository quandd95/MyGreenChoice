import React from 'react';
import { AppView } from '../types/aiImpact';
import { sounds } from '../utils/soundEffects';

interface FlowProgressBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const FlowProgressBar: React.FC<FlowProgressBarProps> = ({ currentView, onNavigate }) => {
  const steps: { id: AppView; num: string; label: string }[] = [
    { id: 'home', num: '1', label: 'Trang chủ (P01)' },
    { id: 'challenges', num: '2', label: 'Thử thách (P04)' },
    { id: 'project_space', num: '3', label: '8 Bước dự án (P06)' },
    { id: 'ai_lab', num: '4', label: 'AI Lab (P07)' },
    { id: 'ai_check', num: '5', label: 'AI Check (P08)' },
    { id: 'report', num: '6', label: 'Báo cáo (P10)' },
    { id: 'teacher_dashboard', num: '7', label: 'Bảng ĐK Giáo viên (P11)' },
  ];

  const currentIdx = steps.findIndex((s) => s.id === currentView);

  return (
    <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-2xs mb-5 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px] gap-2 px-2">
        {steps.map((step, idx) => {
          const isActive = currentView === step.id;
          const isPassed = currentIdx >= 0 && idx < currentIdx;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate(step.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#15803D] text-white shadow-xs scale-102 ring-2 ring-emerald-400/30'
                    : isPassed
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    isActive
                      ? 'bg-white text-emerald-800'
                      : isPassed
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPassed ? '✓' : step.num}
                </span>
                <span className="truncate">{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-[16px] transition-colors ${
                    idx < currentIdx ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
