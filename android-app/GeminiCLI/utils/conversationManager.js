import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  CONVERSATIONS: 'gemini_conversations',
  CURRENT_CONVERSATION: 'current_conversation_id',
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const createNewConversation = () => {
  return {
    id: generateId(),
    title: 'محادثة جديدة',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const saveConversations = async (conversations) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

export const loadConversations = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

export const saveCurrentConversationId = async (id) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
  } catch (error) {
    console.error('Error saving current conversation ID:', error);
  }
};

export const loadCurrentConversationId = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  } catch (error) {
    console.error('Error loading current conversation ID:', error);
    return null;
  }
};

export const updateConversationTitle = (conversations, conversationId, newTitle) => {
  return conversations.map(conv => 
    conv.id === conversationId 
      ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() }
      : conv
  );
};

export const addMessageToConversation = (conversations, conversationId, message) => {
  return conversations.map(conv => 
    conv.id === conversationId 
      ? { 
          ...conv, 
          messages: [...conv.messages, message], 
          updatedAt: new Date().toISOString() 
        }
      : conv
  );
};

export const deleteConversation = (conversations, conversationId) => {
  return conversations.filter(conv => conv.id !== conversationId);
};

export const generateConversationTitle = (firstMessage) => {
  const text = firstMessage.replace(/[^\w\s]/gi, '').trim();
  const words = text.split(' ').slice(0, 4);
  return words.length > 0 ? words.join(' ') + '...' : 'محادثة جديدة';
};