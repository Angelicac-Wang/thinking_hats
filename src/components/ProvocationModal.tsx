import React, { useState } from 'react';
import { HatType } from '../types/hats';
import { Lightbulb, Sparkles, X, Flame, Shuffle, ArrowRight, Compass } from 'lucide-react';

interface ProvocationModalProps {
  isOpen: boolean;
  topic: string;
  onClose: () => void;
  onLaunchProvocation: (prompt: string, targetHat: HatType) => void;
}

export const ProvocationModal: React.FC<ProvocationModalProps> = ({
  isOpen,
  topic,
  onClose,
  onLaunchProvocation,
}) => {
  const [selectedPoIndex, setSelectedPoIndex] = useState<number>(0);
  const [customPo, setCustomPo] = useState<string>('');
  const [targetHat, setTargetHat] = useState<HatType>('green');

  if (!isOpen) return null;

  // Curated Lateral Thinking PO (Provocative Operations) tailored to topics
  const PROVOCATIONS = [
    {
      title: '致命缺陷即核心賣點 (Reversal Po)',
      type: '思維反轉',
      prompt: `PO 假設：如果我們刻意把「${topic.slice(0, 24)}...」中最致命的缺點或反對理由，直接包裝為不可替代的唯一賣點與護城河，我們會如何重構商業與執行邏輯？`,
      desc: '打破「避開缺點」的線性思考，強迫發掘極端反常理的獨特優勢。',
      recommendedHat: 'green' as HatType,
    },
    {
      title: '資源歸零極限驗證 (Extreme Constraint Po)',
      type: '極端約束',
      prompt: `PO 假設：如果我們被禁止投入任何新增資金或時間，預算為 0，且必須在 7 天之內驗證「${topic.slice(0, 24)}...」的真實需求，我們能採取的最小暴力破局解法是什麼？`,
      desc: '剝離所有官僚準備與複雜計畫，迫使團隊看清核心價值本質。',
      recommendedHat: 'green' as HatType,
    },
    {
      title: '異界巨頭跨界降維 (Cross-Domain Po)',
      type: '跨界置換',
      prompt: `PO 假設：如果這項議案交給一家「頂級米其林奢華餐廳」或「高沉浸電玩遊戲工作室」來運作，他們會用什麼完全違背傳統行規的做法來徹底重塑？`,
      desc: '引進非同業的激進感官與心理學機制，打破同溫層既有框架。',
      recommendedHat: 'yellow' as HatType,
    },
    {
      title: '逆向自毀防線排查 (Pre-Mortem Po)',
      type: '未來死穴反推',
      prompt: `PO 假設：假設三年後這項決策「慘烈破產宣告徹底失敗」，現在正是驗屍會議。導致這場災難的隱形致命第一張骨牌究竟是什麼？我們現在做什麼能徹底拔除它？`,
      desc: '由終點倒推死穴，將潛在墨菲定律轉化為具體的防範勝招。',
      recommendedHat: 'black' as HatType,
    },
  ];

  const currentPo = PROVOCATIONS[selectedPoIndex];

  const handleLaunch = () => {
    const finalPrompt = customPo.trim() || currentPo.prompt;
    onLaunchProvocation(finalPrompt, targetHat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c120c] via-[#100804] to-[#160c07] border border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        style={{
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.98), 0 0 35px rgba(245, 158, 11, 0.18)',
        }}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-b border-amber-700/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-900/60 border border-amber-500/50 text-amber-300">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                  狄波諾 PO 側向突圍詰問器
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-serif">
                  打破思維死結
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-serif truncate max-w-md">
                愛德華·狄波諾：「PO (Provocative Operation) 是故意導入荒謬假說以激發全新神經路徑的開關。」
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
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* PO Options Tabs */}
          <div>
            <label className="block text-xs font-serif font-bold text-amber-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>揀選一項激進的側向詰問 (PO 假說)：</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROVOCATIONS.map((po, idx) => {
                const isSelected = selectedPoIndex === idx && !customPo;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPoIndex(idx);
                      setCustomPo('');
                      setTargetHat(po.recommendedHat);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/40 shadow-lg'
                        : 'bg-stone-900/80 border-stone-800 hover:border-amber-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-amber-100">
                        {po.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 border border-amber-700/40 font-serif">
                        {po.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-serif line-clamp-2">
                      {po.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active PO Display / Custom Edit */}
          <div className="p-4 rounded-2xl bg-stone-950/90 border border-amber-700/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-serif text-amber-200">
              <span className="font-bold flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>即將投擲進圓桌的側向詰問引信：</span>
              </span>
              <span className="text-[10px] text-stone-400">可自由潤飾調整</span>
            </div>

            <textarea
              value={customPo || currentPo.prompt}
              onChange={(e) => setCustomPo(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-stone-900/95 border border-stone-800 rounded-xl text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none font-sans leading-relaxed"
            />

            {/* Target Hat Selector */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-xs font-serif">
              <span className="text-stone-300">指定由哪頂頂冠優先接招回答：</span>
              <div className="flex items-center gap-1.5">
                {(['green', 'yellow', 'black', 'white', 'red', 'blue'] as HatType[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setTargetHat(h)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-serif transition-all cursor-pointer ${
                      targetHat === h
                        ? 'bg-amber-600 text-white font-bold shadow'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {h === 'green' && '綠帽 (破局)'}
                    {h === 'yellow' && '黃帽 (收益)'}
                    {h === 'black' && '黑帽 (死穴)'}
                    {h === 'white' && '白帽 (事實)'}
                    {h === 'red' && '紅帽 (直覺)'}
                    {h === 'blue' && '藍帽 (決策)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedPoIndex((prev) => (prev + 1) % PROVOCATIONS.length)}
            className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 text-xs font-serif transition-colors flex items-center gap-1 cursor-pointer border border-stone-800"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>更換另一個假說</span>
          </button>

          <button
            onClick={handleLaunch}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs sm:text-sm font-serif font-bold shadow-lg shadow-amber-900/40 transition-all flex items-center gap-2 cursor-pointer border border-amber-500/50"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>將詰問投入圓桌 · 引爆新論點</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
