# إعداد وتطوير تطبيق Gemini CLI Android

هذا الدليل يشرح كيفية إعداد وتطوير تطبيق Android لـ Gemini CLI.

## متطلبات التطوير

### الأدوات المطلوبة
- Node.js 18+
- npm أو yarn
- Android Studio (للتطوير المحلي)
- Java JDK 17+

### الإعداد الأولي

1. **استنساخ المستودع:**
   ```bash
   git clone https://github.com/you112ef/gemini-cli.git
   cd gemini-cli/android-app/GeminiCLI
   ```

2. **تثبيت التبعيات:**
   ```bash
   npm install
   ```

3. **فحص التكوين:**
   ```bash
   npm run doctor
   ```

## التطوير

### تشغيل التطبيق في وضع التطوير

```bash
# تشغيل Metro bundler
npm start

# تشغيل على محاكي Android
npm run android

# تشغيل كـ web app
npm run web
```

### البناء للإنتاج

#### الطريقة الأولى: البناء المحلي
```bash
# إنشاء ملفات Android الأصلية
npm run prebuild

# بناء APK
npm run build:android
```

#### الطريقة الثانية: باستخدام EAS Build (موصى به)
```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول إلى Expo
eas login

# بناء APK
npm run build:apk
```

## هيكل المشروع

```
android-app/GeminiCLI/
├── App.js                 # التطبيق الرئيسي
├── app.json              # تكوين Expo
├── eas.json              # تكوين EAS Build
├── package.json          # تبعيات وscripts
├── assets/               # الأصول (أيقونات، صور)
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
└── android/              # ملفات Android المولدة (بعد prebuild)
```

## الميزات المطبقة

- ✅ واجهة دردشة مع Gemini AI
- ✅ تخزين آمن لمفتاح API باستخدام AsyncStorage
- ✅ واجهة مظلمة أنيقة
- ✅ تصميم متجاوب
- ✅ معالجة الأخطاء
- ✅ مؤشرات التحميل
- ✅ إعدادات المستخدم

## الميزات المخطط لها

- 🔄 دعم المحادثات المتعددة
- 🔄 حفظ تاريخ المحادثات
- 🔄 إعدادات متقدمة (نموذج، temperature، إلخ)
- 🔄 دعم رفع الملفات والصور
- 🔄 تصدير المحادثات
- 🔄 إشعارات push
- 🔄 وضع offline للردود المحفوظة

## الاختبار

### اختبار محلي
```bash
# تشغيل على محاكي Android
npm run android

# اختبار على جهاز حقيقي
# 1. مكن USB debugging
# 2. شغل npm run android
```

### اختبار APK
```bash
# بناء APK للاختبار
npm run build:android

# العثور على APK في:
# android/app/build/outputs/apk/release/app-release.apk
```

## نشر التطبيق

### GitHub Releases
يتم بناء APK تلقائياً عبر GitHub Actions عند:
- Push إلى main branch
- إنشاء pull request
- تشغيل manual workflow

### Google Play Store (مستقبلاً)
سيتم إضافة دعم النشر على Google Play Store في إصدارات لاحقة.

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في Metro bundler:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **مشاكل Android SDK:**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **تبعيات غير متوافقة:**
   ```bash
   npm run doctor
   npx expo install --check
   ```

## المساهمة

1. Fork المستودع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. أنشئ Pull Request

## الدعم

- [Documentation](../README.md)
- [Issues](https://github.com/you112ef/gemini-cli/issues)
- [Discussions](https://github.com/you112ef/gemini-cli/discussions)