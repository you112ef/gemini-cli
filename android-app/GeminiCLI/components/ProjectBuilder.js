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
  ActivityIndicator,
} from 'react-native';

const ProjectBuilder = ({ isVisible, onClose, onProjectGenerated }) => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('react-native');
  const [projectDescription, setProjectDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState(null);

  const projectTypes = [
    {
      id: 'react-native',
      name: 'React Native App',
      icon: '📱',
      description: 'تطبيق محمول متعدد المنصات',
    },
    {
      id: 'web-app',
      name: 'Web Application',
      icon: '🌐',
      description: 'تطبيق ويب تفاعلي',
    },
    {
      id: 'api',
      name: 'REST API',
      icon: '🔗',
      description: 'خدمة API backend',
    },
    {
      id: 'game',
      name: 'Mobile Game',
      icon: '🎮',
      description: 'لعبة محمولة',
    },
  ];

  const availableFeatures = [
    { id: 'auth', name: 'تسجيل الدخول والمصادقة', icon: '🔐' },
    { id: 'database', name: 'قاعدة البيانات', icon: '💾' },
    { id: 'notifications', name: 'الإشعارات', icon: '🔔' },
    { id: 'chat', name: 'نظام الدردشة', icon: '💬' },
    { id: 'maps', name: 'الخرائط والموقع', icon: '🗺️' },
    { id: 'camera', name: 'الكاميرا والصور', icon: '📷' },
    { id: 'payments', name: 'المدفوعات', icon: '💳' },
    { id: 'social', name: 'المشاركة الاجتماعية', icon: '🔗' },
    { id: 'offline', name: 'العمل بدون إنترنت', icon: '📱' },
    { id: 'analytics', name: 'التحليلات', icon: '📊' },
  ];

  const toggleFeature = (featureId) => {
    setFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const generateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المشروع');
      return;
    }

    if (!projectDescription.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال وصف المشروع');
      return;
    }

    setIsGenerating(true);

    try {
      // محاكاة توليد المشروع
      await new Promise(resolve => setTimeout(resolve, 3000));

      const selectedProjectType = projectTypes.find(type => type.id === projectType);
      const selectedFeatures = availableFeatures.filter(feature => features.includes(feature.id));

      const projectStructure = generateProjectStructure(projectType, features);
      const codeFiles = generateCodeFiles(projectType, projectName, features);

      const project = {
        name: projectName,
        type: selectedProjectType,
        description: projectDescription,
        features: selectedFeatures,
        structure: projectStructure,
        files: codeFiles,
        packageJson: generatePackageJson(projectName, projectType, features),
        readme: generateReadme(projectName, projectDescription, selectedFeatures),
        createdAt: new Date().toISOString(),
      };

      setGeneratedProject(project);

    } catch (error) {
      console.error('Error generating project:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProjectStructure = (type, features) => {
    const baseStructure = {
      'react-native': [
        'src/',
        '├── components/',
        '├── screens/',
        '├── navigation/',
        '├── services/',
        '├── utils/',
        'assets/',
        'App.js',
        'package.json',
      ],
      'web-app': [
        'src/',
        '├── components/',
        '├── pages/',
        '├── services/',
        '├── styles/',
        'public/',
        'index.html',
        'package.json',
      ],
      'api': [
        'src/',
        '├── controllers/',
        '├── models/',
        '├── routes/',
        '├── middleware/',
        'config/',
        'server.js',
        'package.json',
      ],
      'game': [
        'src/',
        '├── scenes/',
        '├── sprites/',
        '├── sounds/',
        '├── utils/',
        'assets/',
        'Game.js',
        'package.json',
      ],
    };

    return baseStructure[type] || baseStructure['react-native'];
  };

  const generateCodeFiles = (type, name, features) => {
    const files = {
      'App.js': generateMainAppFile(type, name, features),
    };

    if (features.includes('auth')) {
      files['src/components/LoginScreen.js'] = generateLoginComponent(type);
    }

    if (features.includes('database')) {
      files['src/services/database.js'] = generateDatabaseService(type);
    }

    if (features.includes('chat')) {
      files['src/components/ChatScreen.js'] = generateChatComponent(type);
    }

    return files;
  };

  const generateMainAppFile = (type, name, features) => {
    if (type === 'react-native') {
      return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
${features.includes('auth') ? "import LoginScreen from './src/components/LoginScreen';" : ''}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        ${features.includes('auth') ? '<Stack.Screen name="Login" component={LoginScreen} />' : ''}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`;
    }

    return `// ${name} - ${type} Application
// Generated by Gemini CLI Mobile App Builder

console.log('${name} application started');`;
  };

  const generateLoginComponent = (type) => {
    return `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login logic
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>دخول</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default LoginScreen;`;
  };

  const generateDatabaseService = (type) => {
    return `// Database Service
import AsyncStorage from '@react-native-async-storage/async-storage';

class DatabaseService {
  static async saveData(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  static async loadData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  static async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  }
}

export default DatabaseService;`;
  };

  const generateChatComponent = (type) => {
    return `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="اكتب رسالة..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messagesList: { flex: 1, padding: 10 },
  messageContainer: { backgroundColor: 'white', padding: 10, marginBottom: 5, borderRadius: 5 },
  messageText: { fontSize: 16 },
  messageTime: { fontSize: 12, color: '#666', marginTop: 5 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  sendButton: { marginLeft: 10, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
});

export default ChatScreen;`;
  };

  const generatePackageJson = (name, type, features) => {
    const dependencies = {
      'react-native': {
        'react': '^18.0.0',
        'react-native': '^0.70.0',
        '@react-navigation/native': '^6.0.0',
        '@react-navigation/stack': '^6.0.0',
      },
      'web-app': {
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        'react-router-dom': '^6.0.0',
      },
      'api': {
        'express': '^4.18.0',
        'cors': '^2.8.5',
        'body-parser': '^1.20.0',
      },
      'game': {
        'react': '^18.0.0',
        'react-native': '^0.70.0',
        'react-native-game-engine': '^1.2.0',
      },
    };

    const baseDeps = dependencies[type] || dependencies['react-native'];

    if (features.includes('auth')) {
      baseDeps['@react-native-async-storage/async-storage'] = '^1.17.0';
    }

    if (features.includes('database')) {
      baseDeps['@react-native-async-storage/async-storage'] = '^1.17.0';
    }

    return JSON.stringify({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: projectDescription,
      main: 'App.js',
      scripts: {
        start: 'expo start',
        android: 'expo start --android',
        ios: 'expo start --ios',
        web: 'expo start --web',
      },
      dependencies: baseDeps,
    }, null, 2);
  };

  const generateReadme = (name, description, features) => {
    const featuresList = features.map(f => `- ${f.icon} ${f.name}`).join('\n');
    
    return `# ${name}

${description}

## الميزات

${featuresList || '- الميزات الأساسية للتطبيق'}

## التثبيت

\`\`\`bash
npm install
\`\`\`

## التشغيل

\`\`\`bash
npm start
\`\`\`

## البناء

\`\`\`bash
npm run build
\`\`\`

---

تم إنشاء هذا المشروع بواسطة Gemini CLI Mobile App Builder.
`;
  };

  const downloadProject = () => {
    Alert.alert(
      'تنزيل المشروع',
      'سيتم تنزيل ملفات المشروع كملف ZIP.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تنزيل', onPress: () => {
          // في التطبيق الحقيقي، يمكن إنشاء ملف ZIP وتنزيله
          Alert.alert('نجح', 'تم تنزيل المشروع بنجاح!');
        }}
      ]
    );
  };

  const shareProject = () => {
    if (generatedProject && onProjectGenerated) {
      onProjectGenerated(generatedProject);
      onClose();
    }
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setFeatures([]);
    setGeneratedProject(null);
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
          <Text style={styles.headerTitle}>مولد التطبيقات</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {!generatedProject ? (
            <>
              {/* Project Name */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>اسم المشروع:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: تطبيق المهام اليومية"
                  placeholderTextColor="#666"
                  value={projectName}
                  onChangeText={setProjectName}
                />
              </View>

              {/* Project Type */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>نوع المشروع:</Text>
                <View style={styles.typeGrid}>
                  {projectTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeCard,
                        projectType === type.id && styles.typeCardActive,
                      ]}
                      onPress={() => setProjectType(type.id)}
                    >
                      <Text style={styles.typeIcon}>{type.icon}</Text>
                      <Text style={[
                        styles.typeName,
                        projectType === type.id && styles.typeNameActive,
                      ]}>
                        {type.name}
                      </Text>
                      <Text style={styles.typeDescription}>{type.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Project Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>وصف المشروع:</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  placeholder="اكتب وصفاً مفصلاً للمشروع وما يجب أن يقوم به..."
                  placeholderTextColor="#666"
                  value={projectDescription}
                  onChangeText={setProjectDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Features */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الميزات المطلوبة:</Text>
                <View style={styles.featuresGrid}>
                  {availableFeatures.map((feature) => (
                    <TouchableOpacity
                      key={feature.id}
                      style={[
                        styles.featureCard,
                        features.includes(feature.id) && styles.featureCardActive,
                      ]}
                      onPress={() => toggleFeature(feature.id)}
                    >
                      <Text style={styles.featureIcon}>{feature.icon}</Text>
                      <Text style={[
                        styles.featureName,
                        features.includes(feature.id) && styles.featureNameActive,
                      ]}>
                        {feature.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                onPress={generateProject}
                disabled={isGenerating}
              >
                <Text style={styles.generateButtonText}>
                  {isGenerating ? '🔄 جاري الإنشاء...' : '⚡ إنشاء المشروع'}
                </Text>
              </TouchableOpacity>

              {/* Generating State */}
              {isGenerating && (
                <View style={styles.generatingContainer}>
                  <ActivityIndicator size="large" color="#4285f4" />
                  <Text style={styles.generatingText}>جاري إنشاء المشروع...</Text>
                  <Text style={styles.generatingSubText}>
                    يتم الآن إنشاء بنية المشروع وكتابة الأكواد...
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Generated Project */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>المشروع جاهز! 🎉</Text>
                <View style={styles.projectSummary}>
                  <Text style={styles.projectTitle}>{generatedProject.name}</Text>
                  <Text style={styles.projectType}>
                    {generatedProject.type.icon} {generatedProject.type.name}
                  </Text>
                  <Text style={styles.projectDescription}>{generatedProject.description}</Text>
                </View>
              </View>

              {/* Project Structure */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>بنية المشروع:</Text>
                <View style={styles.codeContainer}>
                  {generatedProject.structure.map((item, index) => (
                    <Text key={index} style={styles.structureItem}>{item}</Text>
                  ))}
                </View>
              </View>

              {/* Features */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الميزات المدمجة:</Text>
                <View style={styles.featuresList}>
                  {generatedProject.features.map((feature) => (
                    <View key={feature.id} style={styles.featureItem}>
                      <Text style={styles.featureItemIcon}>{feature.icon}</Text>
                      <Text style={styles.featureItemName}>{feature.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.projectActions}>
                <TouchableOpacity style={styles.actionButton} onPress={downloadProject}>
                  <Text style={styles.actionButtonText}>💾 تنزيل المشروع</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={shareProject}>
                  <Text style={styles.actionButtonText}>📤 مشاركة</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
                  <Text style={styles.secondaryButtonText}>🔄 مشروع جديد</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
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
  textInput: {
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    fontSize: 16,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
    width: '48%',
  },
  typeCardActive: {
    backgroundColor: '#4285f4',
    borderColor: '#4285f4',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#cccccc',
    marginBottom: 4,
    textAlign: 'center',
  },
  typeNameActive: {
    color: '#ffffff',
  },
  typeDescription: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
    width: '48%',
  },
  featureCardActive: {
    backgroundColor: '#4285f4',
    borderColor: '#4285f4',
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureName: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center',
  },
  featureNameActive: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  generatingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  generatingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  generatingSubText: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  projectSummary: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 8,
  },
  projectType: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  codeContainer: {
    backgroundColor: '#0d1117',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  structureItem: {
    color: '#f8f8f2',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#404040',
  },
  featureItemIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  featureItemName: {
    color: '#ffffff',
    fontSize: 14,
  },
  projectActions: {
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#666666',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default ProjectBuilder;