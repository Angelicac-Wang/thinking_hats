import React, { useState } from 'react';
import { ChatMessage, HatType, HAT_CONFIGS } from '../types/hats';
import { HatIcon } from './HatIcon';
import { formatFormattedContent } from '../utils/textFormatter';
import { X, Volume2, MessageSquarePlus, Download, Filter } from 'lucide-react';

interface TranscriptDrawerProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onClose: () => void;
  onPlaySpeech: (text: string, hat: HatType) => void;
  onSelectReply: (message: ChatMessage) => void;
}

export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({
  isOpen,
  messages,
  onClose,
  onPlaySpeech,
  onSelectReply,
}) => {
  const [filterHat, setFilterHat] = useState<HatType | 'all'>('all');

  if (!isOpen) return null;

  const filteredMessages = filterHat === 'all'
    ? messages
    : messages.filter((m) => m.hat === filterHat);

  const handleExportText = () => {
    const text = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.speakerName} (${m.hat}):\n${m.text}\n`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `六頂思考帽會議紀錄-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hatsList: HatType[] = ['blue', 'white', 'green', 'yellow', 'black', 'red'];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900/98 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">圓桌發言歷程</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {messages.length} 則
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportText}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="下載文字紀錄"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="p-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setFilterHat('all')}
          className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
            filterHat === 'all'
              ? 'bg-indigo-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          全部
        </button>
        {hatsList.map((h) => {
          const cfg = HAT_CONFIGS[h];
          const isSelected = filterHat === h;
          return (
            <button
              key={h}
              onClick={() => setFilterHat(h)}
              className={`px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              style={{
                borderColor: isSelected ? cfg.hex : 'transparent',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.hex }} />
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            目前尚無發言紀錄
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const cfg = HAT_CONFIGS[msg.hat];
            return (
              <div
                key={msg.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-md hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-900">
                  <div className="flex items-center gap-1.5">
                    <HatIcon hat={msg.hat} size={22} />
                    <span className="text-xs font-bold text-white">
                      {msg.speakerName}
                    </span>
                    {msg.isUser && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                        您
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 mr-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => onPlaySpeech(msg.text, msg.hat)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="朗讀"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onSelectReply(msg)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="回應此發言"
                    >
                      <MessageSquarePlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-stone-200 leading-relaxed select-text font-sans">
                  {formatFormattedContent(msg.text)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
