export type HatType = 'white' | 'red' | 'black' | 'yellow' | 'green' | 'blue';

export interface HatConfig {
  id: HatType;
  name: string;
  enName: string;
  roleTitle: string;
  coreQuestion: string;
  focus: string;
  colorName: string;
  bgGrad: string;
  cardBg: string;
  textColor: string;
  accentBorder: string;
  glowColor: string;
  badgeBg: string;
  hex: string;
  description: string;
  voicePitch: number;
  voiceRate: number;
}

export interface ChatMessage {
  id: string;
  timestamp: number;
  hat: HatType;
  speakerName: string;
  isUser: boolean;
  text: string;
  reactions?: {
    thumbsUp?: number;
    insightful?: number;
  };
}

export type UserRole = HatType | 'observer';

export type DiscussionSequenceMode = 'natural' | 'creative' | 'quick_eval' | 'crisis_mitigate';

export interface DiscussionSequence {
  id: DiscussionSequenceMode;
  name: string;
  description: string;
  order: HatType[];
}

export const HAT_CONFIGS: Record<HatType, HatConfig> = {
  white: {
    id: 'white',
    name: '白帽',
    enName: 'White Hat',
    roleTitle: '客觀事實與數據分析師',
    coreQuestion: '我們目前掌握哪些數據與已知事實？還缺乏什麼？',
    focus: '中立事實、數據情報、信息缺口、查證途徑',
    colorName: '冷白 / 銀灰',
    bgGrad: 'from-slate-100 to-slate-200 text-slate-800',
    cardBg: 'bg-slate-900/90 border-slate-300/40 text-slate-100',
    textColor: 'text-slate-100',
    accentBorder: 'border-slate-200',
    glowColor: 'rgba(241, 245, 249, 0.45)',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-300',
    hex: '#F1F5F9',
    description: '中立客觀，純粹聚焦於客觀資料、已知事態與待查證的數據，杜絕臆測。',
    voicePitch: 1.0,
    voiceRate: 1.05,
  },
  red: {
    id: 'red',
    name: '紅帽',
    enName: 'Red Hat',
    roleTitle: '直覺、情感與感知代表',
    coreQuestion: '我的第一直覺是什麼？這讓我感到興奮或不安嗎？',
    focus: '直覺第六感、情感反應、公眾喜好、心理預期',
    colorName: '熱烈紅',
    bgGrad: 'from-rose-500 to-red-600 text-white',
    cardBg: 'bg-rose-950/90 border-rose-500/40 text-rose-100',
    textColor: 'text-rose-400',
    accentBorder: 'border-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    badgeBg: 'bg-rose-500 text-white border-rose-400',
    hex: '#F43F5E',
    description: '坦率抒發情感、本能反應與直覺預感，無須理由與邏輯辯護。',
    voicePitch: 1.15,
    voiceRate: 1.1,
  },
  black: {
    id: 'black',
    name: '黑帽',
    enName: 'Black Hat',
    roleTitle: '批判思維與風險守門員',
    coreQuestion: '最壞的情況是什麼？有哪些潛在漏洞或法律/成本隱患？',
    focus: '批判性檢視、風險漏洞、可行性阻礙、預警防範',
    colorName: '深沉黑',
    bgGrad: 'from-neutral-800 to-black text-white',
    cardBg: 'bg-neutral-950/95 border-neutral-600 text-neutral-200',
    textColor: 'text-neutral-300',
    accentBorder: 'border-neutral-500',
    glowColor: 'rgba(163, 163, 163, 0.35)',
    badgeBg: 'bg-neutral-800 text-neutral-200 border-neutral-600',
    hex: '#525252',
    description: '嚴謹的魔鬼代言人，找出潛在陷阱與最壞情境，保護構想免於崩解。',
    voicePitch: 0.85,
    voiceRate: 0.95,
  },
  yellow: {
    id: 'yellow',
    name: '黃帽',
    enName: 'Yellow Hat',
    roleTitle: '樂觀潛力與價值探索者',
    coreQuestion: '如果成功了，最大價值在哪？有哪些不可忽視的正面回報？',
    focus: '正向效益、可行優勢、市場潛能、希望與放大價值',
    colorName: '耀眼黃',
    bgGrad: 'from-amber-400 to-yellow-500 text-slate-900',
    cardBg: 'bg-amber-950/90 border-amber-500/40 text-amber-100',
    textColor: 'text-amber-400',
    accentBorder: 'border-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    badgeBg: 'bg-amber-400 text-amber-950 border-amber-300 font-semibold',
    hex: '#FBBF24',
    description: '積極尋找價值與正向可行性，探索成功帶來的最大收益與長期希望。',
    voicePitch: 1.1,
    voiceRate: 1.05,
  },
  green: {
    id: 'green',
    name: '綠帽',
    enName: 'Green Hat',
    roleTitle: '創意突破與橫向思維者',
    coreQuestion: '如果完全打破框架呢？有什麼意想不到的替代方案？',
    focus: '天馬行空、突破性發想、顛覆假設、跨界整合',
    colorName: '生機綠',
    bgGrad: 'from-emerald-500 to-teal-600 text-white',
    cardBg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100',
    textColor: 'text-emerald-400',
    accentBorder: 'border-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-500 text-white border-emerald-400',
    hex: '#10B981',
    description: '橫向思考與點子催化劑，鼓勵瘋狂設想、轉換視角與創造嶄新可能性。',
    voicePitch: 1.2,
    voiceRate: 1.08,
  },
  blue: {
    id: 'blue',
    name: '藍帽',
    enName: 'Blue Hat',
    roleTitle: '會議主持與總結引導者',
    coreQuestion: '我們目前的討論進展到哪？下一步應聚焦什麼？共識與行動是什麼？',
    focus: '大局綜觀、流程引導、調解焦點、收斂結論與行動',
    colorName: '智慧藍',
    bgGrad: 'from-blue-600 to-indigo-700 text-white',
    cardBg: 'bg-blue-950/90 border-blue-500/40 text-blue-100',
    textColor: 'text-blue-400',
    accentBorder: 'border-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    badgeBg: 'bg-blue-600 text-white border-blue-400',
    hex: '#3B82F6',
    description: '思考過程的掌控者，指揮會議節奏，收斂各方智慧並促成具體決策。',
    voicePitch: 0.95,
    voiceRate: 1.0,
  },
};

export const DISCUSSION_SEQUENCES: DiscussionSequence[] = [
  {
    id: 'natural',
    name: '經典全面循環 (Comprehensive Cycle)',
    description: '由藍帽引言開場，白帽盤點事實，接著綠帽創意、黃帽價值、黑帽風險，最後藍帽收斂。',
    order: ['blue', 'white', 'green', 'yellow', 'black', 'red', 'blue'],
  },
  {
    id: 'creative',
    name: '創意突破序列 (Creative Breakthrough)',
    description: '先釐清客觀現實，隨後全力開拓綠帽點子與黃帽價值，最後由黑帽篩選風險。',
    order: ['blue', 'white', 'green', 'yellow', 'black', 'blue'],
  },
  {
    id: 'quick_eval',
    name: '快速直覺評估 (Rapid Assessment)',
    description: '迅速抒發第一直覺情感，比對已知事實與正反利益，適合快速決策。',
    order: ['blue', 'red', 'white', 'yellow', 'black', 'blue'],
  },
  {
    id: 'crisis_mitigate',
    name: '風險預防與排解 (Crisis & Risk Mitigation)',
    description: '黑帽重磅開火提出最嚴苛風險，隨後綠帽尋找解法、黃帽重燃信心。',
    order: ['blue', 'black', 'white', 'green', 'yellow', 'blue'],
  },
];
