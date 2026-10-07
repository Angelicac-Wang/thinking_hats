import React, { useState } from 'react';
import { FileText, Copy, Download, Check, Sparkles, X, RefreshCw, Printer } from 'lucide-react';
import { renderInlineMarkdown } from '../utils/textFormatter';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  topic: string;
  markdown: string;
  isLoading: boolean;
  onRegenerate: () => void;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  topic,
  markdown,
  isLoading,
  onRegenerate,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `六頂思考帽決策簡報-${topic.slice(0, 15)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                六頂思考帽 · 決策白皮書
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                  藍帽主席收斂
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-md">
                主題：{topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={isLoading || !markdown}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="複製到剪貼簿"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading || !markdown}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="下載 Markdown 檔"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              disabled={isLoading || !markdown}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="列印 / 匯出 PDF 詔書"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto text-slate-200">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
              <div className="relative">
                <Sparkles className="w-10 h-10 text-indigo-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                藍帽主席正在整合 6 頂思考帽的所有觀點...
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                盤點已知事實、提煉團隊直覺、篩選關鍵風險、鎖定最大收益並擬定具體行動步驟
              </p>
            </div>
          ) : markdown ? (
            <div className="prose prose-invert prose-indigo max-w-none text-sm space-y-4 leading-relaxed font-sans">
              {markdown.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-xl font-bold text-white pb-2 border-b border-slate-800">
                      {renderInlineMarkdown(line.replace('# ', ''))}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-base font-bold text-indigo-300 pt-3 pb-1 border-b border-slate-800/60">
                      {renderInlineMarkdown(line.replace('## ', ''))}
                    </h2>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={idx} className="text-slate-300 ml-4 list-disc">
                      {renderInlineMarkdown(line.replace('- ', ''))}
                    </li>
                  );
                }
                if (!line.trim()) {
                  return <div key={idx} className="h-1" />;
                }
                return (
                  <p key={idx} className="text-slate-300">
                    {renderInlineMarkdown(line)}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              尚未產出報告，點擊下方重新生成按鈕。
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            基於狄波諾側向思維模型 · 涵蓋 6 大面向決策視角
          </span>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>重新總結報告</span>
          </button>
        </div>
      </div>
    </div>
  );
};
