import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('gemini_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      } else {
        setShowSettings(true);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveApiKey = async (key) => {
    try {
      await AsyncStorage.setItem('gemini_api_key', key);
      setApiKey(key);
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !apiKey) {
      if (!apiKey) {
        Alert.alert('Error', 'Please set your Gemini API key first');
        setShowSettings(true);
      }
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: inputText
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const geminiMessage = {
          id: Date.now() + 1,
          text: data.candidates[0].content.parts[0].text,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, geminiMessage]);
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your request. Please check your API key and try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  if (showSettings) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#1a1a1a" />
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Gemini API Settings</Text>
          <Text style={styles.settingsDescription}>
            Enter your Gemini API key from Google AI Studio
          </Text>
          <TextInput
            style={styles.apiKeyInput}
            placeholder="Enter your Gemini API key"
            placeholderTextColor="#666"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            multiline
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveApiKey(apiKey)}
            disabled={!apiKey.trim()}
          >
            <Text style={styles.saveButtonText}>Save & Continue</Text>
          </TouchableOpacity>
          {apiKey && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gemini CLI Mobile</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearMessages}
          >
            <Text style={styles.headerButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Welcome to Gemini CLI Mobile!</Text>
              <Text style={styles.welcomeText}>
                Start a conversation with Gemini AI. Ask questions, get help with code, or chat about anything!
              </Text>
            </View>
          )}
          
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.geminiMessage,
                message.isError && styles.errorMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.geminiMessageText,
                message.isError && styles.errorMessageText,
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.isUser ? styles.userMessageTime : styles.geminiMessageTime,
              ]}>
                {message.timestamp}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#4285f4" size="small" />
              <Text style={styles.loadingText}>Gemini is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask Gemini anything..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>▶️</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#404040',
  },
  headerButtonText: {
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4285f4',
  },
  geminiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#404040',
  },
  errorMessage: {
    backgroundColor: '#d32f2f',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  geminiMessageText: {
    color: '#ffffff',
  },
  errorMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  userMessageTime: {
    color: '#ffffff',
  },
  geminiMessageTime: {
    color: '#cccccc',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  loadingText: {
    color: '#cccccc',
    marginLeft: 8,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#404040',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#4285f4',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#666666',
  },
  sendButtonText: {
    fontSize: 18,
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 12,
    textAlign: 'center',
  },
  settingsDescription: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  saveButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#cccccc',
    fontSize: 16,
  },
});
