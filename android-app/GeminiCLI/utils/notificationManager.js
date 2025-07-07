import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// تكوين الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationManager {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // تسجيل الإشعارات
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('لا يمكن الحصول على إذن الإشعارات!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
    } else {
      alert('يجب استخدام جهاز حقيقي للإشعارات');
    }

    this.expoPushToken = token;
    return token;
  }

  // إعداد مستمعي الإشعارات
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    this.notificationListener = Notifications.addNotificationReceivedListener(onNotificationReceived);
    this.responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);
  }

  // إزالة المستمعين
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // جدولة إشعار محلي
  async scheduleLocalNotification(title, body, data = {}, trigger = null) {
    const notificationContent = {
      title,
      body,
      data,
      sound: 'default',
      priority: 'high',
      vibrate: [0, 250, 250, 250],
    };

    if (trigger) {
      return await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger,
      });
    } else {
      return await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // إشعار فوري
      });
    }
  }

  // إشعار تذكير بالمحادثة
  async scheduleConversationReminder(conversationTitle, minutes = 30) {
    const trigger = {
      type: 'timeInterval',
      seconds: minutes * 60,
    };

    return this.scheduleLocalNotification(
      'تذكير بالمحادثة',
      `لديك محادثة غير مكتملة: ${conversationTitle}`,
      { type: 'conversation_reminder', title: conversationTitle },
      trigger
    );
  }

  // إشعار انتهاء الرد
  async notifyResponseComplete(conversationTitle) {
    return this.scheduleLocalNotification(
      'تم الانتهاء من الرد',
      `Gemini انتهى من الرد في المحادثة: ${conversationTitle}`,
      { type: 'response_complete', title: conversationTitle }
    );
  }

  // إشعار خطأ في API
  async notifyAPIError(errorMessage) {
    return this.scheduleLocalNotification(
      'خطأ في الاتصال',
      `حدث خطأ: ${errorMessage}`,
      { type: 'api_error', error: errorMessage }
    );
  }

  // إشعار تحديث متاح
  async notifyUpdateAvailable(version) {
    return this.scheduleLocalNotification(
      'تحديث متاح',
      `إصدار جديد متاح: ${version}`,
      { type: 'update_available', version }
    );
  }

  // إشعار نصائح يومية
  async scheduleDailyTip() {
    const tips = [
      'يمكنك إرسال الصور لـ Gemini لتحليلها والحصول على وصف تفصيلي',
      'استخدم محرر الأكواد لإنشاء وتحرير أكواد البرمجة',
      'جرب البحث على الإنترنت للحصول على معلومات محدثة',
      'يمكنك تسجيل رسائل صوتية وإرسالها لـ Gemini',
      'استخدم منشئ المشاريع لإنشاء تطبيقات جديدة',
      'يمكنك حفظ المحادثات والرجوع إليها لاحقاً',
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    const trigger = {
      type: 'timeInterval',
      seconds: 24 * 60 * 60, // كل 24 ساعة
      repeats: true,
    };

    return this.scheduleLocalNotification(
      'نصيحة اليوم',
      randomTip,
      { type: 'daily_tip', tip: randomTip },
      trigger
    );
  }

  // إلغاء جميع الإشعارات المجدولة
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // إلغاء إشعار محدد
  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // الحصول على الإشعارات المجدولة
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // تنظيف الإشعارات القديمة
  async clearOldNotifications() {
    await Notifications.dismissAllNotificationsAsync();
  }
}

export default new NotificationManager();