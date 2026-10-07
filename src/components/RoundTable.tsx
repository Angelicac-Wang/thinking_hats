import React, { useState, useEffect } from 'react';
import { HatType, HAT_CONFIGS, UserRole, ChatMessage } from '../types/hats';
import { HatIcon } from './HatIcon';
import { formatFormattedContent } from '../utils/textFormatter';
import {
  Volume2,
  Sparkles,
  User,
  Bot,
  MessageSquarePlus,
  RefreshCw,
  Pause,
  Eye,
  X,
  Maximize2,
  MessageCircle,
  Info,
  Crown,
  Swords,
  ChevronDown,
} from 'lucide-react';

interface RoundTableProps {
  topic: string;
  userRole: UserRole;
  currentSpeaker: HatType | null;
  isGenerating: boolean;
  isFullRoundRunning: boolean;
  latestMessageByHat: Partial<Record<HatType, ChatMessage>>;
  onSeatClick: (hat: HatType) => void;
  onSummonSpeaker: (hat: HatType) => void;
  onSwitchUserRole: (hat: HatType) => void;
  onNextSpeaker: () => void;
  onPlayFullRound: () => void;
  onPauseFullRound: () => void;
  onSelectMessageToReply: (message: ChatMessage) => void;
  onPlaySpeech: (text: string, hat: HatType) => void;
  onOpenFullMessage: (message: ChatMessage) => void;
  onOpenTopicModal?: () => void;
  onCrossExamine?: (sourceMsg: ChatMessage, targetHat: HatType) => void;
  onCancelGenerating?: () => void;
}

// Seat positions around the oval table
const SEAT_POSITIONS: Record<HatType, string> = {
  blue: 'top-[1%] left-1/2 -translate-x-1/2',
  white: 'top-[15%] right-[6%] sm:right-[12%]',
  yellow: 'bottom-[15%] right-[6%] sm:right-[12%]',
  red: 'bottom-[1%] left-1/2 -translate-x-1/2',
  black: 'bottom-[15%] left-[6%] sm:left-[12%]',
  green: 'top-[15%] left-[6%] sm:left-[12%]',
};

export const RoundTable: React.FC<RoundTableProps> = ({
  userRole,
  currentSpeaker,
  isGenerating,
  isFullRoundRunning,
  latestMessageByHat,
  onSeatClick,
  onSummonSpeaker,
  onSwitchUserRole,
  onNextSpeaker,
  onPlayFullRound,
  onPauseFullRound,
  onSelectMessageToReply,
  onPlaySpeech,
  onOpenFullMessage,
  onCrossExamine,
  onCancelGenerating,
}) => {
  // Track closed bubbles per hat
  const [closedBubbles, setClosedBubbles] = useState<Record<string, boolean>>({});
  // Track open bubbles history queue: MAXIMUM 2 SPEECH BUBBLES simultaneously
  const [activeQueue, setActiveQueue] = useState<HatType[]>([]);
  // Track open cross-examine dropdown for a specific hat
  const [crossExamineHat, setCrossExamineHat] = useState<HatType | null>(null);

  // Function to register an open bubble, ensuring at most 2 remain open
  const openBubbleWithLimit = (newHat: HatType) => {
    setActiveQueue((prev) => {
      const filtered = prev.filter((h) => h !== newHat);
      const nextQueue = [...filtered, newHat];

      if (nextQueue.length > 2) {
        const oldest = nextQueue.shift()!;
        setClosedBubbles((c) => ({
          ...c,
          [oldest]: true,
          [newHat]: false,
        }));
        return nextQueue;
      }

      setClosedBubbles((c) => ({
        ...c,
        [newHat]: false,
      }));
      return nextQueue;
    });
  };

  // Auto-manage bubbles when new speaker produces a message
  useEffect(() => {
    if (currentSpeaker && latestMessageByHat[currentSpeaker]) {
      openBubbleWithLimit(currentSpeaker);
    }
  }, [currentSpeaker, latestMessageByHat]);

  // Click empty space to dismiss all speech bubbles and dropdowns
  const handleDismissAll = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
      return;
    }
    setClosedBubbles({
      white: true,
      red: true,
      black: true,
      yellow: true,
      green: true,
      blue: true,
    });
    setActiveQueue([]);
    setCrossExamineHat(null);
  };

  const toggleBubble = (hat: HatType, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyClosed = !!closedBubbles[hat];
    if (isCurrentlyClosed) {
      openBubbleWithLimit(hat);
    } else {
      setClosedBubbles((prev) => ({
        ...prev,
        [hat]: true,
      }));
      setActiveQueue((prev) => prev.filter((h) => h !== hat));
    }
  };

  const handleHatClick = (hat: HatType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating) return;
    openBubbleWithLimit(hat);
    onSummonSpeaker(hat);
  };

  const seatsList: HatType[] = ['blue', 'white', 'yellow', 'red', 'black', 'green'];

  // Check which bubbles are active in the max-2 queue
  const isBlueActive = activeQueue.includes('blue') && !closedBubbles.blue && !!latestMessageByHat.blue;
  const isRedActive = activeQueue.includes('red') && !closedBubbles.red && !!latestMessageByHat.red;
  const isBothBlueAndRed = isBlueActive && isRedActive;

  const hasWhite = activeQueue.includes('white') && !closedBubbles.white;
  const hasYellow = activeQueue.includes('yellow') && !closedBubbles.yellow;
  const hasGreen = activeQueue.includes('green') && !closedBubbles.green;
  const hasBlack = activeQueue.includes('black') && !closedBubbles.black;

  /**
   * Helper to render speech bubble UI
   */
  const renderSpeechBubbleCard = (
    hat: HatType,
    msg: ChatMessage,
    heightClass: string,
    onCloseClick: (e: React.MouseEvent) => void
  ) => {
    const config = HAT_CONFIGS[hat];
    const isCrossExamineOpen = crossExamineHat === hat;
    const otherHats = seatsList.filter((h) => h !== hat);

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`p-3 sm:p-3.5 rounded-2xl backdrop-blur-xl bg-stone-950/98 border shadow-2xl text-left flex flex-col ${heightClass} transition-all hover:border-amber-500/60 relative`}
        style={{
          borderColor: config.hex,
          boxShadow: `0 10px 30px -5px ${config.glowColor}, 0 4px 15px rgba(0,0,0,0.85)`,
        }}
      >
        {/* Cross-Examine Dropdown Popover */}
        {isCrossExamineOpen && onCrossExamine && (
          <div className="absolute top-full mt-1.5 left-2 right-2 z-50 p-2.5 bg-stone-950/98 border border-amber-600/80 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
            <div className="text-[11px] font-serif font-bold text-amber-200 mb-2 px-1 flex items-center justify-between border-b border-stone-800 pb-1">
              <span className="flex items-center gap-1">
                <Swords className="w-3 h-3 text-amber-400" />
                <span>傳喚指定帽子針對此發言交鋒</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCrossExamineHat(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {otherHats.map((target) => {
                const targetCfg = HAT_CONFIGS[target];
                return (
                  <button
                    key={target}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCrossExamineHat(null);
                      onCrossExamine(msg, target);
                    }}
                    className="p-1.5 rounded-xl hover:bg-stone-900 border border-transparent hover:border-amber-700/50 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <HatIcon hat={target} size={18} />
                      <span className="text-xs font-serif font-bold" style={{ color: targetCfg.hex }}>
                        {targetCfg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-serif">
                      {target === 'black' && '質疑盲點與死穴'}
                      {target === 'yellow' && '發掘效益與收益'}
                      {target === 'green' && '尋求替代破局點'}
                      {target === 'white' && '查證事實與數據'}
                      {target === 'red' && '檢驗直覺與感受'}
                      {target === 'blue' && '調解並推進決策'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bubble Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: config.hex }}
            />
            <span className="text-xs font-bold text-amber-100 font-serif">
              {msg.speakerName}
            </span>
            {msg.isUser && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                您
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlaySpeech(msg.text, hat);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="語音朗誦"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* Direct Rebuttal / Cross-Examine button */}
            {onCrossExamine && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCrossExamineHat(isCrossExamineOpen ? null : hat);
                }}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isCrossExamineOpen
                    ? 'bg-amber-900 text-amber-200'
                    : 'text-stone-400 hover:text-amber-300 hover:bg-stone-800'
                }`}
                title="傳喚指定帽子對此論點交鋒反駁"
              >
                <Swords className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectMessageToReply(msg);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="承接並回應此發言"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFullMessage(msg);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="放大檢視全文"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCloseClick}
              className="p-1 rounded-md text-stone-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="收起此發言框"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Speech Text with markdown bold parsed */}
        <div className="mt-1.5 flex-1 overflow-y-auto pr-1 text-xs text-stone-200 leading-relaxed select-text font-sans">
          {formatFormattedContent(msg.text)}
        </div>

        {/* Bottom hint */}
        <div className="pt-1.5 mt-1 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
          {onCrossExamine ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCrossExamineHat(isCrossExamineOpen ? null : hat);
              }}
              className="text-amber-400/90 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer font-serif"
            >
              <Swords className="w-2.5 h-2.5" />
              <span>點名交鋒</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={() => onOpenFullMessage(msg)}
            className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
          >
            放大閱讀 →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={handleDismissAll}
      className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-visible px-2 sm:px-6 cursor-default"
    >
      {/* European Aristocratic Salon Background Glow */}
      <div className="absolute inset-0 bg-radial from-amber-950/25 via-stone-950 to-stone-950 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Main Oval Royal Table */}
      <div
        onClick={handleDismissAll}
        className="relative w-[92%] max-w-[750px] aspect-[16/9.2] flex items-center justify-center my-auto cursor-default"
      >
        {/* Floor Shadow */}
        <div className="absolute w-[84%] h-[76%] rounded-[50%] bg-black/80 blur-3xl transform translate-y-8 pointer-events-none" />

        {/* Outer Heavy Walnut Carved Table Rim with Gilded Brass Trim */}
        <div
          className="relative w-[80%] h-[72%] rounded-[50%] p-3.5 sm:p-4.5 shadow-2xl transition-all duration-700"
          style={{
            background: 'radial-gradient(ellipse at 50% 25%, #451a03 0%, #291207 40%, #170903 80%, #0c0402 100%)',
            boxShadow:
              '0 25px 60px -15px rgba(0, 0, 0, 0.95), inset 0 2px 5px rgba(251, 191, 36, 0.35), inset 0 -5px 16px rgba(0,0,0,0.9)',
            border: '2px solid rgba(217, 119, 6, 0.45)',
          }}
        >
          {/* Inner Inlaid Leather & Polished Rosewood Surface */}
          <div
            className="relative w-full h-full rounded-[50%] flex items-center justify-center p-2.5 transition-all"
            style={{
              background: 'radial-gradient(ellipse at 50% 35%, #2a1106 0%, #1a0a03 55%, #0f0502 100%)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              boxShadow: 'inset 0 0 45px rgba(0, 0, 0, 0.85)',
            }}
          >
            {/* Ornate Gold Filigree Pattern Ring */}
            <div
              className="absolute inset-4 sm:inset-6 rounded-[50%] border border-dashed border-amber-600/30 pointer-events-none"
              style={{ boxShadow: '0 0 15px rgba(245, 158, 11, 0.05)' }}
            />

            {/* Central Royal Crest Hub */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-[74%] max-w-[300px] aspect-[16/10.5] rounded-2xl sm:rounded-3xl p-3 flex flex-col items-center justify-center text-center backdrop-blur-md bg-stone-950/90 border border-amber-700/50 shadow-2xl transition-all hover:border-amber-500/80"
              style={{
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8), inset 0 1px 2px rgba(251, 191, 36, 0.2)',
              }}
            >
              {/* European Crest Badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/40 text-[10px] text-amber-300 mb-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="font-serif tracking-wider font-semibold">御前思維沙龍 · 圓桌</span>
              </div>

              {/* Status indicator */}
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-200/80">
                {isGenerating ? (
                  <div className="flex items-center gap-1.5 text-amber-300 font-medium bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/40 animate-pulse font-serif">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>
                      {currentSpeaker
                        ? `${HAT_CONFIGS[currentSpeaker].name} 正在審慎沉思...`
                        : '顧問思考中...'}
                    </span>
                    {onCancelGenerating && (
                      <button
                        onClick={onCancelGenerating}
                        className="text-[10px] text-amber-400/80 hover:text-white underline ml-1 cursor-pointer font-sans"
                        title="取消思考等待"
                      >
                        取消
                      </button>
                    )}
                  </div>
                ) : currentSpeaker ? (
                  <span className="text-stone-300 text-xs font-serif">
                    席次發言：
                    <span
                      className="font-bold ml-1"
                      style={{ color: HAT_CONFIGS[currentSpeaker].hex }}
                    >
                      {HAT_CONFIGS[currentSpeaker].name}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 font-serif">點擊席位頂冠即可邀請發言</span>
                )}
              </div>

              {/* Center Quick Action Buttons */}
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={onNextSpeaker}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-serif font-bold shadow-md hover:shadow-amber-600/30 transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/40"
                >
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>邀請下位</span>
                </button>

                <button
                  onClick={isFullRoundRunning ? onPauseFullRound : onPlayFullRound}
                  disabled={isGenerating && !isFullRoundRunning}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-serif transition-all flex items-center gap-1 cursor-pointer ${
                    isFullRoundRunning
                      ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-500/60 text-rose-200 animate-pulse font-bold'
                      : 'bg-stone-900 hover:bg-stone-800 border-amber-700/40 text-amber-200'
                  }`}
                  title={isFullRoundRunning ? '點擊暫停全體輪流發言' : '依序讓全體智囊成員發表看法'}
                >
                  {isFullRoundRunning ? (
                    <>
                      <Pause className="w-3 h-3 text-rose-400" />
                      <span>暫停巡迴</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      <span>全員巡迴</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TABLE-CENTERED BUBBLES: BLUE & RED HATS
            - Blue hat: Centered on table surface. If both active, pulled to top-[15%]
            - Red hat: Positioned in lower center. If both active, pulled to bottom-[15%]
            - Height bounded to max-h-32/36 with smooth scroll so they NEVER touch!
           ========================================================================= */}
        {isBlueActive && latestMessageByHat.blue && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-35 pointer-events-auto transition-all duration-300 w-64 sm:w-76 md:w-84 max-w-[88vw] animate-in fade-in zoom-in-95 ${
              isBothBlueAndRed
                ? 'top-[15%] sm:top-[17%] left-1/2 -translate-x-1/2'
                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            }`}
          >
            {renderSpeechBubbleCard(
              'blue',
              latestMessageByHat.blue,
              isBothBlueAndRed ? 'max-h-32 sm:max-h-36' : 'max-h-44 sm:max-h-52',
              (e) => toggleBubble('blue', e)
            )}
          </div>
        )}

        {isRedActive && latestMessageByHat.red && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-35 pointer-events-auto transition-all duration-300 w-64 sm:w-76 md:w-84 max-w-[88vw] animate-in fade-in zoom-in-95 ${
              isBothBlueAndRed
                ? 'bottom-[15%] sm:bottom-[17%] left-1/2 -translate-x-1/2'
                : 'bottom-[15%] sm:bottom-[17%] left-1/2 -translate-x-1/2'
            }`}
          >
            {renderSpeechBubbleCard(
              'red',
              latestMessageByHat.red,
              isBothBlueAndRed ? 'max-h-32 sm:max-h-36' : 'max-h-44 sm:max-h-52',
              (e) => toggleBubble('red', e)
            )}
          </div>
        )}

        {/* 6 Aristocratic Seats positioned around the table */}
        {seatsList.map((hat) => {
          const config = HAT_CONFIGS[hat];
          const isUser = userRole === hat;
          const isSpeaking = currentSpeaker === hat;
          const latestMsg = latestMessageByHat[hat];
          const isBubbleClosed = !!closedBubbles[hat];
          const posClass = SEAT_POSITIONS[hat];

          // Determine dynamic bubble position for SIDE HATS (White, Yellow, Green, Black):
          // Centered comfortably beside seats, NOT pushed into top banner or bottom dock!
          let sideBubblePos = '';
          let sideBubbleHeight = 'max-h-36 sm:max-h-42';

          if (hat === 'white') {
            if (hasYellow) {
              // Both right hats open: upper hat (white) shifted gently up (-top-6)
              sideBubblePos = 'left-full ml-3.5 -top-6 sm:-top-8';
            } else {
              sideBubblePos = 'left-full ml-3.5 top-0';
            }
          } else if (hat === 'yellow') {
            if (hasWhite) {
              // Both right hats open: lower hat (yellow) aligned near its seat (top-1)
              sideBubblePos = 'left-full ml-3.5 top-1 sm:top-2';
            } else {
              sideBubblePos = 'left-full ml-3.5 bottom-0';
            }
          } else if (hat === 'green') {
            if (hasBlack) {
              // Both left hats open: upper hat (green) shifted gently up (-top-6)
              sideBubblePos = 'right-full mr-3.5 -top-6 sm:-top-8';
            } else {
              sideBubblePos = 'right-full mr-3.5 top-0';
            }
          } else if (hat === 'black') {
            if (hasGreen) {
              // Both left hats open: lower hat (black) aligned near its seat (top-1)
              sideBubblePos = 'right-full mr-3.5 top-1 sm:top-2';
            } else {
              sideBubblePos = 'right-full mr-3.5 bottom-0';
            }
          }

          // Blue and Red bubbles are rendered table-centered above!
          const isSideHat = hat !== 'blue' && hat !== 'red';

          return (
            <div
              key={hat}
              className={`absolute ${posClass} z-20 flex flex-col items-center`}
            >
              {/* SIDE HAT SPEECH BUBBLES: White, Yellow, Green, Black */}
              {isSideHat && latestMsg && !isBubbleClosed && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute z-30 pointer-events-auto transition-all duration-300 w-60 sm:w-72 md:w-80 animate-in fade-in zoom-in-95 ${sideBubblePos}`}
                >
                  {renderSpeechBubbleCard(
                    hat,
                    latestMsg,
                    sideBubbleHeight,
                    (e) => toggleBubble(hat, e)
                  )}
                </div>
              )}

              {/* Collapsed Pill Button for ANY closed bubble */}
              {latestMsg && isBubbleClosed && (
                <button
                  onClick={(e) => toggleBubble(hat, e)}
                  className="absolute -top-3.5 z-30 px-2.5 py-0.5 rounded-full bg-stone-900/95 hover:bg-stone-800 border text-[10px] text-amber-200 flex items-center gap-1 shadow-md transition-all cursor-pointer animate-in fade-in whitespace-nowrap shrink-0"
                  style={{ borderColor: config.hex }}
                  title="展開查看發言"
                >
                  <MessageCircle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="whitespace-nowrap">查看發言</span>
                </button>
              )}

              {/* Pulsing halo when speaking */}
              {isSpeaking && (
                <div
                  className="absolute -inset-3 rounded-full animate-ping pointer-events-none opacity-40"
                  style={{ backgroundColor: config.hex }}
                />
              )}

              {/* Hat Avatar with Hover Menu */}
              <div className="relative group/hat flex flex-col items-center">
                <div
                  onClick={(e) => handleHatClick(hat, e)}
                  className={`relative flex flex-col items-center p-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSpeaking ? 'ring-4 scale-105' : ''
                  }`}
                  style={{
                    boxShadow: isSpeaking
                      ? `0 0 25px ${config.glowColor}, inset 0 0 15px ${config.glowColor}`
                      : undefined,
                    borderColor: isSpeaking ? config.hex : undefined,
                  }}
                  title="點擊此席位頂冠直接邀請發言"
                >
                  <div className="relative mb-1">
                    <HatIcon
                      hat={hat}
                      size={48}
                      glow={isSpeaking || isUser}
                      className="transition-transform duration-300 hover:-translate-y-1"
                    />

                    <div
                      className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 border shadow-sm ${
                        isUser
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-700'
                      }`}
                    >
                      {isUser ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5" />}
                      <span>{isUser ? '您' : 'AI'}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span
                        className="text-xs font-bold font-serif transition-colors"
                        style={{ color: isSpeaking ? '#ffffff' : config.hex }}
                      >
                        {config.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 block max-w-[85px] truncate font-serif">
                      {config.roleTitle.split('與')[0]}
                    </span>
                  </div>
                </div>

                {/* Popover on Hat Hover: Generous hover bridge so buttons can be easily clicked */}
                <div className="absolute top-full -mt-1 pt-2 hidden group-hover/hat:flex flex-col items-center z-40 pointer-events-auto">
                  <div className="flex items-center gap-1 p-1 bg-stone-950/98 border border-amber-700/80 rounded-xl shadow-2xl whitespace-nowrap backdrop-blur-md animate-in fade-in duration-150">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeatClick(hat);
                      }}
                      className="px-2 py-1 rounded-lg text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-200 transition-colors flex items-center gap-1 cursor-pointer font-serif"
                    >
                      <Info className="w-3 h-3 text-amber-400" />
                      <span>查看介紹</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSwitchUserRole(hat);
                      }}
                      className={`px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer font-serif ${
                        isUser
                          ? 'bg-amber-700 text-white font-medium'
                          : 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/40'
                      }`}
                    >
                      {isUser ? '目前角色' : '扮演此帽'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Observer Notice */}
      {userRole === 'observer' && (
        <div className="mt-1 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-950/90 border border-amber-700/50 text-amber-200/90 text-[11px] backdrop-blur-md font-serif">
          <Eye className="w-3 h-3 text-amber-400" />
          <span>您目前以【御前觀議者】身分列席，點擊任意頂冠即可傳喚發言</span>
        </div>
      )}
    </div>
  );
};
