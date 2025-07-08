import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app_settings';
const USAGE_STATS_KEY = 'usage_statistics';

// الإعدادات الافتراضية
const DEFAULT_SETTINGS = {
  // إعدادات Gemini AI
  ai: {
    model: 'gemini-1.5-flash', // أو gemini-1.5-pro
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.8,
    topK: 40,
    safetySettings: 'balanced', // strict, balanced, permissive
  },
  
  // إعدادات الواجهة
  ui: {
    theme: 'dark', // dark, light, auto
    fontSize: 'medium', // small, medium, large
    language: 'ar', // ar, en
    animations: true,
    hapticFeedback: true,
    showPreview: true,
  },
  
  // إعدادات الإشعارات
  notifications: {
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    conversationReminders: true,
    responseComplete: true,
    dailyTips: true,
    errorAlerts: true,
    reminderInterval: 30, // minutes
  },
  
  // إعدادات الأمان والخصوصية
  privacy: {
    saveConversations: true,
    encryptData: true,
    autoDeleteOldChats: false,
    autoDeleteDays: 30,
    shareUsageStats: false,
    biometricAuth: false,
  },
  
  // إعدادات الوسائط
  media: {
    imageQuality: 'high', // low, medium, high
    audioQuality: 'medium', // low, medium, high
    maxImageSize: 5, // MB
    maxAudioDuration: 60, // seconds
    autoDownloadImages: true,
    compressImages: true,
  },
  
  // إعدادات التصدير والاستيراد
  export: {
    includeImages: true,
    includeAudio: false,
    format: 'json', // json, txt, pdf
    dateRange: 'all', // all, last_week, last_month
  },
  
  // إعدادات التطوير (للمطورين)
  developer: {
    debugMode: false,
    showAPIRequests: false,
    enableLogging: false,
    mockResponses: false,
  }
};

class SettingsManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.usageStats = {
      messagesCount: 0,
      imagesUploaded: 0,
      audioRecorded: 0,
      codeGenerated: 0,
      searchesPerformed: 0,
      conversationsCreated: 0,
      totalAppUsage: 0, // minutes
      lastUsed: null,
      installDate: new Date().toISOString(),
    };
  }

  // تحميل الإعدادات
  async loadSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
      return this.settings;
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
      return DEFAULT_SETTINGS;
    }
  }

  // حفظ الإعدادات
  async saveSettings(newSettings = null) {
    try {
      const settingsToSave = newSettings || this.settings;
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));
      if (newSettings) {
        this.settings = { ...this.settings, ...newSettings };
      }
      return true;
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      return false;
    }
  }

  // تحديث إعداد محدد
  async updateSetting(category, key, value) {
    try {
      if (!this.settings[category]) {
        this.settings[category] = {};
      }
      this.settings[category][key] = value;
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('خطأ في تحديث الإعداد:', error);
      return false;
    }
  }

  // الحصول على إعداد محدد
  getSetting(category, key, defaultValue = null) {
    try {
      return this.settings[category]?.[key] ?? defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  // إعادة تعيين الإعدادات للافتراضية
  async resetSettings() {
    try {
      this.settings = { ...DEFAULT_SETTINGS };
      await this.saveSettings();
      return true;
    } catch (error) {
      console.error('خطأ في إعادة تعيين الإعدادات:', error);
      return false;
    }
  }

  // تحميل إحصائيات الاستخدام
  async loadUsageStats() {
    try {
      const savedStats = await AsyncStorage.getItem(USAGE_STATS_KEY);
      if (savedStats) {
        this.usageStats = { ...this.usageStats, ...JSON.parse(savedStats) };
      }
      return this.usageStats;
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
      return this.usageStats;
    }
  }

  // حفظ إحصائيات الاستخدام
  async saveUsageStats() {
    try {
      await AsyncStorage.setItem(USAGE_STATS_KEY, JSON.stringify(this.usageStats));
      return true;
    } catch (error) {
      console.error('خطأ في حفظ الإحصائيات:', error);
      return false;
    }
  }

  // تحديث إحصائية محددة
  async updateUsageStat(statKey, increment = 1) {
    try {
      if (typeof this.usageStats[statKey] === 'number') {
        this.usageStats[statKey] += increment;
      } else {
        this.usageStats[statKey] = increment;
      }
      this.usageStats.lastUsed = new Date().toISOString();
      await this.saveUsageStats();
      return true;
    } catch (error) {
      console.error('خطأ في تحديث الإحصائية:', error);
      return false;
    }
  }

  // إعادة تعيين الإحصائيات
  async resetUsageStats() {
    try {
      this.usageStats = {
        messagesCount: 0,
        imagesUploaded: 0,
        audioRecorded: 0,
        codeGenerated: 0,
        searchesPerformed: 0,
        conversationsCreated: 0,
        totalAppUsage: 0,
        lastUsed: null,
        installDate: new Date().toISOString(),
      };
      await this.saveUsageStats();
      return true;
    } catch (error) {
      console.error('خطأ في إعادة تعيين الإحصائيات:', error);
      return false;
    }
  }

  // تصدير الإعدادات
  async exportSettings() {
    try {
      const dataToExport = {
        settings: this.settings,
        usageStats: this.usageStats,
        exportDate: new Date().toISOString(),
        version: '2.0.0',
      };
      return JSON.stringify(dataToExport, null, 2);
    } catch (error) {
      console.error('خطأ في تصدير الإعدادات:', error);
      return null;
    }
  }

  // استيراد الإعدادات
  async importSettings(importData) {
    try {
      const data = JSON.parse(importData);
      if (data.settings) {
        this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        await this.saveSettings();
      }
      if (data.usageStats) {
        this.usageStats = { ...this.usageStats, ...data.usageStats };
        await this.saveUsageStats();
      }
      return true;
    } catch (error) {
      console.error('خطأ في استيراد الإعدادات:', error);
      return false;
    }
  }

  // التحقق من صحة الإعدادات
  validateSettings(settings) {
    try {
      // التحقق من إعدادات AI
      if (settings.ai) {
        if (settings.ai.temperature < 0 || settings.ai.temperature > 2) {
          settings.ai.temperature = 0.7;
        }
        if (settings.ai.maxTokens < 1 || settings.ai.maxTokens > 8192) {
          settings.ai.maxTokens = 2048;
        }
      }

      // التحقق من إعدادات الوسائط
      if (settings.media) {
        if (settings.media.maxImageSize < 1 || settings.media.maxImageSize > 50) {
          settings.media.maxImageSize = 5;
        }
        if (settings.media.maxAudioDuration < 10 || settings.media.maxAudioDuration > 300) {
          settings.media.maxAudioDuration = 60;
        }
      }

      return true;
    } catch (error) {
      console.error('خطأ في التحقق من الإعدادات:', error);
      return false;
    }
  }

  // الحصول على معلومات التطبيق
  getAppInfo() {
    return {
      version: '2.0.0',
      buildNumber: 3,
      lastUpdate: new Date().toISOString(),
      totalUsers: this.usageStats.messagesCount > 0 ? 1 : 0,
      features: [
        'AI Chat',
        'Image Analysis',
        'Voice Messages',
        'Code Editor',
        'Web Search',
        'Project Builder',
        'Notifications',
        'Advanced Settings',
      ],
    };
  }
}

export default new SettingsManager();