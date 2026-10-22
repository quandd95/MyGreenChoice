import React from 'react';
import { Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import { ActiveTab } from '../types';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  starsCount: number;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenBadges: () => void;
  unlockedBadgesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  starsCount,
  isMuted,
  setIsMuted,
  onOpenBadges,
  unlockedBadgesCount,
}) => {
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.isMuted = nextMuted;
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  const handleNavClick = (tab: ActiveTab) => {
    sounds.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => handleNavClick('space')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 group-hover:scale-105 transition-transform">
            <span className="text-xl">🚀</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              WonderKids<span className="text-amber-500 ml-1">3D</span>
            </span>
          </div>
        </div>

        {/* Zone 2: 4 single-line nav tabs */}
        <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
          <button
            onClick={() => handleNavClick('space')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'space'
                ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100 scale-102'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🪐</span>
            <span>Hành Tinh 3D</span>
          </button>

          <button
            onClick={() => handleNavClick('science')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'science'
                ? 'bg-white text-emerald-700 shadow-md shadow-emerald-100 scale-102'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🧪</span>
            <span>Phòng Thí Nghiệm</span>
          </button>

          <button
            onClick={() => handleNavClick('math')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'math'
                ? 'bg-white text-amber-700 shadow-md shadow-amber-100 scale-102'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>📐</span>
            <span>Vườn Toán Học</span>
          </button>

          <button
            onClick={() => handleNavClick('mascot')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'mascot'
                ? 'bg-white text-purple-700 shadow-md shadow-purple-100 scale-102'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🤖</span>
            <span>Xưởng Mascot</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Badges collection button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenBadges();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-transform active:scale-95 whitespace-nowrap shrink-0"
            title="Xem bộ sưu tập huy hiệu"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span className="font-mono tabular-nums">{unlockedBadgesCount}/7</span>
          </button>

          {/* Stars tally */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-400/20 text-yellow-900 font-bold text-xs rounded-xl border border-yellow-300 whitespace-nowrap shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="font-mono tabular-nums font-extrabold text-sm">{starsCount}</span>
            <span className="hidden sm:inline">Sao</span>
          </div>

          {/* Sound toggle button */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl transition-colors whitespace-nowrap shrink-0 border ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200'
            }`}
            title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh'}
            aria-label="Chuyển đổi âm thanh"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile subnav bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-slate-50 border-t border-slate-200 text-xs font-bold">
        <button
          onClick={() => handleNavClick('space')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === 'space' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <span>🪐</span>
          <span>Vũ Trụ</span>
        </button>
        <button
          onClick={() => handleNavClick('science')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === 'science' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <span>🧪</span>
          <span>Thí Nghiệm</span>
        </button>
        <button
          onClick={() => handleNavClick('math')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === 'math' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <span>📐</span>
          <span>Toán Học</span>
        </button>
        <button
          onClick={() => handleNavClick('mascot')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === 'mascot' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <span>🤖</span>
          <span>Mascot</span>
        </button>
      </div>
    </header>
  );
};
