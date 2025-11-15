interface TTSSettings {
  enabled: boolean;
  rate: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  voice: string | null;
}

class TTSService {
  private settings: TTSSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.settings = this.loadSettings();
    
    // Stop speech when page unloads
    window.addEventListener('beforeunload', () => {
      this.stop();
    });

    // Stop speech on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.stop();
      }
    });
  }

  private loadSettings(): TTSSettings {
    try {
      const saved = localStorage.getItem('tts-settings');
      if (saved) {
        return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load TTS settings:', error);
    }
    return this.getDefaultSettings();
  }

  private getDefaultSettings(): TTSSettings {
    return {
      enabled: true,
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8,
      voice: null
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('tts-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save TTS settings:', error);
    }
  }

  speak(text: string): void {
    if (!this.isSupported || !this.settings.enabled || !text.trim()) {
      return;
    }

    // Stop any current speech
    this.stop();

    // Clean and prepare text
    const cleanText = this.cleanText(text);
    if (!cleanText) return;

    try {
      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      
      // Apply settings
      this.currentUtterance.rate = this.settings.rate;
      this.currentUtterance.pitch = this.settings.pitch;
      this.currentUtterance.volume = this.settings.volume;

      // Set voice if specified
      if (this.settings.voice) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === this.settings.voice);
        if (selectedVoice) {
          this.currentUtterance.voice = selectedVoice;
        }
      }

      // Error handling
      this.currentUtterance.onerror = (event) => {
        console.warn('TTS Error:', event.error);
        this.currentUtterance = null;
      };

      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
      };

      // Speak the text
      speechSynthesis.speak(this.currentUtterance);
    } catch (error) {
      console.warn('TTS failed:', error);
    }
  }

  stop(): void {
    if (this.isSupported) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  private cleanText(text: string): string {
    return text
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common UI text that shouldn't be spoken
      .replace(/^(click|tap|press|select)\s+/i, '')
      // Handle abbreviations
      .replace(/\bAPI\b/g, 'A P I')
      .replace(/\bUI\b/g, 'U I')
      .replace(/\bURL\b/g, 'U R L')
      // Handle common symbols
      .replace(/&/g, 'and')
      .replace(/@/g, 'at')
      .replace(/#/g, 'hashtag ')
      .trim();
  }

  // Settings management
  getSettings(): TTSSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<TTSSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  toggle(): boolean {
    this.settings.enabled = !this.settings.enabled;
    this.saveSettings();
    if (!this.settings.enabled) {
      this.stop();
    }
    return this.settings.enabled;
  }

  isEnabled(): boolean {
    return this.settings.enabled && this.isSupported;
  }

  isSpeaking(): boolean {
    return this.isSupported && speechSynthesis.speaking;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    return speechSynthesis.getVoices();
  }

  // Check if browser supports TTS
  isSupported(): boolean {
    return this.isSupported;
  }
}

export const ttsService = new TTSService();

// Load voices when they become available
if ('speechSynthesis' in window) {
  speechSynthesis.addEventListener('voiceschanged', () => {
    // Voices are now available
  });
}