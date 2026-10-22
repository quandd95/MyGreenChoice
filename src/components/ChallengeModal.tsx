import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Droplets, Zap, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChallengeItem } from '../types/greenChoice';
import { sounds } from '../utils/soundEffects';

interface ChallengeModalProps {
  challenge: ChallengeItem | null;
  onClose: () => void;
  onComplete: (challengeId: string, earnedPoints: number) => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  onClose,
  onComplete,
}) => {
  if (!challenge) return null;

  // Challenge 1 state: Reusable vs Disposable bottle
  const [bottleDays, setBottleDays] = useState(180);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

  // Challenge 2 state: Water saving faucet
  const [dripRate, setDripRate] = useState(30); // drops per minute
  const [isTapFixed, setIsTapFixed] = useState(false);

  // Challenge 3 state: Smart electricity house
  const [solarActive, setSolarActive] = useState(true);
  const [naturalWindActive, setNaturalWindActive] = useState(true);
  const [turnOffStandby, setTurnOffStandby] = useState(true);

  // Complete action
  const handleFinish = () => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#FBBF24', '#60A5FA'],
      });
    } catch {
      // ignore
    }
    onComplete(challenge.id, challenge.points);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-emerald-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              {challenge.id === 'bottle_challenge' ? '🍼' : challenge.id === 'water_drop_challenge' ? '💧' : '⚡'}
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-100 tracking-wider uppercase">
                {challenge.category} · +{challenge.points} Điểm Xanh
              </span>
              <h2 className="text-lg sm:text-xl font-black leading-tight text-white">
                {challenge.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with scrolling */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Challenge 1: Bottle Comparison Lab */}
          {challenge.id === 'bottle_challenge' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <h3 className="font-extrabold text-emerald-950 text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Mô phỏng: Bình Inox Tái Sử Dụng vs Chai Nhựa Dùng 1 Lần
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Hãy kéo thanh trượt để xem nếu em mang bình nước cá nhân đi học mỗi ngày, em sẽ giúp Trái Đất bớt đi bao nhiêu rác thải nhựa!
                </p>

                {/* Slider */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Số ngày mang bình nước trong năm:</span>
                    <span className="font-mono tabular-nums text-emerald-700 text-base bg-white px-3 py-1 rounded-lg border border-emerald-300">
                      {bottleDays} ngày / năm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="365"
                    value={bottleDays}
                    onChange={(e) => {
                      setBottleDays(Number(e.target.value));
                      sounds.playPop();
                    }}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Impact metrics comparison */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-200">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-center">
                    <span className="text-xs text-slate-500 font-semibold">Chai nhựa giảm</span>
                    <div className="text-xl font-black text-emerald-600 font-mono tabular-nums">
                      -{bottleDays}
                    </div>
                    <span className="text-[11px] text-slate-400">chiếc rác thải</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-center">
                    <span className="text-xs text-slate-500 font-semibold">Tiền tiết kiệm</span>
                    <div className="text-xl font-black text-amber-600 font-mono tabular-nums">
                      {(bottleDays * 10).toLocaleString('vi-VN')}k
                    </div>
                    <span className="text-[11px] text-slate-400">đồng tiền mua nước</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-center">
                    <span className="text-xs text-slate-500 font-semibold">Giảm khí CO2</span>
                    <div className="text-xl font-black text-blue-600 font-mono tabular-nums">
                      {(bottleDays * 0.08).toFixed(1)} kg
                    </div>
                    <span className="text-[11px] text-slate-400">bảo vệ khí quyển</span>
                  </div>
                </div>
              </div>

              {/* Critical Thinking Question */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Câu hỏi tư duy phản biện:
                </span>
                <p className="font-bold text-slate-900 mt-1 text-sm sm:text-base">
                  Nếu một hôm bạn lỡ quên mang bình nước cá nhân đến trường, cách xử lý nào là văn minh và bền vững nhất?
                </p>

                <div className="mt-3 space-y-2">
                  {[
                    'Uống nước tại vòi nước sạch của trường bằng cốc cá nhân hoặc mượn cốc dùng lại.',
                    'Mua ngay 3 chai nước ngọt đóng chai nhựa dùng 1 lần rồi tiện tay vứt.',
                    'Nhịn uống nước cả ngày.',
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedQuizAnswer(idx);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        selectedQuizAnswer === idx
                          ? idx === 0
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                            : 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-white border-slate-200 hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          selectedQuizAnswer === idx
                            ? idx === 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Challenge 2: Water Drop Faucet Saving */}
          {challenge.id === 'water_drop_challenge' && (
            <div className="space-y-6">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl">
                <h3 className="font-extrabold text-sky-950 text-base mb-1 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  Mô phỏng: Vòi Nước Rò Rỉ & Nước Sinh Hoạt Tiết Kiệm
                </h3>
                <p className="text-xs sm:text-sm text-sky-800">
                  Một vòi nước rò rỉ tưởng như nhỏ bé, nhưng mỗi giây 1 giọt có thể làm mất đi hàng ngàn lít nước sạch mỗi năm!
                </p>

                <div className="mt-4 p-4 bg-white rounded-xl border border-sky-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-600">Tình trạng vòi nước:</span>
                    <div className="text-sm font-black text-slate-900">
                      {isTapFixed ? '✅ Đã khóa chặt vòi nước (0 giọt/phút)' : `⚠️ Đang rò rỉ: ${dripRate} giọt/phút`}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsTapFixed(!isTapFixed);
                      sounds.playPop();
                    }}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                      isTapFixed
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        : 'bg-amber-500 hover:bg-amber-400 text-white shadow-sm'
                    }`}
                  >
                    {isTapFixed ? 'Mở thử vòi' : '🔧 Khóa vòi nước ngay'}
                  </button>
                </div>

                {!isTapFixed && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Mức độ rò rỉ:</span>
                      <span className="font-mono">{dripRate} giọt/phút</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      value={dripRate}
                      onChange={(e) => setDripRate(Number(e.target.value))}
                      className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-sky-200">
                  <div className="p-3 bg-white rounded-xl text-center border border-sky-100">
                    <span className="text-xs text-slate-500 font-semibold">Lãng phí mỗi ngày</span>
                    <div className="text-xl font-black text-sky-700 font-mono tabular-nums">
                      {isTapFixed ? '0 L' : `${((dripRate / 60) * 20).toFixed(1)} Lít`}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl text-center border border-sky-100">
                    <span className="text-xs text-slate-500 font-semibold">Lãng phí mỗi năm</span>
                    <div className="text-xl font-black text-amber-700 font-mono tabular-nums">
                      {isTapFixed ? '0 L' : `${Math.round((dripRate / 60) * 20 * 365).toLocaleString('vi-VN')} Lít`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Practical action tip */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Mẹo nhỏ hôm nay:
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                  Khi đánh răng, hãy dùng một chiếc cốc nhỏ thay vì để vòi nước chảy tự do. Bạn sẽ tiết kiệm được hơn 5 lít nước sạch mỗi lần đánh răng!
                </p>
              </div>
            </div>
          )}

          {/* Challenge 3: Smart Electricity */}
          {challenge.id === 'smart_electricity_challenge' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
                <h3 className="font-extrabold text-amber-950 text-base mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Ngôi Nhà Xanh Thông Minh: Cân Bằng Năng Lượng
                </h3>
                <p className="text-xs sm:text-sm text-amber-800">
                  Hãy bật các thói quen tiết kiệm điện và nguồn năng lượng tái tạo để biến ngôi nhà trở thành Ngôi Nhà Năng Lượng Xanh!
                </p>

                <div className="mt-4 space-y-2.5">
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-50/50">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>☀️</span>
                      <span>Lắp tấm pin năng lượng mặt trời áp mái</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={solarActive}
                      onChange={(e) => {
                        setSolarActive(e.target.checked);
                        sounds.playPop();
                      }}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-50/50">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>🪟</span>
                      <span>Mở cửa sổ đón gió tự nhiên, hạn chế bật điều hòa quá lạnh</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={naturalWindActive}
                      onChange={(e) => {
                        setNaturalWindActive(e.target.checked);
                        sounds.playPop();
                      }}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-50/50">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>🔌</span>
                      <span>Tắt hẳn công tắc các thiết bị điện khi không dùng (không để chờ)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={turnOffStandby}
                      onChange={(e) => {
                        setTurnOffStandby(e.target.checked);
                        sounds.playPop();
                      }}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Đánh giá độ xanh của ngôi nhà:</span>
                  <div className="flex items-center gap-1 font-bold text-sm text-emerald-700">
                    {solarActive && naturalWindActive && turnOffStandby ? (
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        🌟 100% Đạt Chuẩn Ngôi Nhà Xanh
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold">
                        Cần thêm hành động để đạt chuẩn
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Đóng lại
          </button>

          <button
            onClick={handleFinish}
            className="btn-3d-emerald px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Hoàn thành & Nhận +{challenge.points} Điểm</span>
          </button>
        </div>

      </div>
    </div>
  );
};
