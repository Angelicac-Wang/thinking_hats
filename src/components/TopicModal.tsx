import React, { useState } from 'react';
import { HatType, HAT_CONFIGS, UserRole, DiscussionSequenceMode, DISCUSSION_SEQUENCES } from '../types/hats';
import { HatIcon } from './HatIcon';
import { Crown, Sparkles, Eye, CheckCircle, Lightbulb, Play, Scroll, Feather } from 'lucide-react';

interface TopicModalProps {
  isOpen: boolean;
  initialTopic: string;
  initialUserRole: UserRole;
  initialSequence: DiscussionSequenceMode;
  initialIntensity: 'collaborative' | 'critical';
  onStart: (topic: string, role: UserRole, seq: DiscussionSequenceMode, intensity: 'collaborative' | 'critical') => void;
  onClose: () => void;
}

// Exactly 2 curated preset topics requested by user
const PRESET_TOPICS = [
  {
    title: '離職全職創業做 AI 工具',
    topic: '我正在考慮辭去目前的穩定工程師工作，全職投入開發一款專為自由工作者設計的 AI 自動化助理。',
    tag: '生涯決策',
  },
  {
    title: '公司全面推行永久遠距辦公',
    topic: '我們公司 50 人的跨國團隊，正在評估是否要退租實體辦公室，全面轉型為 100% 永久遠距工作模式。',
    tag: '組織策略',
  },
];

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  initialTopic,
  initialUserRole,
  initialSequence,
  initialIntensity,
  onStart,
  onClose,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [userRole, setUserRole] = useState<UserRole>(initialUserRole);
  const [sequenceMode, setSequenceMode] = useState<DiscussionSequenceMode>(initialSequence);
  const [intensity, setIntensity] = useState<'collaborative' | 'critical'>(initialIntensity);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart(topic.trim(), userRole, sequenceMode, intensity);
  };

  const hatsList: HatType[] = ['blue', 'white', 'green', 'yellow', 'black', 'red'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300 select-none">
      {/* Aristocratic European Royal Convocation Card */}
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c120c] via-[#100804] to-[#1a100a] border-2 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden my-auto"
        style={{
          boxShadow: '0 30px 70px -10px rgba(0,0,0,0.98), 0 0 40px rgba(245, 158, 11, 0.18)',
        }}
      >
        {/* Inner Gilded Filigree Double Border with Baroque Corner Accents */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-[22px] border border-amber-500/30 pointer-events-none">
          {/* Top Left Corner Fleur-de-lis */}
          <span className="absolute top-1 left-1.5 text-amber-500/40 text-xs font-serif leading-none">⚜</span>
          {/* Top Right Corner Fleur-de-lis */}
          <span className="absolute top-1 right-1.5 text-amber-500/40 text-xs font-serif leading-none">⚜</span>
          {/* Bottom Left Corner Fleur-de-lis */}
          <span className="absolute bottom-1 left-1.5 text-amber-500/40 text-xs font-serif leading-none">⚜</span>
          {/* Bottom Right Corner Fleur-de-lis */}
          <span className="absolute bottom-1 right-1.5 text-amber-500/40 text-xs font-serif leading-none">⚜</span>
        </div>

        {/* Card Header: Royal Wax Seal & Convocation Letterhead */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-amber-950/70 via-stone-950/80 to-transparent border-b border-amber-700/30 text-center">
          {/* Royal Wax Seal Medallion */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="relative flex items-center justify-center">
              {/* Crimson Wax Seal */}
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-red-800 via-red-950 to-stone-900 border-2 border-amber-500/60 shadow-lg flex items-center justify-center relative z-10"
                style={{
                  boxShadow: '0 4px 15px rgba(0,0,0,0.6), inset 0 2px 4px rgba(251, 191, 36, 0.4)',
                }}
              >
                <Crown className="w-6 h-6 text-amber-300 drop-shadow" />
              </div>
              {/* Twin Silk Ribbons */}
              <div className="absolute -bottom-2 w-4 h-5 bg-red-900 border-x border-amber-500/40 transform rotate-12 opacity-80" />
              <div className="absolute -bottom-2 w-4 h-5 bg-red-900 border-x border-amber-500/40 transform -rotate-12 opacity-80" />
            </div>

            <div className="mt-2.5">
              <span className="text-[10px] tracking-[0.25em] text-amber-400/90 uppercase font-serif block font-bold">
                L'Ordre des Six Chapeaux · Convocation Royale
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 tracking-wider mt-0.5">
                御前思維沙龍 · 議案召集帖
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-amber-200/85 font-serif leading-relaxed max-w-lg mx-auto italic">
            「致 尊貴的智囊閣下：特許列席御前決策圓桌，敬邀您親裁今日審議之核心議案，並選定閣下親掌之思維頂冠與規程……」
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto font-sans">
          {/* Step 1: Topic Input */}
          <div>
            <label className="block text-xs font-serif font-bold text-amber-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scroll className="w-4 h-4 text-amber-400" />
              <span>一、今日御前審議之核心議案</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="請陳述您欲深入推敲的關鍵決策或難題..."
              rows={3}
              required
              className="w-full px-4 py-3 bg-stone-950/95 border border-amber-800/60 rounded-2xl text-stone-100 placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/80 transition-all resize-none font-sans shadow-inner leading-relaxed"
            />

            {/* Presets: "載入範例議題" (exactly first 2) */}
            <div className="mt-2.5">
              <span className="text-xs text-amber-300/80 mr-2 flex items-center gap-1 inline-flex font-serif">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> 載入範例議題：
              </span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {PRESET_TOPICS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(preset.topic)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-850 border border-amber-700/50 text-amber-200 hover:text-white transition-all cursor-pointer font-serif flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="text-amber-400 font-bold">[{preset.tag}]</span>
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Choose Your Role */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-serif font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-amber-400" />
                <span>二、閣下於圓桌所執掌之座次頂冠</span>
              </label>
              <span className="text-[11px] text-amber-400/80 font-serif">
                會議中可隨時換帽
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {hatsList.map((h) => {
                const cfg = HAT_CONFIGS[h];
                const isSelected = userRole === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setUserRole(h)}
                    className={`relative p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/40 shadow-lg'
                        : 'bg-stone-950/80 border-stone-800 hover:border-amber-700/60'
                    }`}
                  >
                    <HatIcon hat={h} size={32} glow={isSelected} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-serif font-bold text-amber-100">{cfg.name}</span>
                        {isSelected && (
                          <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-auto" />
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 font-serif">
                        {cfg.roleTitle}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Observer option */}
              <button
                type="button"
                onClick={() => setUserRole('observer')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer col-span-2 sm:col-span-3 ${
                  userRole === 'observer'
                    ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/40 shadow-lg'
                    : 'bg-stone-950/80 border-stone-800 hover:border-amber-700/60'
                }`}
              >
                <div className="w-[32px] h-[32px] rounded-xl bg-stone-900 border border-amber-700/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Eye className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-bold text-amber-100">御前觀議者 (Observateur)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800/40 text-amber-300 font-serif">
                      列席聆聽智囊交鋒
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5 font-serif">
                    不固定佩戴特定頂冠，由 6 位宮廷顧問展開交鋒，您可隨時插話或傳喚。
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Discussion Sequence & Atmosphere */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800/80">
            <div>
              <label className="block text-xs font-serif font-bold text-amber-200 uppercase tracking-wider mb-2">
                三、思維序列規程
              </label>
              <select
                value={sequenceMode}
                onChange={(e) => setSequenceMode(e.target.value as DiscussionSequenceMode)}
                className="w-full px-3 py-2 bg-stone-950 border border-amber-800/60 rounded-xl text-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-serif"
              >
                {DISCUSSION_SEQUENCES.map((seq) => (
                  <option key={seq.id} value={seq.id}>
                    {seq.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-400 mt-1 font-serif">
                {DISCUSSION_SEQUENCES.find((s) => s.id === sequenceMode)?.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-amber-200 uppercase tracking-wider mb-2">
                四、議事交鋒氛圍
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIntensity('collaborative')}
                  className={`p-2 rounded-xl border text-center text-xs font-serif font-medium transition-all cursor-pointer ${
                    intensity === 'collaborative'
                      ? 'bg-amber-900/40 border-amber-400 text-amber-100'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  ⚜️ 務實共創
                  <span className="block text-[10px] text-stone-500 mt-0.5">承接見解、遞進深挖</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntensity('critical')}
                  className={`p-2 rounded-xl border text-center text-xs font-serif font-medium transition-all cursor-pointer ${
                    intensity === 'critical'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  ⚡ 犀利交鋒
                  <span className="block text-[10px] text-stone-500 mt-0.5">剖析死穴、直切盲點</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
            {initialTopic && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-serif text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
              >
                保留既有議程
              </button>
            )}
            <button
              type="submit"
              disabled={!topic.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white text-xs sm:text-sm font-serif font-bold shadow-lg shadow-amber-900/40 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer border border-amber-400/60"
            >
              <Play className="w-4 h-4 fill-current text-amber-200" />
              <span>⚜️ 簽署詔書 · 啟動御前沙龍</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
