import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';

const CodeEditor = ({ isVisible, onClose, onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'react', name: 'React Native', icon: '⚛️' },
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' },
  ];

  const codeTemplates = {
    javascript: `// JavaScript Code
function example() {
  console.log('Hello World');
}`,
    python: `# Python Code
def example():
    print('Hello World')`,
    java: `// Java Code
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    react: `// React Native Component
import React from 'react';
import { View, Text } from 'react-native';

const Example = () => {
  return (
    <View>
      <Text>Hello World</Text>
    </View>
  );
};

export default Example;`,
    html: `<!-- HTML Code -->
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`,
    css: `/* CSS Code */
.example {
  color: #333;
  font-size: 16px;
  padding: 10px;
}`
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال وصف للكود المطلوب');
      return;
    }

    setIsGenerating(true);
    
    try {
      // محاكاة توليد الكود (يمكن ربطه بـ Gemini API لاحقاً)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const template = codeTemplates[language] || codeTemplates.javascript;
      const generatedCode = `// Generated Code for: ${prompt}
// Language: ${language}

${template}

// TODO: Implement the requested functionality
// Prompt: ${prompt}`;

      setGeneratedCode(generatedCode);
      
    } catch (error) {
      console.error('Error generating code:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء توليد الكود');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    // في بيئة حقيقية، يمكن استخدام Clipboard
    Alert.alert('تم النسخ', 'تم نسخ الكود إلى الحافظة');
  };

  const sendCode = () => {
    if (generatedCode && onCodeGenerated) {
      onCodeGenerated(generatedCode, language);
      onClose();
    }
  };

  const resetEditor = () => {
    setPrompt('');
    setGeneratedCode('');
    setLanguage('javascript');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>محرر الأكواد</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Language Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر لغة البرمجة:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.languageButton,
                    language === lang.id && styles.languageButtonActive,
                  ]}
                  onPress={() => setLanguage(lang.id)}
                >
                  <Text style={styles.languageIcon}>{lang.icon}</Text>
                  <Text style={[
                    styles.languageText,
                    language === lang.id && styles.languageTextActive,
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Code Prompt */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>وصف الكود المطلوب:</Text>
            <TextInput
              style={styles.promptInput}
              placeholder="مثال: إنشاء دالة لحساب مجموع الأرقام في مصفوفة"
              placeholderTextColor="#666"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={generateCode}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? '🔄 جاري التوليد...' : '⚡ توليد الكود'}
            </Text>
          </TouchableOpacity>

          {/* Generated Code */}
          {generatedCode && (
            <View style={styles.section}>
              <View style={styles.codeHeader}>
                <Text style={styles.sectionTitle}>الكود المولد:</Text>
                <View style={styles.codeActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={copyCode}>
                    <Text style={styles.actionButtonText}>📋 نسخ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={sendCode}>
                    <Text style={styles.actionButtonText}>📤 إرسال</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={styles.codeContainer}>
                <Text style={styles.codeText}>{generatedCode}</Text>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.resetButton} onPress={resetEditor}>
            <Text style={styles.resetButtonText}>🔄 إعادة تعيين</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#404040',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  languageList: {
    flexDirection: 'row',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#404040',
  },
  languageButtonActive: {
    backgroundColor: '#4285f4',
    borderColor: '#4285f4',
  },
  languageIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  languageText: {
    color: '#cccccc',
    fontSize: 14,
  },
  languageTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  promptInput: {
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  generateButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  generateButtonDisabled: {
    backgroundColor: '#666666',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#404040',
  },
  actionButtonText: {
    color: '#cccccc',
    fontSize: 12,
  },
  codeContainer: {
    backgroundColor: '#0d1117',
    borderRadius: 8,
    padding: 16,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#404040',
  },
  codeText: {
    color: '#f8f8f2',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  bottomActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  resetButton: {
    backgroundColor: '#666666',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default CodeEditor;