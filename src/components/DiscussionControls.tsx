import React, { useState } from 'react';
import { HatType, HAT_CONFIGS, UserRole } from '../types/hats';
import { HatIcon } from './HatIcon';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Pause,
  ChevronUp,
  Crown,
  Scale,
  Compass,
} from 'lucide-react';

interface DiscussionControlsProps {
  userRole: UserRole;
  currentSpeaker: HatType | null;
  isGenerating: boolean;
  isFullRoundRunning: boolean;
  voiceEnabled: boolean;
  onSendMessage: (text: string) => void;
  onNextSpeaker: () => void;
  onPlayFullRound: () => void;
  onPauseFullRound: () => void;
  onToggleVoice: () => void;
  onSwitchUserRole: (hat: HatType) => void;
  onOpenProvocation?: () => void;
  onOpenBalance?: () => void;
  replyToSpeaker?: string | null;
  onClearReply?: () => void;
}

export const DiscussionControls: React.FC<DiscussionControlsProps> = ({
  userRole,
  isGenerating,
  isFullRoundRunning,
  voiceEnabled,
  onSendMessage,
  onNextSpeaker,
  onPlayFullRound,
  onPauseFullRound,
  onToggleVoice,
  onSwitchUserRole,
  onOpenProvocation,
  onOpenBalance,
  replyToSpeaker,
  onClearReply,
}) => {
  const [inputText, setInputText] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (onClearReply) onClearReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const userHatConfig = userRole !== 'observer' ? HAT_CONFIGS[userRole] : null;
  const hatsList: HatType[] = ['blue', 'white', 'green', 'yellow', 'black', 'red'];

  // Two-line expansion logic: when text is longer than ~26 chars or contains newline
  const isMultiLine = inputText.length > 26 || inputText.includes('\n');

  return (
    <div className="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-6 pb-2">
      {/* Role Switcher Popover */}
      {showRoleMenu && (
        <div className="absolute bottom-full mb-3 left-4 sm:left-6 z-40 p-3 bg-stone-950/98 border border-amber-700/80 rounded-2xl shadow-2xl backdrop-blur-xl w-72 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-xs font-serif font-bold text-amber-200 mb-2 px-1 flex items-center justify-between">
            <span>更換席位佩戴之頂冠</span>
            <span className="text-[10px] text-amber-400/80">狄波諾換帽術</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {hatsList.map((h) => {
              const cfg = HAT_CONFIGS[h];
              const isCurrent = userRole === h;
              return (
                <button
                  key={h}
                  onClick={() => {
                    onSwitchUserRole(h);
                    setShowRoleMenu(false);
                  }}
                  className={`p-2 rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-900/40 border border-amber-500/60 text-amber-100'
                      : 'hover:bg-stone-900 text-stone-300'
                  }`}
                >
                  <HatIcon hat={h} size={22} />
                  <span className="text-xs font-serif font-semibold">{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Bar Card */}
      <div className="bg-stone-950/95 border border-amber-800/50 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl space-y-1.5">
        {/* Reply Indicator banner */}
        {replyToSpeaker && (
          <div className="flex items-center justify-between px-3 py-1 bg-amber-950/50 rounded-lg text-xs text-amber-200 border border-amber-600/30 font-serif">
            <span>正在承接【{replyToSpeaker}】之見解進行深論...</span>
            <button
              onClick={onClearReply}
              className="text-stone-400 hover:text-white text-xs cursor-pointer"
            >
              取消
            </button>
          </div>
        )}

        {/* Input Form with 2-line expandable textarea */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Role badge / switcher toggle */}
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-amber-700/40 text-stone-200 text-xs font-serif font-medium transition-all cursor-pointer shrink-0 self-stretch justify-center"
            title="點擊切換您佩戴的頂冠"
          >
            {userHatConfig ? (
              <>
                <HatIcon hat={userHatConfig.id} size={20} />
                <span className="hidden sm:inline font-bold" style={{ color: userHatConfig.hex }}>
                  {userHatConfig.name}
                </span>
                <span className="text-[10px] text-amber-400/80 hidden md:inline">
                  (您)
                </span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-amber-300 font-medium">觀議者</span>
              </>
            )}
            <ChevronUp className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
          </button>

          {/* Text Area: smoothly expands to exactly 2 lines height when text is long, with scrollbar */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            rows={isMultiLine ? 2 : 1}
            placeholder={
              userHatConfig
                ? `以【${userHatConfig.name} · ${userHatConfig.focus.split('、')[0]}】角度提出見解 (Enter 發送)...`
                : '作為御前智囊成員發表看法 (Enter 發送)...'
            }
            className={`flex-1 px-3.5 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/80 transition-all resize-none overflow-y-auto leading-relaxed ${
              isMultiLine ? 'h-14 py-2' : 'h-9 py-2'
            }`}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="p-2 sm:px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:opacity-40 text-white text-xs font-serif font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-amber-500/30 self-stretch justify-center"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">陳述</span>
          </button>
        </form>

        {/* Action Toolbar: Clean, sleek, non-redundant */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-xs">
          {/* Left: Speaker triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onNextSpeaker}
              disabled={isGenerating}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-700/50 disabled:opacity-50 text-amber-200 text-[11px] sm:text-xs font-serif font-medium transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>邀請下位</span>
            </button>

            {/* 全員巡迴 / 暫停巡迴 切換按鈕 */}
            <button
              onClick={isFullRoundRunning ? onPauseFullRound : onPlayFullRound}
              disabled={isGenerating && !isFullRoundRunning}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-serif transition-all flex items-center gap-1 cursor-pointer ${
                isFullRoundRunning
                  ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-500/60 text-rose-200 animate-pulse font-bold'
                  : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
              }`}
              title={isFullRoundRunning ? '點擊暫停全員巡迴發言' : '依序讓尚未發言的顧問發表看法'}
            >
              {isFullRoundRunning ? (
                <>
                  <Pause className="w-3 h-3 text-rose-400" />
                  <span>暫停巡迴</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 text-stone-400" />
                  <span className="hidden sm:inline">全員巡迴</span>
                  <span className="sm:hidden">巡迴</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleVoice}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                voiceEnabled
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
              title={voiceEnabled ? '語音朗誦開啟' : '已靜音'}
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Right: Innovative Lateral Thinking & Balance Tools (No redundant Report/Settings) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {onOpenProvocation && (
              <button
                onClick={onOpenProvocation}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/80 to-stone-900 hover:from-amber-900/80 hover:to-stone-850 border border-amber-700/60 text-amber-200 text-[11px] sm:text-xs font-serif font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="狄波諾 PO 側向突圍詰問器"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>側向突圍 (PO)</span>
              </button>
            )}

            {onOpenBalance && (
              <button
                onClick={onOpenBalance}
                className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-700/40 text-stone-300 hover:text-amber-200 text-[11px] sm:text-xs font-serif transition-all flex items-center gap-1.5 cursor-pointer"
                title="查閱六維思維平衡儀與盲點評估"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">思維平衡儀</span>
                <span className="sm:hidden">平衡儀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
