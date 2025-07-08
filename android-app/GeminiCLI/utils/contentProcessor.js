// معالج المحتوى المتقدم
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// أنواع الملفات المدعومة
export const SUPPORTED_FILE_TYPES = {
  IMAGES: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'ملفات الصور',
  },
  DOCUMENTS: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/rtf',
    ],
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'المستندات والملفات النصية',
  },
  AUDIO: {
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'],
    extensions: ['.mp3', '.wav', '.ogg', '.m4a', '.aac'],
    maxSize: 25 * 1024 * 1024, // 25MB
    description: 'ملفات الصوت',
  },
  VIDEO: {
    mimeTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    description: 'ملفات الفيديو',
  },
  CODE: {
    mimeTypes: ['text/plain'],
    extensions: [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
      '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.dart',
      '.html', '.css', '.scss', '.less', '.json', '.xml', '.yaml', '.yml',
      '.sql', '.sh', '.bat', '.ps1', '.r', '.m', '.scala', '.clj',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'ملفات الكود والبرمجة',
  },
};

// كلاس معالج المحتوى
class ContentProcessor {
  constructor() {
    this.processingQueue = [];
    this.isProcessing = false;
  }

  // اختيار ملف
  async pickFile(fileTypes = ['IMAGES', 'DOCUMENTS']) {
    try {
      const allowedTypes = [];
      fileTypes.forEach(type => {
        if (SUPPORTED_FILE_TYPES[type]) {
          allowedTypes.push(...SUPPORTED_FILE_TYPES[type].mimeTypes);
        }
      });

      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        return await this.processFile(file);
      }

      return null;
    } catch (error) {
      console.error('خطأ في اختيار الملف:', error);
      Alert.alert('خطأ', 'فشل في اختيار الملف');
      return null;
    }
  }

  // معالجة ملف
  async processFile(file) {
    try {
      // التحقق من نوع الملف
      const fileType = this.detectFileType(file);
      if (!fileType) {
        Alert.alert('خطأ', 'نوع الملف غير مدعوم');
        return null;
      }

      // التحقق من حجم الملف
      if (file.size > SUPPORTED_FILE_TYPES[fileType].maxSize) {
        const maxSizeMB = SUPPORTED_FILE_TYPES[fileType].maxSize / (1024 * 1024);
        Alert.alert('خطأ', `حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB}MB`);
        return null;
      }

      // معالجة حسب نوع الملف
      switch (fileType) {
        case 'IMAGES':
          return await this.processImage(file);
        case 'DOCUMENTS':
          return await this.processDocument(file);
        case 'AUDIO':
          return await this.processAudio(file);
        case 'VIDEO':
          return await this.processVideo(file);
        case 'CODE':
          return await this.processCode(file);
        default:
          return await this.processGeneric(file);
      }
    } catch (error) {
      console.error('خطأ في معالجة الملف:', error);
      Alert.alert('خطأ', 'فشل في معالجة الملف');
      return null;
    }
  }

  // اكتشاف نوع الملف
  detectFileType(file) {
    const mimeType = file.mimeType || file.type;
    const fileName = file.name || file.uri.split('/').pop();
    const extension = fileName.includes('.') ? '.' + fileName.split('.').pop().toLowerCase() : '';

    for (const [typeName, typeInfo] of Object.entries(SUPPORTED_FILE_TYPES)) {
      if (typeInfo.mimeTypes.includes(mimeType) || typeInfo.extensions.includes(extension)) {
        return typeName;
      }
    }

    return null;
  }

  // معالجة الصور
  async processImage(file) {
    try {
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        type: 'image',
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        base64: base64,
        metadata: {
          width: null, // يمكن إضافة معلومات الأبعاد لاحقاً
          height: null,
          format: file.mimeType?.split('/')[1] || 'unknown',
        },
        processed: true,
        supportedByAI: true,
      };
    } catch (error) {
      console.error('خطأ في معالجة الصورة:', error);
      return null;
    }
  }

  // معالجة المستندات
  async processDocument(file) {
    try {
      let textContent = '';
      let base64Content = '';

      // قراءة المحتوى
      if (file.mimeType === 'text/plain') {
        textContent = await FileSystem.readAsStringAsync(file.uri);
      } else {
        // للملفات الأخرى، نحفظها كـ base64 لمعالجة لاحقة
        base64Content = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      return {
        type: 'document',
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        textContent: textContent,
        base64: base64Content,
        metadata: {
          format: this.getDocumentFormat(file.mimeType),
          pageCount: null, // يمكن إضافة معلومات الصفحات لاحقاً
          wordCount: textContent ? textContent.split(/\s+/).length : null,
        },
        processed: true,
        supportedByAI: file.mimeType === 'text/plain' || file.mimeType === 'application/pdf',
      };
    } catch (error) {
      console.error('خطأ في معالجة المستند:', error);
      return null;
    }
  }

  // معالجة الصوت
  async processAudio(file) {
    try {
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        type: 'audio',
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        base64: base64,
        metadata: {
          duration: null, // يمكن إضافة مدة الصوت لاحقاً
          format: file.mimeType?.split('/')[1] || 'unknown',
          sampleRate: null,
          channels: null,
        },
        processed: true,
        supportedByAI: false, // معظم النماذج لا تدعم الصوت مباشرة
      };
    } catch (error) {
      console.error('خطأ في معالجة الصوت:', error);
      return null;
    }
  }

  // معالجة الفيديو
  async processVideo(file) {
    try {
      // للفيديو، نحفظ المعلومات الأساسية فقط
      // يمكن إضافة استخراج الإطارات لاحقاً
      return {
        type: 'video',
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        base64: null, // الفيديو كبير جداً لتحويله لـ base64
        metadata: {
          duration: null,
          format: file.mimeType?.split('/')[1] || 'unknown',
          resolution: null,
          frameRate: null,
        },
        processed: true,
        supportedByAI: false, // معظم النماذج لا تدعم الفيديو مباشرة
      };
    } catch (error) {
      console.error('خطأ في معالجة الفيديو:', error);
      return null;
    }
  }

  // معالجة ملفات الكود
  async processCode(file) {
    try {
      const content = await FileSystem.readAsStringAsync(file.uri);
      const language = this.detectCodeLanguage(file.name);

      return {
        type: 'code',
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        textContent: content,
        metadata: {
          language: language,
          lineCount: content.split('\n').length,
          characterCount: content.length,
          extension: file.name.split('.').pop(),
        },
        processed: true,
        supportedByAI: true,
      };
    } catch (error) {
      console.error('خطأ في معالجة ملف الكود:', error);
      return null;
    }
  }

  // معالجة عامة
  async processGeneric(file) {
    try {
      return {
        type: 'generic',
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        metadata: {
          format: file.mimeType || 'unknown',
        },
        processed: true,
        supportedByAI: false,
      };
    } catch (error) {
      console.error('خطأ في المعالجة العامة:', error);
      return null;
    }
  }

  // اكتشاف لغة البرمجة
  detectCodeLanguage(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'tsx': 'React TSX',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'h': 'C/C++ Header',
      'cs': 'C#',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'dart': 'Dart',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'less': 'LESS',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'sql': 'SQL',
      'sh': 'Shell Script',
      'bat': 'Batch',
      'ps1': 'PowerShell',
      'r': 'R',
      'm': 'MATLAB/Objective-C',
      'scala': 'Scala',
      'clj': 'Clojure',
    };

    return languageMap[extension] || 'Unknown';
  }

  // الحصول على تنسيق المستند
  getDocumentFormat(mimeType) {
    const formatMap = {
      'application/pdf': 'PDF',
      'application/msword': 'Word Document (.doc)',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (.docx)',
      'application/vnd.ms-excel': 'Excel Spreadsheet (.xls)',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (.xlsx)',
      'application/vnd.ms-powerpoint': 'PowerPoint Presentation (.ppt)',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation (.pptx)',
      'text/plain': 'Plain Text',
      'text/rtf': 'Rich Text Format',
    };

    return formatMap[mimeType] || 'Unknown Format';
  }

  // معالجة متعددة الملفات
  async processMultipleFiles(files) {
    try {
      const results = [];
      for (const file of files) {
        const processed = await this.processFile(file);
        if (processed) {
          results.push(processed);
        }
      }
      return results;
    } catch (error) {
      console.error('خطأ في معالجة ملفات متعددة:', error);
      return [];
    }
  }

  // إنشاء ملخص المحتوى للـ AI
  createContentSummary(processedFile) {
    if (!processedFile) return '';

    let summary = `ملف: ${processedFile.name}\n`;
    summary += `النوع: ${processedFile.type}\n`;
    summary += `الحجم: ${this.formatFileSize(processedFile.size)}\n`;

    switch (processedFile.type) {
      case 'image':
        summary += `تنسيق الصورة: ${processedFile.metadata.format}\n`;
        break;
      case 'document':
        summary += `تنسيق المستند: ${processedFile.metadata.format}\n`;
        if (processedFile.metadata.wordCount) {
          summary += `عدد الكلمات: ${processedFile.metadata.wordCount}\n`;
        }
        break;
      case 'code':
        summary += `لغة البرمجة: ${processedFile.metadata.language}\n`;
        summary += `عدد الأسطر: ${processedFile.metadata.lineCount}\n`;
        break;
      case 'audio':
        summary += `تنسيق الصوت: ${processedFile.metadata.format}\n`;
        break;
      case 'video':
        summary += `تنسيق الفيديو: ${processedFile.metadata.format}\n`;
        break;
    }

    return summary;
  }

  // تنسيق حجم الملف
  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // التحقق من دعم النموذج للملف
  isFileSupported(processedFile, modelCapabilities) {
    if (!processedFile || !modelCapabilities) return false;

    switch (processedFile.type) {
      case 'image':
        return modelCapabilities.supportsImages;
      case 'audio':
        return modelCapabilities.supportsAudio;
      case 'video':
        return modelCapabilities.supportsVideo;
      case 'document':
      case 'code':
        return true; // معظم النماذج تدعم النصوص
      default:
        return false;
    }
  }

  // تحسين المحتوى للـ AI
  optimizeContentForAI(processedFile, modelCapabilities) {
    if (!this.isFileSupported(processedFile, modelCapabilities)) {
      return null;
    }

    const optimized = {
      ...processedFile,
      summary: this.createContentSummary(processedFile),
    };

    // تحسينات خاصة بكل نوع
    switch (processedFile.type) {
      case 'image':
        // للصور، نضيف معلومات إضافية
        optimized.aiPrompt = 'صف هذه الصورة بالتفصيل وحلل محتواها';
        break;
      case 'document':
        // للمستندات، نضيف المحتوى النصي إذا كان متاحاً
        if (processedFile.textContent) {
          optimized.aiPrompt = `تحليل المستند التالي:\n\n${processedFile.textContent}`;
        }
        break;
      case 'code':
        // للكود، نضيف السياق
        optimized.aiPrompt = `راجع هذا الكود في لغة ${processedFile.metadata.language}:\n\n\`\`\`${processedFile.metadata.language.toLowerCase()}\n${processedFile.textContent}\n\`\`\``;
        break;
    }

    return optimized;
  }
}

export default new ContentProcessor();