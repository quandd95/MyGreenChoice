import React, { useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare, ArrowRight, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { AIAssistant, AppView } from '../types/aiImpact';
import { AI_ASSISTANTS_LIST } from '../data/aiImpactData';
import { sounds } from '../utils/soundEffects';

interface AILabViewProps {
  onNavigate: (view: AppView) => void;
}

export const AILabView: React.FC<AILabViewProps> = ({ onNavigate }) => {
  const [selectedBot, setSelectedBot] = useState<AIAssistant>(AI_ASSISTANTS_LIST[0]);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: selectedBot.systemPrompt,
      time: '10:00',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Switch active AI Assistant
  const handleSelectBot = (bot: AIAssistant) => {
    sounds.playClick();
    setSelectedBot(bot);
    setChatMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ai',
        text: bot.systemPrompt,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Send message to AI
  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    sounds.playClick();
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      sounds.playStarCoin();
      let reply = `Tuyệt vời! ${selectedBot.title} rất thích câu hỏi này của em.`;

      if (selectedBot.id === 'question') {
        reply = `Câu hỏi rất hay! Để tìm hiểu sâu hơn, em hãy thử hỏi: 'Tại sao thói quen này lại hình thành?' và 'Nếu thay đổi thì ai sẽ được hưởng lợi nhất?'. Hãy thảo luận cùng nhóm nhé!`;
      } else if (selectedBot.id === 'analysis') {
        reply = `Theo số liệu em đưa ra, trung bình mỗi bạn trong lớp có thể giảm được 0.5kg rác nhựa mỗi tháng! Nếu cả trường 500 bạn cùng làm thì con số lên tới 250kg rác nhựa đấy!`;
      } else if (selectedBot.id === 'ideas') {
        reply = `Ý tưởng của em rất sáng tạo! Mình gợi ý thêm: Nhóm có thể làm 'Cây cam kết xanh' - mỗi bạn dán 1 chiếc lá hứa mang bình nước cá nhân, khi cây đầy lá lớp sẽ có phần thưởng!`;
      } else if (selectedBot.id === 'planning') {
        reply = `Kế hoạch rất rõ ràng! Đừng quên phân công: Bạn ghi chép số liệu, bạn chụp ảnh bằng chứng, và bạn tổng hợp báo cáo nhé. Hãy đặt mục tiêu hoàn thành trước thứ Sáu!`;
      } else if (selectedBot.id === 'evidence') {
        reply = `Đúng tinh thần kiểm chứng khoa học! Em hãy nhớ: Chụp ảnh trước và sau khi thực hiện, lưu lại ngày giờ cụ thể và đếm số lượng chính xác để báo cáo thật thuyết phục.`;
      } else if (selectedBot.id === 'presentation') {
        reply = `Để bài thuyết trình lôi cuốn, em hãy bắt đầu bằng một câu chuyện nhỏ: 'Sáng nay, nhóm mình đã nhìn thấy...' rồi đưa ra biểu đồ số liệu thực tế. Cả lớp sẽ chăm chú lắng nghe!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* P07 Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl shrink-0">
            🤖
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Lab – Bạn đồng hành AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              6 bạn AI nhỏ, mỗi bạn một vai trò rõ ràng để giúp em tự suy nghĩ chứ không làm thay!
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 6 AI Assistant Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {AI_ASSISTANTS_LIST.map((bot) => {
          const isSelected = selectedBot.id === bot.id;
          return (
            <div
              key={bot.id}
              onClick={() => handleSelectBot(bot)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center group ${
                isSelected
                  ? 'border-emerald-500 bg-white shadow-md scale-102 ring-2 ring-emerald-400/30'
                  : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform ${bot.bgColor}`}>
                  {bot.avatarIcon}
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                  {bot.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {bot.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full inline-block ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                }`}>
                  {isSelected ? 'Đang trò chuyện' : 'Chọn bạn này'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Chat Canvas with the Selected AI Friend */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Bot Info & Suggestion Prompts */}
        <div className="lg:col-span-4 p-6 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${selectedBot.bgColor}`}>
              {selectedBot.avatarIcon}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {selectedBot.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedBot.subtitle}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gợi ý câu hỏi nhanh:</span>
            </div>
            <div className="space-y-1.5">
              {selectedBot.defaultQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer leading-snug"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('ai_check')}
              className="w-full py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Chuyển sang AI Check</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Chat Dialog Area */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between h-[450px]">
          {/* Chat Stream */}
          <div className="space-y-3 overflow-y-auto pr-2 flex-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.sender === 'ai' ? (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${selectedBot.bgColor}`}>
                    {selectedBot.avatarIcon}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-base shrink-0">
                    🎒
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    msg.sender === 'ai'
                      ? 'bg-slate-100 text-slate-800 rounded-tl-xs'
                      : 'bg-[#15803D] text-white rounded-tr-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] block text-right mt-1 ${
                      msg.sender === 'ai' ? 'text-slate-400' : 'text-emerald-100'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-4 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={`Nhắn cho ${selectedBot.title}...`}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-2 top-2 p-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Chuyển tiếp tuần tự (Số 4 -> Số 5) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('project_space');
          }}
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black rounded-2xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>← Quay lại Không gian 8 bước (Số 3)</span>
        </button>

        <button
          onClick={() => {
            sounds.playSuccess();
            onNavigate('ai_check');
          }}
          className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:translate-y-0.5"
        >
          <span>TIẾP TỤC → SANG KIỂM CHỨNG CÙNG AI CHECK (SỐ 5)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
