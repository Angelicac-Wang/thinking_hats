import React from 'react';
import { ChatMessage, HatType, HAT_CONFIGS } from '../types/hats';
import { HatIcon } from './HatIcon';
import { X, Sparkles, Scale, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface CognitiveBalanceModalProps {
  isOpen: boolean;
  topic: string;
  messages: ChatMessage[];
  onClose: () => void;
  onSummonHat: (hat: HatType) => void;
}

export const CognitiveBalanceModal: React.FC<CognitiveBalanceModalProps> = ({
  isOpen,
  topic,
  messages,
  onClose,
  onSummonHat,
}) => {
  if (!isOpen) return null;

  // Calculate message count per hat
  const hatCounts: Record<HatType, number> = {
    white: 0,
    red: 0,
    black: 0,
    yellow: 0,
    green: 0,
    blue: 0,
  };

  messages.forEach((msg) => {
    if (hatCounts[msg.hat] !== undefined) {
      hatCounts[msg.hat]++;
    }
  });

  const total = messages.length || 1;
  const hatsList: HatType[] = ['white', 'red', 'black', 'yellow', 'green', 'blue'];

  // Identify blind spots
  const lowestHats = [...hatsList].sort((a, b) => hatCounts[a] - hatCounts[b]);
  const highestHats = [...hatsList].sort((a, b) => hatCounts[b] - hatCounts[a]);

  const mostNeglected = lowestHats[0];
  const mostDominant = highestHats[0];

  let diagnosisText = '';
  let diagnosisTip = '';

  if (messages.length < 3) {
    diagnosisText = '討論方興未艾，各視角發言尚在累積中。';
    diagnosisTip = '建議依序邀請白帽（數據）與黑帽（風險）為決策建立扎實基準。';
  } else if (hatCounts.black >= total * 0.35) {
    diagnosisText = '批判質疑比例偏高，團隊可能陷入過度保守或猶豫不決。';
    diagnosisTip = '建議立即傳喚【綠帽】開拓破局解法，或【黃帽】評估實質槓桿價值。';
  } else if (hatCounts.white === 0 || hatCounts.white <= total * 0.1) {
    diagnosisText = '客觀事實與數據驗證不足，決策多基於主觀假設。';
    diagnosisTip = '強烈建議傳喚【白帽】盤點已知數據、市場份額或關鍵財務指標。';
  } else if (hatCounts.green === 0 || hatCounts.green <= total * 0.1) {
    diagnosisText = '缺乏跳脫常規的突破思維，容易在既有框架中原地打轉。';
    diagnosisTip = '建議傳喚【綠帽】進行橫向思維突破，提出非對稱替代方案。';
  } else if (hatCounts.yellow === 0 || hatCounts.yellow <= total * 0.1) {
    diagnosisText = '樂觀回報與潛在綜效探討偏弱，可能低估此議案之商業潛力。';
    diagnosisTip = '建議傳喚【黃帽】發掘方案中的最佳收益情境與正向槓桿。';
  } else {
    diagnosisText = '六頂思考帽交鋒比例均衡，兼顧客觀、直覺、風險、價值與創意！';
    diagnosisTip = '可適時請【藍帽主席】收斂共識，產出最終御前決策白皮書。';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-stone-950 via-[#140c08] to-stone-950 border border-amber-600/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        style={{
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.95), 0 0 35px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-b border-amber-700/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-900/60 border border-amber-500/50 text-amber-300">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                六維思維平衡儀 · 認知矩陣診斷
              </h3>
              <p className="text-xs text-amber-200/70 font-serif truncate max-w-md">
                議案：{topic}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Diagnosis Card */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/50 shadow-inner space-y-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>御前思維沙龍 · 即時診斷評估</span>
            </div>
            <p className="text-sm font-serif text-stone-100 font-semibold leading-relaxed">
              {diagnosisText}
            </p>
            <div className="flex items-start gap-2 pt-1 text-xs text-amber-200/80 font-serif">
              <span className="text-amber-400 font-bold shrink-0">建議方針：</span>
              <span>{diagnosisTip}</span>
            </div>
          </div>

          {/* 6 Hats Distribution Bars */}
          <div>
            <h4 className="text-xs font-serif font-bold text-amber-200 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>六頂思考帽發言權重分佈</span>
              <span className="text-[11px] text-stone-400 font-sans">總計 {messages.length} 則發言</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hatsList.map((hat) => {
                const cfg = HAT_CONFIGS[hat];
                const count = hatCounts[hat];
                const pct = messages.length > 0 ? Math.round((count / messages.length) * 100) : 0;
                const isUnderrepresented = messages.length >= 4 && pct <= 10;

                return (
                  <div
                    key={hat}
                    className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-700/50 transition-all flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HatIcon hat={hat} size={24} />
                        <div>
                          <span className="text-xs font-serif font-bold text-stone-200 block">
                            {cfg.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-serif">
                            {cfg.roleTitle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-serif text-amber-300">
                          {pct}%
                        </span>
                        <span className="text-[10px] text-stone-400 block font-sans">
                          {count} 次
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800/80">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: cfg.hex,
                          boxShadow: `0 0 8px ${cfg.hex}`,
                        }}
                      />
                    </div>

                    {/* Quick Summon Button if underrepresented */}
                    {isUnderrepresented ? (
                      <button
                        onClick={() => {
                          onSummonHat(hat);
                          onClose();
                        }}
                        className="mt-1 w-full py-1 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 text-amber-200 text-[11px] font-serif flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>急需補充：立即傳喚發言</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSummonHat(hat);
                          onClose();
                        }}
                        className="mt-1 w-full py-1 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-amber-200 text-[10px] font-serif flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>傳喚此帽接續發言</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-serif">
            依據愛德華·狄波諾側向思維法則：健康的決策須兼顧全部 6 種心智視角。
          </span>
          <button
            onClick={() => {
              onSummonHat(mostNeglected);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs font-serif font-bold shadow-md cursor-pointer border border-amber-500/40 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>補足最弱盲點：傳喚【{HAT_CONFIGS[mostNeglected].name}】</span>
          </button>
        </div>
      </div>
    </div>
  );
};
