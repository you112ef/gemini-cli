import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import settingsManager from '../utils/settingsManager';
import notificationManager from '../utils/notificationManager';

const { width, height } = Dimensions.get('window');

const AdvancedSettings = ({ visible, onClose }) => {
  const [settings, setSettings] = useState({});
  const [usageStats, setUsageStats] = useState({});
  const [activeTab, setActiveTab] = useState('ai');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const loadedSettings = await settingsManager.loadSettings();
      const loadedStats = await settingsManager.loadUsageStats();
      setSettings(loadedSettings);
      setUsageStats(loadedStats);
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (category, key, value) => {
    try {
      await settingsManager.updateSetting(category, key, value);
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value,
        },
      }));
    } catch (error) {
      console.error('خطأ في تحديث الإعداد:', error);
      Alert.alert('خطأ', 'فشل في حفظ الإعداد');
    }
  };

  const resetSettings = () => {
    Alert.alert(
      'إعادة تعيين الإعدادات',
      'هل تريد إعادة تعيين جميع الإعدادات للقيم الافتراضية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: async () => {
            await settingsManager.resetSettings();
            await loadSettings();
            Alert.alert('تم', 'تم إعادة تعيين الإعدادات بنجاح');
          },
        },
      ]
    );
  };

  const exportSettings = async () => {
    try {
      const exportData = await settingsManager.exportSettings();
      Alert.alert(
        'تصدير الإعدادات',
        'تم إنشاء نسخة احتياطية من الإعدادات بنجاح.\n\nيمكنك نسخ البيانات من وحدة التحكم.',
        [{ text: 'موافق' }]
      );
      console.log('بيانات الإعدادات المُصدرة:\n', exportData);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تصدير الإعدادات');
    }
  };

  const clearUsageStats = () => {
    Alert.alert(
      'مسح الإحصائيات',
      'هل تريد مسح جميع إحصائيات الاستخدام؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            await settingsManager.resetUsageStats();
            await loadSettings();
            Alert.alert('تم', 'تم مسح الإحصائيات بنجاح');
          },
        },
      ]
    );
  };

  const renderTabButton = (tabKey, title, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabKey && styles.activeTabButton]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabText, activeTab === tabKey && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderSwitchSetting = (category, key, title, description) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[category]?.[key] || false}
        onValueChange={(value) => updateSetting(category, key, value)}
        trackColor={{ false: '#3e3e3e', true: '#007AFF' }}
        thumbColor="#ffffff"
      />
    </View>
  );

  const renderPickerSetting = (category, key, title, options, optionLabels) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={settings[category]?.[key]}
          onValueChange={(value) => updateSetting(category, key, value)}
          style={styles.picker}
          dropdownIconColor="#ffffff"
        >
          {options.map((option, index) => (
            <Picker.Item
              key={option}
              label={optionLabels[index]}
              value={option}
              color="#ffffff"
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  const renderSliderSetting = (category, key, title, min, max, step = 0.1) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingValue}>
          {(settings[category]?.[key] || 0).toFixed(1)}
        </Text>
      </View>
      <View style={styles.sliderContainer}>
        <TextInput
          style={styles.sliderInput}
          value={String(settings[category]?.[key] || 0)}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if (value >= min && value <= max) {
              updateSetting(category, key, value);
            }
          }}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );

  const renderUsageStat = (title, value, unit = '') => (
    <View style={styles.statItem}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}{unit}</Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الإعدادات المتقدمة</Text>
          <TouchableOpacity onPress={resetSettings} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>↺</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {renderTabButton('ai', 'الذكاء الاصطناعي', '🤖')}
          {renderTabButton('ui', 'الواجهة', '🎨')}
          {renderTabButton('notifications', 'الإشعارات', '🔔')}
          {renderTabButton('privacy', 'الخصوصية', '🔒')}
          {renderTabButton('media', 'الوسائط', '📷')}
          {renderTabButton('stats', 'الإحصائيات', '📊')}
        </ScrollView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
          ) : (
            <>
              {activeTab === 'ai' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>إعدادات Gemini AI</Text>
                  
                  {renderPickerSetting(
                    'ai', 'model', 'النموذج',
                    ['gemini-1.5-flash', 'gemini-1.5-pro'],
                    ['Gemini 1.5 Flash (سريع)', 'Gemini 1.5 Pro (متقدم)']
                  )}
                  
                  {renderSliderSetting('ai', 'temperature', 'الإبداعية (Temperature)', 0, 2)}
                  {renderSliderSetting('ai', 'topP', 'التنوع (Top P)', 0, 1)}
                  
                  <View style={styles.settingItem}>
                    <Text style={styles.settingTitle}>الحد الأقصى للرموز</Text>
                    <TextInput
                      style={styles.tokenInput}
                      value={String(settings.ai?.maxTokens || 2048)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 2048;
                        if (value >= 1 && value <= 8192) {
                          updateSetting('ai', 'maxTokens', value);
                        }
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#888"
                    />
                  </View>

                  {renderPickerSetting(
                    'ai', 'safetySettings', 'إعدادات الأمان',
                    ['strict', 'balanced', 'permissive'],
                    ['صارم', 'متوازن', 'مرن']
                  )}
                </View>
              )}

              {activeTab === 'ui' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>إعدادات الواجهة</Text>
                  
                  {renderPickerSetting(
                    'ui', 'theme', 'المظهر',
                    ['dark', 'light', 'auto'],
                    ['مظلم', 'فاتح', 'تلقائي']
                  )}
                  
                  {renderPickerSetting(
                    'ui', 'fontSize', 'حجم الخط',
                    ['small', 'medium', 'large'],
                    ['صغير', 'متوسط', 'كبير']
                  )}
                  
                  {renderPickerSetting(
                    'ui', 'language', 'اللغة',
                    ['ar', 'en'],
                    ['العربية', 'English']
                  )}
                  
                  {renderSwitchSetting('ui', 'animations', 'الحركات المتحركة', 'تفعيل الانتقالات السلسة')}
                  {renderSwitchSetting('ui', 'hapticFeedback', 'الاهتزاز التفاعلي', 'اهتزاز خفيف عند اللمس')}
                  {renderSwitchSetting('ui', 'showPreview', 'معاينة الرسائل', 'عرض معاينة قبل الإرسال')}
                </View>
              )}

              {activeTab === 'notifications' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>إعدادات الإشعارات</Text>
                  
                  {renderSwitchSetting('notifications', 'enabled', 'تفعيل الإشعارات', 'تلقي إشعارات التطبيق')}
                  {renderSwitchSetting('notifications', 'soundEnabled', 'الصوت', 'تشغيل صوت الإشعارات')}
                  {renderSwitchSetting('notifications', 'vibrationEnabled', 'الاهتزاز', 'اهتزاز عند الإشعارات')}
                  {renderSwitchSetting('notifications', 'conversationReminders', 'تذكير المحادثات', 'تذكير بالمحادثات غير المكتملة')}
                  {renderSwitchSetting('notifications', 'responseComplete', 'إشعار انتهاء الرد', 'إشعار عند انتهاء Gemini من الرد')}
                  {renderSwitchSetting('notifications', 'dailyTips', 'نصائح يومية', 'نصائح يومية لاستخدام التطبيق')}
                  {renderSwitchSetting('notifications', 'errorAlerts', 'تنبيهات الأخطاء', 'إشعارات أخطاء API')}
                  
                  <View style={styles.settingItem}>
                    <Text style={styles.settingTitle}>فترة التذكير (دقائق)</Text>
                    <TextInput
                      style={styles.tokenInput}
                      value={String(settings.notifications?.reminderInterval || 30)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 30;
                        if (value >= 5 && value <= 1440) {
                          updateSetting('notifications', 'reminderInterval', value);
                        }
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#888"
                    />
                  </View>
                </View>
              )}

              {activeTab === 'privacy' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>الأمان والخصوصية</Text>
                  
                  {renderSwitchSetting('privacy', 'saveConversations', 'حفظ المحادثات', 'حفظ المحادثات محلياً')}
                  {renderSwitchSetting('privacy', 'encryptData', 'تشفير البيانات', 'تشفير البيانات المحفوظة')}
                  {renderSwitchSetting('privacy', 'autoDeleteOldChats', 'حذف المحادثات القديمة', 'حذف تلقائي للمحادثات القديمة')}
                  {renderSwitchSetting('privacy', 'shareUsageStats', 'مشاركة الإحصائيات', 'مشاركة إحصائيات الاستخدام')}
                  {renderSwitchSetting('privacy', 'biometricAuth', 'المصادقة البيومترية', 'استخدام البصمة أو الوجه')}
                  
                  <View style={styles.settingItem}>
                    <Text style={styles.settingTitle}>أيام الحذف التلقائي</Text>
                    <TextInput
                      style={styles.tokenInput}
                      value={String(settings.privacy?.autoDeleteDays || 30)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 30;
                        if (value >= 1 && value <= 365) {
                          updateSetting('privacy', 'autoDeleteDays', value);
                        }
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#888"
                    />
                  </View>
                </View>
              )}

              {activeTab === 'media' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>إعدادات الوسائط</Text>
                  
                  {renderPickerSetting(
                    'media', 'imageQuality', 'جودة الصور',
                    ['low', 'medium', 'high'],
                    ['منخفضة', 'متوسطة', 'عالية']
                  )}
                  
                  {renderPickerSetting(
                    'media', 'audioQuality', 'جودة الصوت',
                    ['low', 'medium', 'high'],
                    ['منخفضة', 'متوسطة', 'عالية']
                  )}
                  
                  <View style={styles.settingItem}>
                    <Text style={styles.settingTitle}>حد حجم الصور (MB)</Text>
                    <TextInput
                      style={styles.tokenInput}
                      value={String(settings.media?.maxImageSize || 5)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 5;
                        if (value >= 1 && value <= 50) {
                          updateSetting('media', 'maxImageSize', value);
                        }
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#888"
                    />
                  </View>
                  
                  <View style={styles.settingItem}>
                    <Text style={styles.settingTitle}>حد مدة الصوت (ثانية)</Text>
                    <TextInput
                      style={styles.tokenInput}
                      value={String(settings.media?.maxAudioDuration || 60)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 60;
                        if (value >= 10 && value <= 300) {
                          updateSetting('media', 'maxAudioDuration', value);
                        }
                      }}
                      keyboardType="numeric"
                      placeholderTextColor="#888"
                    />
                  </View>
                  
                  {renderSwitchSetting('media', 'autoDownloadImages', 'تحميل الصور تلقائياً', 'تحميل الصور عند استلامها')}
                  {renderSwitchSetting('media', 'compressImages', 'ضغط الصور', 'ضغط الصور لتوفير المساحة')}
                </View>
              )}

              {activeTab === 'stats' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>إحصائيات الاستخدام</Text>
                  
                  <View style={styles.statsContainer}>
                    {renderUsageStat('عدد الرسائل', usageStats.messagesCount)}
                    {renderUsageStat('الصور المرفوعة', usageStats.imagesUploaded)}
                    {renderUsageStat('التسجيلات الصوتية', usageStats.audioRecorded)}
                    {renderUsageStat('الأكواد المُولدة', usageStats.codeGenerated)}
                    {renderUsageStat('عمليات البحث', usageStats.searchesPerformed)}
                    {renderUsageStat('المحادثات المنشأة', usageStats.conversationsCreated)}
                    {renderUsageStat('وقت الاستخدام', Math.round(usageStats.totalAppUsage), ' دقيقة')}
                  </View>
                  
                  <TouchableOpacity style={styles.actionButton} onPress={clearUsageStats}>
                    <Text style={styles.actionButtonText}>مسح الإحصائيات</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton} onPress={exportSettings}>
                    <Text style={styles.actionButtonText}>تصدير الإعدادات</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 10,
  },
  resetButtonText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    minWidth: 80,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    color: '#aaa',
    fontSize: 16,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
  },
  settingValue: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 2,
  },
  pickerContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    minWidth: 120,
  },
  picker: {
    color: '#ffffff',
    height: 40,
  },
  sliderContainer: {
    minWidth: 80,
  },
  sliderInput: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    textAlign: 'center',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
  },
  tokenInput: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    textAlign: 'center',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
    minWidth: 80,
  },
  statsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  statTitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  statValue: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedSettings;