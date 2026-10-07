import React from 'react';
import { HatType, HAT_CONFIGS, UserRole } from '../types/hats';
import { HatIcon } from './HatIcon';
import { X, CheckCircle, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface HatDetailModalProps {
  hat: HatType | null;
  userRole: UserRole;
  onClose: () => void;
  onSelectRole: (hat: HatType) => void;
  onSummonSpeaker: (hat: HatType) => void;
}

const HAT_GUIDANCE: Record<HatType, { questions: string[]; tips: string[]; caution: string }> = {
  white: {
    questions: [
      '我們目前掌握了哪些確鑿的數據與資訊？',
      '有哪些資訊是缺失的？需要去哪裡查證？',
      '有哪些推論其實只是猜想，尚未獲得客觀事實支持？',
    ],
    tips: ['嚴格區分「已證實的事實」與「未經證實的假設」', '保持中立，不表達個人喜好與評論'],
    caution: '不要夾帶主觀意見，不要過早做出價值判斷。',
  },
  red: {
    questions: [
      '第一眼看到這個構想，我的直覺感受是什麼？',
      '這會讓目標用戶感到興奮、困惑還是反感？',
      '內心深處是否有揮之不去的疑慮或期待？',
    ],
    tips: ['無需為情緒提出邏輯論證，直抒胸臆即可', '承認直覺在人類決策中的巨大引導力'],
    caution: '不要試圖為直覺找藉口辯解，直接表達感受。',
  },
  black: {
    questions: [
      '最致命的失敗情境會是什麼？',
      '在法律、法規、預算或資源上有哪些難以逾越的阻礙？',
      '競品或對手可能如何進行毀滅性反擊？',
    ],
    tips: ['扮演負責任的魔鬼代言人與安全守門員', '目的不是否定提案，而是讓提案更堅固'],
    caution: '避免人身攻擊或單純的情緒性唱衰，聚焦客觀邏輯與風險點。',
  },
  yellow: {
    questions: [
      '如果一切如期進行，最大的利益與回報是什麼？',
      '這個構想具備哪些獨特且持久的競爭優勢？',
      '如何能將這項好處發揮到極致？',
    ],
    tips: ['尋求有邏輯支撐的正向價值與前瞻機會', '探尋「最佳情境」下的回報潛力'],
    caution: '黃帽並非盲目樂觀，必須基於可行性給予建設性理由。',
  },
  green: {
    questions: [
      '如果我們完全把規則顛倒過來，會發生什麼？',
      '能不能借鑑其他完全無關領域（如遊戲、生物、餐飲）的做法？',
      '有沒有任何看似瘋狂卻突破框架的新點子？',
    ],
    tips: ['運用橫向思維（Lateral Thinking）探索替代方案', '允許瘋狂假設，延遲評判'],
    caution: '戴綠帽時嚴禁黑帽插話批判，保護脆弱的創意幼苗。',
  },
  blue: {
    questions: [
      '我們現在處於思考的哪一個階段？',
      '各方目前達成了哪些共識？最核心的分歧在哪？',
      '我們下一步最關鍵的行動清單是什麼？',
    ],
    tips: ['掌控會議節奏與思考帽切換順序', '收斂整合各方智慧，促成具體決策落地'],
    caution: '主持者應保持客觀大局觀，引導發言而非獨佔話語權。',
  },
};

export const HatDetailModal: React.FC<HatDetailModalProps> = ({
  hat,
  userRole,
  onClose,
  onSelectRole,
  onSummonSpeaker,
}) => {
  if (!hat) return null;

  const cfg = HAT_CONFIGS[hat];
  const guidance = HAT_GUIDANCE[hat];
  const isUserWearing = userRole === hat;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: cfg.hex }}
      >
        {/* Header */}
        <div 
          className="p-6 relative flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${cfg.hex}22 0%, rgba(15,23,42,0.95) 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <HatIcon hat={hat} size={48} glow />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {cfg.name} ({cfg.enName})
                </h3>
                {isUserWearing && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-semibold">
                    您正佩戴中
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {cfg.roleTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          {/* Philosophy Description */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: cfg.hex }} />
              核心思考本質
            </h4>
            <p className="text-slate-200 leading-relaxed">
              {cfg.description}
            </p>
          </div>

          {/* Typical Questions */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              經典引導提問 (Edward de Bono)
            </h4>
            <div className="space-y-1.5">
              {guidance.questions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips & Caution */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
              <span className="font-semibold block mb-0.5">💡 發言指南：</span>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-emerald-300">
                {guidance.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
              <span className="font-semibold block mb-0.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> 注意事項：
              </span>
              <p className="text-amber-300">{guidance.caution}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onSummonSpeaker(hat);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            邀請此帽發言
          </button>

          <button
            onClick={() => {
              onSelectRole(hat);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isUserWearing ? '已佩戴此帽' : '切換佩戴此帽'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
