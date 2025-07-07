import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

const WebSearchComponent = ({ isVisible, onClose, onSearchResult }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);

  // محاكاة نتائج البحث (في الواقع، يمكن ربطها بـ API حقيقي)
  const mockSearchResults = [
    {
      id: 1,
      title: 'React Native Documentation',
      url: 'https://reactnative.dev/',
      description: 'Official React Native documentation with guides and API reference.',
    },
    {
      id: 2,
      title: 'Expo Documentation',
      url: 'https://docs.expo.dev/',
      description: 'Complete documentation for Expo development platform.',
    },
    {
      id: 3,
      title: 'JavaScript MDN Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      description: 'Comprehensive JavaScript documentation by Mozilla.',
    },
    {
      id: 4,
      title: 'Stack Overflow',
      url: 'https://stackoverflow.com/',
      description: 'Programming Q&A community for developers.',
    },
    {
      id: 5,
      title: 'GitHub',
      url: 'https://github.com/',
      description: 'Platform for hosting and collaborating on code.',
    },
  ];

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال كلمات البحث');
      return;
    }

    setIsSearching(true);
    
    try {
      // محاكاة البحث
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تصفية النتائج بناءً على الاستعلام
      const filteredResults = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults.length > 0 ? filteredResults : mockSearchResults);
      
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء البحث');
    } finally {
      setIsSearching(false);
    }
  };

  const openWebsite = (url) => {
    setWebViewUrl(url);
    setShowWebView(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
    setWebViewUrl('');
  };

  const shareSearchResult = (result) => {
    if (onSearchResult) {
      onSearchResult({
        type: 'search_result',
        title: result.title,
        url: result.url,
        description: result.description,
        query: searchQuery,
      });
      onClose();
    }
  };

  const quickSearches = [
    { query: 'React Native tutorial', icon: '⚛️' },
    { query: 'JavaScript examples', icon: '🟨' },
    { query: 'Mobile app development', icon: '📱' },
    { query: 'Programming documentation', icon: '📚' },
    { query: 'API integration', icon: '🔗' },
  ];

  if (showWebView) {
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity style={styles.backButton} onPress={closeWebView}>
              <Text style={styles.backButtonText}>← العودة</Text>
            </TouchableOpacity>
            <Text style={styles.webViewTitle} numberOfLines={1}>
              {webViewUrl}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: webViewUrl }}
            style={styles.webView}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4285f4" />
                <Text style={styles.loadingText}>جاري التحميل...</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    );
  }

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
          <Text style={styles.headerTitle}>البحث على الإنترنت</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Search Input */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن أي شيء..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={performSearch}
              />
              <TouchableOpacity
                style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                onPress={performSearch}
                disabled={isSearching}
              >
                <Text style={styles.searchButtonText}>
                  {isSearching ? '⏳' : '🔍'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>بحث سريع:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickSearchButton}
                  onPress={() => {
                    setSearchQuery(item.query);
                    performSearch();
                  }}
                >
                  <Text style={styles.quickSearchIcon}>{item.icon}</Text>
                  <Text style={styles.quickSearchText}>{item.query}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>نتائج البحث:</Text>
              {searchResults.map((result) => (
                <View key={result.id} style={styles.resultCard}>
                  <TouchableOpacity
                    style={styles.resultContent}
                    onPress={() => openWebsite(result.url)}
                  >
                    <Text style={styles.resultTitle}>{result.title}</Text>
                    <Text style={styles.resultUrl}>{result.url}</Text>
                    <Text style={styles.resultDescription}>{result.description}</Text>
                  </TouchableOpacity>
                  <View style={styles.resultActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openWebsite(result.url)}
                    >
                      <Text style={styles.actionButtonText}>🌐 فتح</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => shareSearchResult(result)}
                    >
                      <Text style={styles.actionButtonText}>📤 مشاركة</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Search State */}
          {isSearching && (
            <View style={styles.searchingContainer}>
              <ActivityIndicator size="large" color="#4285f4" />
              <Text style={styles.searchingText}>جاري البحث...</Text>
            </View>
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
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    fontSize: 16,
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#666666',
  },
  searchButtonText: {
    fontSize: 18,
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
  quickSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#404040',
  },
  quickSearchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  quickSearchText: {
    color: '#cccccc',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  resultContent: {
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 4,
  },
  resultUrl: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#cccccc',
    fontSize: 12,
  },
  searchingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  searchingText: {
    color: '#cccccc',
    fontSize: 16,
    marginTop: 12,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    color: '#4285f4',
    fontSize: 16,
  },
  webViewTitle: {
    flex: 1,
    color: '#cccccc',
    fontSize: 14,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#cccccc',
    fontSize: 16,
    marginTop: 12,
  },
});

export default WebSearchComponent;