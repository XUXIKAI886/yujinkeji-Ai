import axios from 'axios';

const API_URL = '/api';

const chatService = {
  // 获取AI助手列表
  getAssistants: async () => {
    try {
      const response = await axios.get(`${API_URL}/ai/assistants`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 发送消息给指定的AI助手
  sendMessage: async (assistantId, message) => {
    try {
      const response = await axios.post(`${API_URL}/ai/${assistantId}/chat`, {
        message
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 获取历史对话记录
  getChatHistory: async (assistantId) => {
    try {
      const response = await axios.get(`${API_URL}/ai/${assistantId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 创建新对话
  createNewChat: async (assistantId) => {
    try {
      const response = await axios.post(`${API_URL}/ai/${assistantId}/chat/new`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 删除对话
  deleteChat: async (chatId) => {
    try {
      const response = await axios.delete(`${API_URL}/chat/${chatId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default chatService; 