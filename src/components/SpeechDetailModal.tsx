import React, { useState } from 'react';
import { ChatMessage, HAT_CONFIGS } from '../types/hats';
import { HatIcon } from './HatIcon';
import { formatFormattedContent } from '../utils/textFormatter';
import { X, Volume2, MessageSquarePlus, Copy, Check, Sparkles } from 'lucide-react';

interface SpeechDetailModalProps {
  message: ChatMessage | null;
  onClose: () => void;
  onPlaySpeech: (text: string, hat: any) => void;
  onReply: (message: ChatMessage) => void;
}

export const SpeechDetailModal: React.FC<SpeechDetailModalProps> = ({
  message,
  onClose,
  onPlaySpeech,
  onReply,
}) => {
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  const config = HAT_CONFIGS[message.hat];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-stone-950 border border-amber-600/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{ borderColor: config.hex }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b border-stone-800"
          style={{
            background: `linear-gradient(135deg, ${config.hex}22 0%, rgba(28,25,23,0.95) 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <HatIcon hat={message.hat} size={42} glow />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-amber-100">
                  {message.speakerName}
                </h3>
                {message.isUser && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-semibold">
                    您
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 font-serif">
                {config.roleTitle} · {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Question reminder */}
        <div className="px-6 py-2.5 bg-stone-900/60 border-b border-stone-800 text-xs flex items-center gap-2 text-stone-300">
          <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: config.hex }} />
          <span className="font-serif">思考視角：<strong className="text-amber-200">{config.coreQuestion}</strong></span>
        </div>

        {/* Full Scrollable Content with Markdown formatting */}
        <div className="flex-1 p-6 overflow-y-auto select-text">
          <div className="text-stone-200 text-sm sm:text-base leading-relaxed font-sans">
            {formatFormattedContent(message.text)}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlaySpeech(message.text, message.hat)}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-serif font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-800/40"
              title="語音朗誦"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>語音朗誦</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-800"
              title="複製發言內容"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onReply(message);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs font-serif font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/40"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>針對此發言回應</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-serif cursor-pointer border border-stone-800"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
