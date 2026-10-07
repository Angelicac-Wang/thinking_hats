import { HatType, HAT_CONFIGS } from '../types/hats';

class SpeechManager {
  private enabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private timer: any = null;

  constructor() {
    this.enabled = typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!this.enabled) {
      this.stop();
    }
  }

  public speak(text: string, hat: HatType, onEnd?: () => void) {
    // If not supported or muted, invoke onEnd right away
    if (!this.isSupported() || !this.enabled) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stop();

      const config = HAT_CONFIGS[hat];
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const zhVoices = voices.filter(
        (v) => v.lang.startsWith('zh') || v.lang.includes('TW') || v.lang.includes('HK') || v.lang.includes('CN')
      );
      
      if (zhVoices.length > 0) {
        const hatIndex = ['white', 'red', 'black', 'yellow', 'green', 'blue'].indexOf(hat);
        utterance.voice = zhVoices[hatIndex % zhVoices.length];
      }

      utterance.pitch = config.voicePitch;
      utterance.rate = config.voiceRate;
      utterance.lang = 'zh-TW';

      let ended = false;
      const finish = () => {
        if (!ended) {
          ended = true;
          if (this.timer) clearTimeout(this.timer);
          this.currentUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('TTS playback ended/warn:', e);
        finish();
      };

      // Watchdog timer: ensure onEnd is ALWAYS invoked within max 8 seconds so automation never hangs
      this.timer = setTimeout(() => {
        finish();
      }, Math.min(8000, Math.max(3000, text.length * 100)));

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        // ignore
      }
    }
    this.currentUtterance = null;
  }
}

export const speechManager = new SpeechManager();
