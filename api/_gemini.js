const HAT_PROMPTS = {
  white: `你是愛德華·狄波諾「六頂思考帽」的【白帽（White Hat - 客觀數據與事實盤點）】。
【發言規範】：
- 語氣自然、冷靜、實事求是。嚴禁用誇張翻譯腔或感嘆詞。
- 緊扣主題，針對前一位發言者的論點，提出客觀數據、行業基準、具體市場指標或查證依據。
- 避免空洞口號，給出具體數字、比例、指標或確切的事實缺口。100~150字繁體中文。`,
  red: `你是愛德華·狄波諾「六頂思考帽」的【紅帽（Red Hat - 直覺、情感與心理溫度）】。
【發言規範】：
- 語氣坦率、真誠、貼近人性。嚴禁文藝小說腔或矯情驚呼。
- 直接表達對前一位發言內容或方案的直覺感受（例如安心、焦慮、困惑、排斥或吸引）。
- 從目標用戶的第一眼心理體驗切入，描述具體感受。100~150字繁體中文。`,
  black: `你是愛德華·狄波諾「六頂思考帽」的【黑帽（Black Hat - 批判思維與風險防範）】。
【發言規範】：
- 語氣嚴謹、客觀、一針見血。嚴禁戲劇化唱衰或誇張修飾。
- 直接針對前一位發言者的漏洞提出務實質疑，指出潛在成本、競品威脅、法律政策阻礙或失敗案例。
- 不講抽象風險，點出具體的實施死穴與隱性代價。100~150字繁體中文。`,
  yellow: `你是愛德華·狄波諾「六頂思考帽」的【黃帽（Yellow Hat - 樂觀價值、回報與可行潛力）】。
【發言規範】：
- 語氣自信、建設性、平實有力。嚴禁廉價的心靈雞湯或誇飾感嘆。
- 基於現實商業邏輯，指出方案中的最大利益點、溢價機會或可行優勢，回應黑帽的疑慮。
- 提出具體的正向槓桿或借鏡做法。100~150字繁體中文。`,
  green: `你是愛德華·狄波諾「六頂思考帽」的【綠帽（Green Hat - 橫向思維、突破點子與替代方案）】。
【發言規範】：
- 語氣清晰、富啟發感、直奔主題。嚴禁無意義的驚嘆句。
- 提出 1~2 個跳脫常規的替代方案或跨界解法，打破既定思維框架。
- 給出具體可行的創意做法，而不是抽象的「我們可以多嘗試」。100~150字繁體中文。`,
  blue: `你是愛德華·狄波諾「六頂思考帽」的【藍帽（Blue Hat - 主席收斂、爭端調解與下一步決策）】。
【發言規範】：
- 語氣沉穩、大局觀、條理清晰。嚴禁客套廢話。
- 梳理目前討論的分歧與共識，明確點出下一步需要執行的 1~2 個具體驗證步驟。
- 推動會議得出結論。100~150字繁體中文。`,
};

async function generateWithModelFallback(prompt, maxTokens) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error('NO_AI_INSTANCE');
    throw error;
  }

  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: maxTokens, temperature: 0.65 },
            }),
          },
        );
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error?.message || `${response.status} ${response.statusText}`);
        }
        const text = (data?.candidates?.[0]?.content?.parts || [])
          .map((part) => part.text || '')
          .join('')
          .trim();
        if (text) return text;
        throw new Error('EMPTY_MODEL_RESPONSE');
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Model ${model} attempt ${attempt + 1} failed:`, message);
        if (message.includes('429') || message.includes('404') || message.includes('not found')) break;
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }

  throw lastError || new Error('ALL_MODELS_FAILED');
}

async function replyAsHat(body) {
  const topic = body.topic;
  const speakerHat = body.speakerHat;
  const history = body.history;
  const userRole = body.userRole;
  const customPrompt = body.customPrompt;
  const intensity = body.intensity;

  if (!speakerHat || !HAT_PROMPTS[speakerHat]) {
    return { status: 400, payload: { error: '無效的思考帽角色' } };
  }

  const historyList = (history || []).slice(-8);
  const conversationContext = historyList
    .map((item) => `【${item.speakerName || item.hat}】：${item.text}`)
    .join('\n\n');
  const lastSpeakerItem = historyList.length > 0 ? historyList[historyList.length - 1] : null;
  const lastSpeakerNote = lastSpeakerItem
    ? `【上一位發言者是】：${lastSpeakerItem.speakerName}，其內容為：「${lastSpeakerItem.text}」。你第一句請直接指名回應他的論點。`
    : '你是會議第一位引言者，請直接切入主題核心。';
  const intensityNote = intensity === 'critical'
    ? '【會議氛圍】：直接犀利，重點放在具體盲點的推敲。'
    : '【會議氛圍】：務實共創，互相承接觀點並深入探討。';
  const userRoleNote = userRole
    ? `同桌的人類夥伴扮演：【${userRole}】。`
    : '人類夥伴正在圓桌席位上共同參與。';

  const promptText = `
${HAT_PROMPTS[speakerHat]}

【當前唯一的討論主題】：
${topic || '未設定具體主題'}

${userRoleNote}
${intensityNote}
${lastSpeakerNote}

【近期的完整發言脈絡】：
${conversationContext || '（討論剛開始）'}

${customPrompt ? `【特殊指示】：${customPrompt}` : ''}

【語氣與語言嚴格禁令】：
1. 嚴禁任何翻譯小說腔、英翻中感嘆句（如「歐，XX...」、「天哪」、「你這樣做真是太驚人了」等誇張用詞，完全不需要出現）！
2. 請使用自然、平實、道地的現代繁體中文工作討論風格，就像專業顧問或高階團隊在會議桌上討論一樣，語氣精練，注重邏輯與事實。
3. 發言緊扣【${topic}】，自然稱呼對方即可（如「我同意白帽說的...」、「黑帽提到的風險確實存在，不過...」）。
4. 字數約 100~160 字，不需要冗長修飾。
`;

  try {
    const text = await generateWithModelFallback(promptText, 300);
    return { status: 200, payload: { text } };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'NO_AI_INSTANCE') {
      return {
        status: 500,
        payload: { error: '伺服器沒有讀到 GEMINI_API_KEY。請確認 Vercel 的 Production 環境變數已設定，並重新部署。' },
      };
    }
    return { status: 502, payload: { error: `Gemini 呼叫失敗：${message}` } };
  }
}

async function synthesizeReport(body) {
  const topic = body.topic;
  const transcript = (body.history || [])
    .map((item) => `【${item.speakerName || item.hat}】：${item.text}`)
    .join('\n\n');
  const synthesisPrompt = `
你是愛德華·狄波諾「六頂思考帽」的資深顧問兼藍帽主席。
請針對以下圓桌會議討論內容，產出一份極具決策價值的「六頂思考帽決策綜合白皮書（繁體中文 Markdown 格式）」。
要求語言自然專業、客觀平實，明確指出爭端共識與落地清單。

【討論主題】：
${topic}

【完整圓桌發言記錄】：
${transcript}

請依據下列架構輸出清晰易讀的 Markdown：
# 👑 六頂思考帽御前決策簡報：${topic}

## 1. ⚪ 白帽事實與情報盤點 (Facts & Information)
- 已知核心事實與市場數據
- 關鍵資訊缺口與待查證事項

## 2. 🔴 紅帽直覺與情感溫度 (Emotions & Instincts)
- 團隊與使用者的直觀心理感受
- 容易產生抗拒或共鳴的觸發點

## 3. ⚫ 黑帽風險與漏洞警示 (Risks & Caution)
- 最嚴峻的潛在挑戰與競品威脅
- 必須預先防範的死穴

## 4. 🟡 黃帽效益與價值亮點 (Benefits & Value)
- 最核心的商業溢價與現金流潛能
- 最佳情境下的回報預期

## 5. 🟢 綠帽創新突破方案 (Creative Alternatives)
- 顛覆性商業模式或跳脫常規的新打法
- 替代途徑與跨界解法

## 6. 🔵 藍帽最終決策與行動清單 (Synthesis & Action Plan)
- 圓桌共識總結
- 接下來的 3 個具體落地步驟 (Action Items)
`;

  try {
    const markdown = await generateWithModelFallback(synthesisPrompt, 1200);
    return { status: 200, payload: { markdown } };
  } catch (error) {
    console.error('Error generating synthesis:', error instanceof Error ? error.message : error);
    return {
      status: 200,
      payload: {
        markdown: `# 👑 六頂思考帽御前決策簡報：${topic}\n\n## 🔵 藍帽初步總結\n本輪討論已涵蓋各頂思考帽面向。建議持續聚焦於核心價值與風險防範措施。`,
      },
    };
  }
}

function readBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (req.body && typeof req.body === 'object') return req.body;
  return {};
}

export { replyAsHat, synthesizeReport, readBody };
