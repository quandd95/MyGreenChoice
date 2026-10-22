import React from 'react';
import { Play, Sparkles, Compass } from 'lucide-react';
import { ActiveTab } from '../types';
import { sounds } from '../utils/soundEffects';

interface HeroBannerProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectTab }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-[#F8F9FD] border-b border-slate-200/60 pb-12 pt-8 sm:pt-12">
      {/* Decorative ambient clay circles */}
      <div className="absolute top-4 left-10 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 right-10 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Interactive Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-indigo-700 tracking-wide uppercase">
              <span>Học tập tương tác 3D</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Vũ Trụ & Khoa Học</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Dành Cho Trẻ Em & Học Sinh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] text-balance">
              Khám Phá Thế Giới Qua <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">Khoa Học 3D Hoạt Hình</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
              Chạm tay vào hệ mặt trời xoay vòng, tự tay pha chế các phản ứng hóa học sủi bọt kỳ thú, thử nghiệm lực đẩy Archimedes và giải đố toán học cân thăng bằng trong không gian 3D sống động!
            </p>

            {/* Quick launch action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectTab('space');
                }}
                className="btn-3d-blue px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt Đầu Khám Phá Vũ Trụ</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectTab('science');
                }}
                className="btn-3d-slate px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm sm:text-base rounded-2xl border-2 border-slate-200 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Vào Phòng Thí Nghiệm</span>
              </button>
            </div>

            {/* Quantitative trust markers / feature highlights (adjacent proof) */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  6+ <span className="text-amber-500 text-base">Hành Tinh</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">Mô phỏng quỹ đạo thực tế</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  100% <span className="text-emerald-500 text-base">Tương Tác</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">Pha chế hóa học & đo trọng lực</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  7+ <span className="text-purple-500 text-base">Huy Hiệu</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">Thu thập phần thưởng sao</div>
              </div>
            </div>

          </div>

          {/* Right Column: High-fidelity 3D Mascot Cartoon Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md clay-card overflow-hidden bg-gradient-to-b from-amber-50 via-white to-orange-50/50 p-2 border-4 border-amber-200/80 shadow-xl group">
              
              {/* Main 3D Mascot Image with fallback container */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-amber-100 flex items-center justify-center">
                <img
                  src="/src/assets/images/mascot_learning_hero_1792657785920.jpg"
                  alt="Sparky Robot - Người bạn đồng hành học tập 3D hoạt hình"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Interactive speech bubble callout */}
              <div className="p-3.5 bg-white/90 rounded-xl mt-2 border border-amber-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white font-extrabold flex items-center justify-center shrink-0 shadow-sm text-sm">
                  ✨
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Sparky Robot Nhắn Nhủ</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                    &ldquo;Chào bạn nhỏ! Hãy chọn một chủ đề bên trên để cùng mình giải mã những bí mật thú vị nhé!&rdquo;
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
