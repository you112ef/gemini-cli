import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import settingsManager from '../utils/settingsManager';

const { width, height } = Dimensions.get('window');

const UsageStatistics = ({ visible, onClose }) => {
  const [usageStats, setUsageStats] = useState({});
  const [appInfo, setAppInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadStatistics();
    }
  }, [visible]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const stats = await settingsManager.loadUsageStats();
      const info = settingsManager.getAppInfo();
      setUsageStats(stats);
      setAppInfo(info);
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير متاح';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} دقيقة`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} ساعة ${remainingMinutes} دقيقة`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return `${days} يوم ${remainingHours} ساعة`;
    }
  };

  const getDaysUsed = () => {
    if (!usageStats.installDate) return 0;
    const installDate = new Date(usageStats.installDate);
    const today = new Date();
    const diffTime = Math.abs(today - installDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAverageDaily = (total, days) => {
    if (days === 0) return 0;
    return Math.round(total / days);
  };

  const resetStatistics = () => {
    Alert.alert(
      'مسح الإحصائيات',
      'هل تريد مسح جميع إحصائيات الاستخدام؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            await settingsManager.resetUsageStats();
            await loadStatistics();
            Alert.alert('تم', 'تم مسح الإحصائيات بنجاح');
          },
        },
      ]
    );
  };

  const renderStatCard = (title, value, subtitle, color = '#007AFF') => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statCardTitle}>{title}</Text>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderProgressBar = (current, max, label, color = '#007AFF') => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{current}</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(percentage, 100)}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
      </View>
    );
  };

  if (!visible) return null;

  const daysUsed = getDaysUsed();

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
          <Text style={styles.headerTitle}>إحصائيات الاستخدام</Text>
          <TouchableOpacity onPress={resetStatistics} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>مسح</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
          ) : (
            <>
              {/* إحصائيات عامة */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 الإحصائيات العامة</Text>
                <View style={styles.statsGrid}>
                  {renderStatCard(
                    'إجمالي الرسائل',
                    usageStats.messagesCount || 0,
                    `معدل ${getAverageDaily(usageStats.messagesCount || 0, daysUsed)} يومياً`,
                    '#4CAF50'
                  )}
                  {renderStatCard(
                    'الصور المرفوعة',
                    usageStats.imagesUploaded || 0,
                    `معدل ${getAverageDaily(usageStats.imagesUploaded || 0, daysUsed)} يومياً`,
                    '#FF9800'
                  )}
                  {renderStatCard(
                    'التسجيلات الصوتية',
                    usageStats.audioRecorded || 0,
                    `معدل ${getAverageDaily(usageStats.audioRecorded || 0, daysUsed)} يومياً`,
                    '#9C27B0'
                  )}
                  {renderStatCard(
                    'الأكواد المُولدة',
                    usageStats.codeGenerated || 0,
                    `معدل ${getAverageDaily(usageStats.codeGenerated || 0, daysUsed)} يومياً`,
                    '#2196F3'
                  )}
                  {renderStatCard(
                    'عمليات البحث',
                    usageStats.searchesPerformed || 0,
                    `معدل ${getAverageDaily(usageStats.searchesPerformed || 0, daysUsed)} يومياً`,
                    '#FF5722'
                  )}
                  {renderStatCard(
                    'المحادثات',
                    usageStats.conversationsCreated || 0,
                    `معدل ${getAverageDaily(usageStats.conversationsCreated || 0, daysUsed)} يومياً`,
                    '#607D8B'
                  )}
                </View>
              </View>

              {/* وقت الاستخدام */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>⏱️ وقت الاستخدام</Text>
                <View style={styles.timeContainer}>
                  {renderStatCard(
                    'إجمالي وقت الاستخدام',
                    formatDuration(usageStats.totalAppUsage || 0),
                    `معدل ${formatDuration(getAverageDaily(usageStats.totalAppUsage || 0, daysUsed))} يومياً`,
                    '#795548'
                  )}
                  {renderStatCard(
                    'أيام الاستخدام',
                    daysUsed,
                    `منذ ${formatDate(usageStats.installDate)}`,
                    '#3F51B5'
                  )}
                </View>
              </View>

              {/* نشاط المحتوى */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📈 نشاط المحتوى</Text>
                <View style={styles.progressSection}>
                  {renderProgressBar(
                    usageStats.messagesCount || 0,
                    Math.max(100, usageStats.messagesCount || 0),
                    'الرسائل النصية',
                    '#4CAF50'
                  )}
                  {renderProgressBar(
                    usageStats.imagesUploaded || 0,
                    Math.max(50, usageStats.imagesUploaded || 0),
                    'الصور المرفوعة',
                    '#FF9800'
                  )}
                  {renderProgressBar(
                    usageStats.audioRecorded || 0,
                    Math.max(30, usageStats.audioRecorded || 0),
                    'التسجيلات الصوتية',
                    '#9C27B0'
                  )}
                  {renderProgressBar(
                    usageStats.codeGenerated || 0,
                    Math.max(20, usageStats.codeGenerated || 0),
                    'الأكواد المُولدة',
                    '#2196F3'
                  )}
                </View>
              </View>

              {/* معلومات التطبيق */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ℹ️ معلومات التطبيق</Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>الإصدار</Text>
                    <Text style={styles.infoValue}>{appInfo.version}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>رقم البناء</Text>
                    <Text style={styles.infoValue}>{appInfo.buildNumber}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>تاريخ التثبيت</Text>
                    <Text style={styles.infoValue}>{formatDate(usageStats.installDate)}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>آخر استخدام</Text>
                    <Text style={styles.infoValue}>{formatDate(usageStats.lastUsed)}</Text>
                  </View>
                </View>
              </View>

              {/* الميزات المتاحة */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🚀 الميزات المتاحة</Text>
                <View style={styles.featuresContainer}>
                  {appInfo.features?.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.featureText}>✓ {feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* تحليل الاستخدام */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔍 تحليل الاستخدام</Text>
                <View style={styles.analysisContainer}>
                  <Text style={styles.analysisText}>
                    {usageStats.messagesCount > 50
                      ? '🎉 أنت مستخدم نشط! تتفاعل بكثرة مع Gemini.'
                      : usageStats.messagesCount > 10
                      ? '👍 استخدام جيد! جرب المزيد من الميزات المتقدمة.'
                      : '🆕 مرحباً! استكشف جميع ميزات التطبيق المذهلة.'}
                  </Text>
                  <Text style={styles.analysisText}>
                    {usageStats.imagesUploaded > 20
                      ? '📸 أنت تحب تحليل الصور! استمر في الاستكشاف.'
                      : usageStats.imagesUploaded > 5
                      ? '🖼️ جرب رفع المزيد من الصور للتحليل.'
                      : '📷 جرب رفع الصور لتحليلها مع Gemini!'}
                  </Text>
                  <Text style={styles.analysisText}>
                    {usageStats.codeGenerated > 10
                      ? '💻 مطور رائع! تستخدم محرر الأكواد بكثرة.'
                      : usageStats.codeGenerated > 0
                      ? '⌨️ جرب المزيد من إنشاء الأكواد.'
                      : '🔧 اكتشف محرر الأكواد المتطور!'}
                  </Text>
                </View>
              </View>
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
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    width: '48%',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statCardTitle: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  statCardValue: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statCardSubtitle: {
    color: '#888',
    fontSize: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  progressValue: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'right',
  },
  infoContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  infoLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  infoValue: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
  },
  featureItem: {
    paddingVertical: 5,
  },
  featureText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  analysisContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
  },
  analysisText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default UsageStatistics;