import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const ConversationsList = ({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation,
  onClose 
}) => {
  const handleDeleteConversation = (conversationId, conversationTitle) => {
    Alert.alert(
      'حذف المحادثة',
      `هل أنت متأكد من حذف "${conversationTitle}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive', 
          onPress: () => onDeleteConversation(conversationId) 
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'اليوم';
    if (diffDays === 2) return 'أمس';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المحادثات</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.newConversationButton} onPress={onNewConversation}>
        <Text style={styles.newConversationText}>+ محادثة جديدة</Text>
      </TouchableOpacity>

      <ScrollView style={styles.conversationsList}>
        {conversations.map((conversation) => (
          <View key={conversation.id} style={styles.conversationItemContainer}>
            <TouchableOpacity
              style={[
                styles.conversationItem,
                conversation.id === currentConversationId && styles.activeConversation,
              ]}
              onPress={() => onSelectConversation(conversation.id)}
            >
              <View style={styles.conversationContent}>
                <Text style={styles.conversationTitle} numberOfLines={1}>
                  {conversation.title}
                </Text>
                <Text style={styles.conversationDate}>
                  {formatDate(conversation.updatedAt)}
                </Text>
                <Text style={styles.conversationPreview} numberOfLines={2}>
                  {conversation.messages.length > 0 
                    ? conversation.messages[conversation.messages.length - 1].text.substring(0, 100)
                    : 'محادثة جديدة'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteConversation(conversation.id, conversation.title)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
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
  newConversationButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#4285f4',
    borderRadius: 12,
    alignItems: 'center',
  },
  newConversationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationsList: {
    flex: 1,
    padding: 16,
  },
  conversationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conversationItem: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  activeConversation: {
    backgroundColor: '#3d3d3d',
    borderColor: '#4285f4',
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  conversationDate: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  conversationPreview: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default ConversationsList;