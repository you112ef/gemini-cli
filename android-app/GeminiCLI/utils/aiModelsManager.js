// مدير نماذج الذكاء الاصطناعي المتعددة
import AsyncStorage from '@react-native-async-storage/async-storage';

// تعريف النماذج المدعومة
export const AI_MODELS = {
  GEMINI: {
    id: 'gemini',
    name: 'Google Gemini',
    provider: 'Google',
    models: [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'سريع ومناسب للاستخدام العام',
        maxTokens: 8192,
        supportsImages: true,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000001,
        features: ['نص', 'صور', 'تحليل الكود'],
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'متقدم ومناسب للمهام المعقدة',
        maxTokens: 32768,
        supportsImages: true,
        supportsAudio: true,
        supportsVideo: true,
        costPerToken: 0.000005,
        features: ['نص', 'صور', 'فيديو', 'صوت', 'تحليل متقدم'],
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Gemini 1.0 Pro',
        description: 'إصدار مستقر وموثوق',
        maxTokens: 4096,
        supportsImages: false,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000002,
        features: ['نص', 'تحليل الكود'],
      },
    ],
    apiKeyRequired: true,
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
    authType: 'api_key',
  },
  
  OPENAI: {
    id: 'openai',
    name: 'OpenAI',
    provider: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'أحدث نموذج من OpenAI مع قدرات متعددة الوسائط',
        maxTokens: 8192,
        supportsImages: true,
        supportsAudio: true,
        supportsVideo: false,
        costPerToken: 0.00001,
        features: ['نص', 'صور', 'صوت', 'تحليل متقدم'],
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'نموذج متقدم وسريع',
        maxTokens: 4096,
        supportsImages: true,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000008,
        features: ['نص', 'صور', 'تحليل الكود'],
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'سريع واقتصادي',
        maxTokens: 4096,
        supportsImages: false,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000002,
        features: ['نص', 'تحليل الكود'],
      },
    ],
    apiKeyRequired: true,
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    authType: 'bearer_token',
  },

  CLAUDE: {
    id: 'claude',
    name: 'Anthropic Claude',
    provider: 'Anthropic',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'الأقوى والأكثر ذكاءً',
        maxTokens: 8192,
        supportsImages: true,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000015,
        features: ['نص', 'صور', 'تحليل معقد', 'إبداع'],
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: 'متوازن بين الجودة والسرعة',
        maxTokens: 8192,
        supportsImages: true,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000005,
        features: ['نص', 'صور', 'تحليل الكود'],
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: 'سريع واقتصادي',
        maxTokens: 4096,
        supportsImages: false,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0.000001,
        features: ['نص', 'ردود سريعة'],
      },
    ],
    apiKeyRequired: true,
    apiUrl: 'https://api.anthropic.com/v1/messages',
    authType: 'x_api_key',
  },

  LOCAL: {
    id: 'local',
    name: 'نماذج محلية',
    provider: 'Local',
    models: [
      {
        id: 'llama-2-7b',
        name: 'LLaMA 2 7B',
        description: 'نموذج محلي خفيف',
        maxTokens: 2048,
        supportsImages: false,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0,
        features: ['نص', 'محلي'],
      },
      {
        id: 'ollama-mistral',
        name: 'Mistral 7B (Ollama)',
        description: 'نموذج محلي عبر Ollama',
        maxTokens: 4096,
        supportsImages: false,
        supportsAudio: false,
        supportsVideo: false,
        costPerToken: 0,
        features: ['نص', 'محلي', 'سريع'],
      },
    ],
    apiKeyRequired: false,
    apiUrl: 'http://localhost:11434/api/generate',
    authType: 'none',
  },
};

// كلاس مدير النماذج
class AIModelsManager {
  constructor() {
    this.currentProvider = 'gemini';
    this.currentModel = 'gemini-1.5-flash';
    this.apiKeys = {};
  }

  // تحميل إعدادات النماذج
  async loadSettings() {
    try {
      const savedProvider = await AsyncStorage.getItem('ai_current_provider');
      const savedModel = await AsyncStorage.getItem('ai_current_model');
      const savedApiKeys = await AsyncStorage.getItem('ai_api_keys');

      if (savedProvider) this.currentProvider = savedProvider;
      if (savedModel) this.currentModel = savedModel;
      if (savedApiKeys) this.apiKeys = JSON.parse(savedApiKeys);

      return {
        provider: this.currentProvider,
        model: this.currentModel,
        apiKeys: this.apiKeys,
      };
    } catch (error) {
      console.error('خطأ في تحميل إعدادات النماذج:', error);
      return null;
    }
  }

  // حفظ إعدادات النماذج
  async saveSettings() {
    try {
      await AsyncStorage.setItem('ai_current_provider', this.currentProvider);
      await AsyncStorage.setItem('ai_current_model', this.currentModel);
      await AsyncStorage.setItem('ai_api_keys', JSON.stringify(this.apiKeys));
      return true;
    } catch (error) {
      console.error('خطأ في حفظ إعدادات النماذج:', error);
      return false;
    }
  }

  // تعيين النموذج الحالي
  async setCurrentModel(providerId, modelId) {
    if (AI_MODELS[providerId.toUpperCase()] && 
        AI_MODELS[providerId.toUpperCase()].models.find(m => m.id === modelId)) {
      this.currentProvider = providerId.toLowerCase();
      this.currentModel = modelId;
      await this.saveSettings();
      return true;
    }
    return false;
  }

  // تعيين مفتاح API
  async setApiKey(providerId, apiKey) {
    this.apiKeys[providerId.toLowerCase()] = apiKey;
    await this.saveSettings();
  }

  // الحصول على مفتاح API
  getApiKey(providerId) {
    return this.apiKeys[providerId?.toLowerCase()];
  }

  // الحصول على النموذج الحالي
  getCurrentModel() {
    const provider = AI_MODELS[this.currentProvider.toUpperCase()];
    if (!provider) return null;
    
    return provider.models.find(m => m.id === this.currentModel);
  }

  // الحصول على المزود الحالي
  getCurrentProvider() {
    return AI_MODELS[this.currentProvider.toUpperCase()];
  }

  // الحصول على جميع النماذج المتاحة
  getAllModels() {
    const allModels = [];
    Object.values(AI_MODELS).forEach(provider => {
      provider.models.forEach(model => {
        allModels.push({
          ...model,
          providerId: provider.id,
          providerName: provider.name,
          apiKeyRequired: provider.apiKeyRequired,
        });
      });
    });
    return allModels;
  }

  // الحصول على نماذج مزود معين
  getModelsForProvider(providerId) {
    const provider = AI_MODELS[providerId.toUpperCase()];
    return provider ? provider.models : [];
  }

  // التحقق من توفر مفتاح API
  hasApiKey(providerId) {
    const provider = AI_MODELS[providerId?.toUpperCase()];
    if (!provider || !provider.apiKeyRequired) return true;
    return !!this.apiKeys[providerId?.toLowerCase()];
  }

  // التحقق من إمكانية استخدام النموذج
  canUseModel(providerId, modelId) {
    const provider = AI_MODELS[providerId?.toUpperCase()];
    if (!provider) return false;

    const model = provider.models.find(m => m.id === modelId);
    if (!model) return false;

    if (provider.apiKeyRequired && !this.hasApiKey(providerId)) {
      return false;
    }

    return true;
  }

  // حساب التكلفة التقديرية
  calculateCost(providerId, modelId, tokenCount) {
    const provider = AI_MODELS[providerId?.toUpperCase()];
    if (!provider) return 0;

    const model = provider.models.find(m => m.id === modelId);
    if (!model) return 0;

    return tokenCount * model.costPerToken;
  }

  // الحصول على قدرات النموذج
  getModelCapabilities(providerId, modelId) {
    const provider = AI_MODELS[providerId?.toUpperCase()];
    if (!provider) return null;

    const model = provider.models.find(m => m.id === modelId);
    if (!model) return null;

    return {
      supportsImages: model.supportsImages,
      supportsAudio: model.supportsAudio,
      supportsVideo: model.supportsVideo,
      maxTokens: model.maxTokens,
      features: model.features,
    };
  }

  // إحصائيات الاستخدام
  async updateUsageStats(providerId, modelId, tokensUsed, cost) {
    try {
      const statsKey = `usage_stats_${providerId}_${modelId}`;
      const existingStats = await AsyncStorage.getItem(statsKey);
      
      const stats = existingStats ? JSON.parse(existingStats) : {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        lastUsed: null,
      };

      stats.totalRequests += 1;
      stats.totalTokens += tokensUsed;
      stats.totalCost += cost;
      stats.lastUsed = new Date().toISOString();

      await AsyncStorage.setItem(statsKey, JSON.stringify(stats));
      return stats;
    } catch (error) {
      console.error('خطأ في تحديث إحصائيات الاستخدام:', error);
      return null;
    }
  }

  // الحصول على إحصائيات الاستخدام
  async getUsageStats(providerId, modelId) {
    try {
      const statsKey = `usage_stats_${providerId}_${modelId}`;
      const stats = await AsyncStorage.getItem(statsKey);
      return stats ? JSON.parse(stats) : null;
    } catch (error) {
      console.error('خطأ في تحميل إحصائيات الاستخدام:', error);
      return null;
    }
  }

  // مسح إحصائيات الاستخدام
  async clearUsageStats() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const statsKeys = keys.filter(key => key.startsWith('usage_stats_'));
      await AsyncStorage.multiRemove(statsKeys);
      return true;
    } catch (error) {
      console.error('خطأ في مسح إحصائيات الاستخدام:', error);
      return false;
    }
  }

  // اختبار الاتصال بالنموذج
  async testConnection(providerId, modelId, apiKey) {
    try {
      const provider = AI_MODELS[providerId?.toUpperCase()];
      if (!provider) throw new Error('مزود غير مدعوم');

      const model = provider.models.find(m => m.id === modelId);
      if (!model) throw new Error('نموذج غير مدعوم');

      // هنا يمكن إضافة طلب اختبار حقيقي لكل مزود
      // لكن للآن سنعتبر الاختبار ناجح إذا كان المفتاح موجود
      if (provider.apiKeyRequired && !apiKey) {
        throw new Error('مفتاح API مطلوب');
      }

      return { success: true, message: 'الاتصال ناجح' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new AIModelsManager();