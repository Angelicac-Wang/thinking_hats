import React, { useState, useRef } from 'react';
import {
  HatType,
  HAT_CONFIGS,
  UserRole,
  ChatMessage,
  DiscussionSequenceMode,
  DISCUSSION_SEQUENCES,
} from './types/hats';
import { RoundTable } from './components/RoundTable';
import { DiscussionControls } from './components/DiscussionControls';
import { TopicModal } from './components/TopicModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { TranscriptDrawer } from './components/TranscriptDrawer';
import { HatDetailModal } from './components/HatDetailModal';
import { SpeechDetailModal } from './components/SpeechDetailModal';
import { CognitiveBalanceModal } from './components/CognitiveBalanceModal';
import { ProvocationModal } from './components/ProvocationModal';
import { speechManager } from './utils/speech';
import {
  Sparkles,
  FileText,
  ListFilter,
  Volume2,
  VolumeX,
  Settings,
  Edit3,
} from 'lucide-react';

const INITIAL_TOPIC = '我正在考慮辭去目前的穩定工程師工作，全職投入開發一款專為自由工作者設計的 AI 自動化助理。';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'intro-blue',
    timestamp: Date.now() - 30000,
    hat: 'blue',
    speakerName: '藍帽 (御前首席主席)',
    isUser: false,
    text: '諸位顧問請就席。今日審議議案為「全職投入開發自由工作者 AI 自動化助理」。我們將依序客觀盤點數據、驗證直覺心理、排查致命風險、衡量實質價值並開拓破局方案。請各位恪守角色，暢所欲言。',
  },
  {
    id: 'intro-white',
    timestamp: Date.now() - 20000,
    hat: 'white',
    speakerName: '白帽 (客觀數據顧問)',
    isUser: false,
    text: '我先列舉基準數據：全球接案群體雖龐大，但 Notion AI 與微軟 Copilot 已佔據通用入口。我們目前欠缺的關鍵事實是：目標客群真實付費意願究竟落在何種價位？手上資金能否確實支撐 12 個月無收入營運？',
  },
];

export default function App() {
  const [topic, setTopic] = useState<string>(INITIAL_TOPIC);
  const [userRole, setUserRole] = useState<UserRole>('green');
  const [sequenceMode, setSequenceMode] = useState<DiscussionSequenceMode>('natural');
  const [intensity, setIntensity] = useState<'collaborative' | 'critical'>('collaborative');

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [currentSpeaker, setCurrentSpeaker] = useState<HatType | null>('white');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFullRoundRunning, setIsFullRoundRunning] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Modals state: open aristocratic invitation card on initial load
  const [isTopicModalOpen, setIsTopicModalOpen] = useState<boolean>(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [isProvocationModalOpen, setIsProvocationModalOpen] = useState<boolean>(false);
  const [selectedHatForDetail, setSelectedHatForDetail] = useState<HatType | null>(null);
  const [selectedSpeechForModal, setSelectedSpeechForModal] = useState<ChatMessage | null>(null);

  // Executive Report state
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Reply contextual target
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);

  // Abort controller ref for manual cancel
  const abortControllerRef = useRef<AbortController | null>(null);

  // Full round automation state with turn ID to prevent duplicate executions
  const fullRoundQueueRef = useRef<HatType[]>([]);
  const isFullRoundActiveRef = useRef<boolean>(false);
  const fullRoundTurnIdRef = useRef<number>(0);

  // Extract latest message for each hat
  const latestMessageByHat: Partial<Record<HatType, ChatMessage>> = {};
  messages.forEach((msg) => {
    latestMessageByHat[msg.hat] = msg;
  });

  // Call API for Hat response with generous timeout and non-blocking voice
  const triggerHatSpeech = async (hat: HatType, customInstruction?: string) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setCurrentSpeaker(hat);

    const config = HAT_CONFIGS[hat];
    const turnId = fullRoundTurnIdRef.current;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 35000);

    try {
      const response = await fetch('/api/hats/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          topic,
          speakerHat: hat,
          history: messages,
          userRole: userRole === 'observer' ? '御前觀議者' : `${HAT_CONFIGS[userRole].name} (${userRole})`,
          customPrompt:
            customInstruction ||
            (replyTarget
              ? `請直接針對【${replyTarget.speakerName}】提出的觀點進行回應：「${replyTarget.text}」`
              : undefined),
          intensity,
        }),
      });

      clearTimeout(timeoutId);

      let newText = '';
      if (response.ok) {
        const data = await response.json();
        newText = data.text || '';
      }

      if (!newText) {
        newText = `針對「${topic}」，我們必須在具體實踐與驗證指標上進一步深究。`;
      }

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        hat,
        speakerName: `${config.name} (御前 ${config.roleTitle.split('與')[0]})`,
        isUser: false,
        text: newText,
      };

      setMessages((prev) => [...prev, newMsg]);
      setIsGenerating(false);

      // Check if full round is still active and turnId matches
      const advanceQueue = () => {
        if (
          isFullRoundActiveRef.current &&
          fullRoundTurnIdRef.current === turnId &&
          fullRoundQueueRef.current.length > 0
        ) {
          const nextInQueue = fullRoundQueueRef.current.shift()!;
          setTimeout(() => {
            if (isFullRoundActiveRef.current && fullRoundTurnIdRef.current === turnId) {
              triggerHatSpeech(nextInQueue);
            }
          }, 800);
        } else if (fullRoundQueueRef.current.length === 0) {
          // Completed round cleanly
          isFullRoundActiveRef.current = false;
          setIsFullRoundRunning(false);
        }
      };

      if (voiceEnabled) {
        speechManager.speak(newText, hat, advanceQueue);
      } else {
        setTimeout(advanceQueue, 1200);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Chat request interrupted or failed:', err?.message);
      setIsGenerating(false);
      isFullRoundActiveRef.current = false;
      setIsFullRoundRunning(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    isFullRoundActiveRef.current = false;
    setIsFullRoundRunning(false);
  };

  const handleNextSpeaker = () => {
    // If full round is running, pause it first
    handlePauseFullRound();

    const currentSeq = DISCUSSION_SEQUENCES.find((s) => s.id === sequenceMode) || DISCUSSION_SEQUENCES[0];
    const order = currentSeq.order;

    let nextHat: HatType = 'blue';
    if (!currentSpeaker) {
      nextHat = order[0];
    } else {
      const curIndex = order.indexOf(currentSpeaker);
      if (curIndex >= 0 && curIndex < order.length - 1) {
        nextHat = order[curIndex + 1];
      } else {
        const recentHats = messages.slice(-4).map((m) => m.hat);
        const candidates = order.filter(
          (h) => !recentHats.includes(h) && (userRole === 'observer' || h !== userRole)
        );
        nextHat = candidates.length > 0 ? candidates[0] : order[0];
      }
    }

    if (userRole !== 'observer' && nextHat === userRole) {
      const altCandidates = order.filter((h) => h !== userRole);
      nextHat = altCandidates[Math.floor(Math.random() * altCandidates.length)];
    }

    triggerHatSpeech(nextHat);
  };

  // Start Full Round (one pass for all 6 hats)
  const handlePlayFullRound = () => {
    if (isFullRoundRunning) return;

    fullRoundTurnIdRef.current += 1;
    // Exactly 1 pass per hat (excluding user's hat if chosen)
    const baseHats: HatType[] = ['blue', 'white', 'green', 'yellow', 'black', 'red'];
    const queue = baseHats.filter((h) => userRole === 'observer' || h !== userRole);

    if (queue.length === 0) return;

    fullRoundQueueRef.current = queue.slice(1);
    isFullRoundActiveRef.current = true;
    setIsFullRoundRunning(true);
    triggerHatSpeech(queue[0]);
  };

  // Pause Full Round
  const handlePauseFullRound = () => {
    isFullRoundActiveRef.current = false;
    fullRoundQueueRef.current = [];
    fullRoundTurnIdRef.current += 1;
    speechManager.stop();
    setIsFullRoundRunning(false);
  };

  const handleUserSendMessage = (text: string) => {
    // If full round is running, pause it
    handlePauseFullRound();

    const isObserver = userRole === 'observer';
    const hatType: HatType = isObserver ? 'blue' : userRole;
    const hatName = isObserver ? '觀議者' : HAT_CONFIGS[userRole].name;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      timestamp: Date.now(),
      hat: hatType,
      speakerName: `您 (${hatName})`,
      isUser: true,
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setCurrentSpeaker(hatType);

    setTimeout(() => {
      let responderHat: HatType = 'blue';
      if (userRole === 'green') responderHat = 'black';
      else if (userRole === 'black') responderHat = 'yellow';
      else if (userRole === 'yellow') responderHat = 'white';
      else if (userRole === 'white') responderHat = 'green';
      else if (userRole === 'red') responderHat = 'blue';
      else responderHat = 'white';

      triggerHatSpeech(
        responderHat,
        `使用者剛剛以【${hatName}】身份發言：「${text}」，請緊接著他的發言給予深層回應！`
      );
    }, 500);
  };

  const handleGenerateReport = async () => {
    setIsReportModalOpen(true);
    if (reportMarkdown && !isGeneratingReport) return;

    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/hats/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          history: messages,
        }),
      });

      const data = await res.json();
      setReportMarkdown(data.markdown || '無報告內容');
    } catch (e) {
      console.error('Failed to generate report:', e);
      setReportMarkdown('報告生成失敗，請稍後重試。');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleToggleVoice = () => {
    const nextState = speechManager.toggle();
    setVoiceEnabled(nextState);
  };

  const handlePlaySpeech = (text: string, hat: HatType) => {
    speechManager.speak(text, hat);
  };

  const handleCrossExamine = (sourceMsg: ChatMessage, targetHat: HatType) => {
    const prompt = `請針對剛才【${sourceMsg.speakerName}】提出的關鍵論點：「${sourceMsg.text.slice(0, 48)}...」，從你的頂冠視角直接進行指名交鋒或深度延伸！`;
    triggerHatSpeech(targetHat, prompt);
  };

  const handleLaunchProvocation = (poPrompt: string, targetHat: HatType) => {
    const poMessage: ChatMessage = {
      id: `po-${Date.now()}`,
      timestamp: Date.now(),
      hat: 'blue',
      speakerName: '⚜️ 狄波諾側向突圍 (PO 假說)',
      isUser: false,
      text: poPrompt,
    };
    setMessages((prev) => [...prev, poMessage]);
    triggerHatSpeech(targetHat, `有閣下向圓桌拋出了這項激進的側向詰問：「${poPrompt}」。請你立刻接招，給出跳脫常規的突破觀點！`);
  };

  return (
    <div className="h-screen max-h-screen w-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Header */}
      <header className="shrink-0 z-40 border-b border-amber-900/40 bg-stone-950/90 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border border-amber-600/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <h1 className="text-xs sm:text-sm font-serif font-bold text-amber-100 tracking-wide">
              御前思維沙龍 · 圓桌御議
            </h1>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-850 border border-amber-800/40 text-amber-200 text-xs font-serif transition-colors flex items-center gap-1 cursor-pointer"
            title="調整議題與思考序列"
          >
            <Settings className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">設定</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 text-xs font-serif font-bold shadow-md shadow-amber-900/30 transition-all flex items-center gap-1 cursor-pointer border border-amber-600/40"
          >
            <FileText className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">御前白皮書</span>
            <span className="sm:hidden">白皮書</span>
          </button>

          <button
            onClick={() => setIsTranscriptOpen(true)}
            className="p-1 sm:px-2 sm:py-1 rounded-xl bg-stone-900 hover:bg-stone-850 border border-amber-800/40 text-amber-200 text-xs font-serif transition-colors flex items-center gap-1 cursor-pointer"
            title="查看發言紀錄"
          >
            <ListFilter className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">發言紀錄</span>
            <span className="text-[10px] px-1 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/30">
              {messages.length}
            </span>
          </button>

          <button
            onClick={handleToggleVoice}
            className={`p-1 sm:p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              voiceEnabled
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
            title={voiceEnabled ? '語音朗誦開啟' : '已靜音'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* HERO BANNER: Ornate Gilded Plaque */}
      <section className="shrink-0 z-20 px-3 sm:px-6 pt-1.5 pb-1 flex flex-col items-center text-center">
        <div className="w-full max-w-4xl px-3 py-1.5 sm:py-2 rounded-2xl bg-stone-900/90 border border-amber-700/50 shadow-lg backdrop-blur-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-300 tracking-wider uppercase whitespace-nowrap">
              御前審議議案
            </span>
          </div>

          <h2
            onClick={() => setIsTopicModalOpen(true)}
            className="text-xs sm:text-sm md:text-base font-serif font-bold text-amber-100 leading-normal break-words cursor-pointer hover:text-amber-300 transition-colors select-text text-center flex-1 px-1"
            title="點擊修改討論主題"
          >
            {topic}
          </h2>

          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-750 text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors shrink-0 border border-amber-800/40 font-serif"
            title="編輯主題"
          >
            <Edit3 className="w-2.5 h-2.5 text-amber-400" />
            <span>修改</span>
          </button>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 min-h-0 relative flex flex-col justify-between overflow-hidden">
        {/* Central Visual Round Table */}
        <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
          <RoundTable
            topic={topic}
            userRole={userRole}
            currentSpeaker={currentSpeaker}
            isGenerating={isGenerating}
            isFullRoundRunning={isFullRoundRunning}
            latestMessageByHat={latestMessageByHat}
            onSeatClick={(hat) => setSelectedHatForDetail(hat)}
            onSummonSpeaker={(hat) => triggerHatSpeech(hat)}
            onSwitchUserRole={(hat) => setUserRole(hat)}
            onNextSpeaker={handleNextSpeaker}
            onPlayFullRound={handlePlayFullRound}
            onPauseFullRound={handlePauseFullRound}
            onOpenTopicModal={() => setIsTopicModalOpen(true)}
            onSelectMessageToReply={(msg) => setReplyTarget(msg)}
            onPlaySpeech={handlePlaySpeech}
            onOpenFullMessage={(msg) => setSelectedSpeechForModal(msg)}
            onCrossExamine={handleCrossExamine}
            onCancelGenerating={handleCancelGenerating}
          />
        </div>

        {/* Bottom Dock Controls */}
        <div className="shrink-0">
          <DiscussionControls
            userRole={userRole}
            currentSpeaker={currentSpeaker}
            isGenerating={isGenerating}
            isFullRoundRunning={isFullRoundRunning}
            voiceEnabled={voiceEnabled}
            onSendMessage={handleUserSendMessage}
            onNextSpeaker={handleNextSpeaker}
            onPlayFullRound={handlePlayFullRound}
            onPauseFullRound={handlePauseFullRound}
            onToggleVoice={handleToggleVoice}
            onSwitchUserRole={(hat) => setUserRole(hat)}
            onOpenProvocation={() => setIsProvocationModalOpen(true)}
            onOpenBalance={() => setIsBalanceModalOpen(true)}
            replyToSpeaker={replyTarget ? replyTarget.speakerName : null}
            onClearReply={() => setReplyTarget(null)}
          />
        </div>
      </main>

      {/* Modals & Drawers */}
      <TopicModal
        isOpen={isTopicModalOpen}
        initialTopic={topic}
        initialUserRole={userRole}
        initialSequence={sequenceMode}
        initialIntensity={intensity}
        onStart={(newTopic, newRole, newSeq, newIntensity) => {
          handlePauseFullRound();
          setTopic(newTopic);
          setUserRole(newRole);
          setSequenceMode(newSeq);
          setIntensity(newIntensity);
          setIsTopicModalOpen(false);

          const introMsg: ChatMessage = {
            id: `intro-${Date.now()}`,
            timestamp: Date.now(),
            hat: 'blue',
            speakerName: '藍帽 (御前首席主席)',
            isUser: false,
            text: `圓桌主題已更迭為：「${newTopic}」！接下來將依據【${
              DISCUSSION_SEQUENCES.find((s) => s.id === newSeq)?.name
            }】序列展開深度審議。請諸位就位。`,
          };
          setMessages([introMsg]);
          setCurrentSpeaker('blue');
        }}
        onClose={() => setIsTopicModalOpen(false)}
      />

      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        topic={topic}
        markdown={reportMarkdown}
        isLoading={isGeneratingReport}
        onRegenerate={handleGenerateReport}
        onClose={() => setIsReportModalOpen(false)}
      />

      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        messages={messages}
        onClose={() => setIsTranscriptOpen(false)}
        onPlaySpeech={handlePlaySpeech}
        onSelectReply={(msg) => {
          setReplyTarget(msg);
          setIsTranscriptOpen(false);
        }}
      />

      <HatDetailModal
        hat={selectedHatForDetail}
        userRole={userRole}
        onClose={() => setSelectedHatForDetail(null)}
        onSelectRole={(hat) => setUserRole(hat)}
        onSummonSpeaker={(hat) => triggerHatSpeech(hat)}
      />

      {/* Full Speech Detail Modal */}
      <SpeechDetailModal
        message={selectedSpeechForModal}
        onClose={() => setSelectedSpeechForModal(null)}
        onPlaySpeech={handlePlaySpeech}
        onReply={(msg) => setReplyTarget(msg)}
      />

      {/* Six Hats Cognitive Balance Radar & Salon Diagnostic */}
      <CognitiveBalanceModal
        isOpen={isBalanceModalOpen}
        topic={topic}
        messages={messages}
        onClose={() => setIsBalanceModalOpen(false)}
        onSummonHat={(hat) => triggerHatSpeech(hat)}
      />

      {/* de Bono Lateral Provocation (PO) Engine */}
      <ProvocationModal
        isOpen={isProvocationModalOpen}
        topic={topic}
        onClose={() => setIsProvocationModalOpen(false)}
        onLaunchProvocation={handleLaunchProvocation}
      />
    </div>
  );
}
