class ChatHistoryService {
    constructor() {
        this.storageKey = 'chat_histories';
    }

    // 获取所有聊天历史
    getAllHistories() {
        try {
            const histories = localStorage.getItem(this.storageKey);
            return histories ? JSON.parse(histories) : {};
        } catch (error) {
            console.error('Error getting chat histories:', error);
            return {};
        }
    }

    // 获取特定AI助手的聊天历史
    getHistory(assistantId) {
        if (!assistantId) return [];
        
        try {
            const histories = this.getAllHistories();
            return histories[assistantId] || [];
        } catch (error) {
            console.error(`Error getting chat history for assistant ${assistantId}:`, error);
            return [];
        }
    }

    // 保存特定AI助手的完整聊天历史
    saveHistory(assistantId, messages) {
        if (!assistantId) return;
        
        try {
            const histories = this.getAllHistories();
            histories[assistantId] = messages || [];
            localStorage.setItem(this.storageKey, JSON.stringify(histories));
            console.log(`Saved chat history for assistant ${assistantId}:`, messages);
        } catch (error) {
            console.error(`Error saving chat history for assistant ${assistantId}:`, error);
        }
    }

    // 添加新消息到历史记录
    addMessage(assistantId, message) {
        const histories = this.getAllHistories();
        if (!histories[assistantId]) {
            histories[assistantId] = [];
        }
        histories[assistantId].push(message);
        localStorage.setItem(this.storageKey, JSON.stringify(histories));
    }

    // 清除特定AI助手的聊天历史
    clearHistory(assistantId) {
        if (!assistantId) return;
        
        try {
            const histories = this.getAllHistories();
            delete histories[assistantId];
            localStorage.setItem(this.storageKey, JSON.stringify(histories));
            console.log(`Cleared chat history for assistant ${assistantId}`);
        } catch (error) {
            console.error(`Error clearing chat history for assistant ${assistantId}:`, error);
        }
    }

    // 清除所有聊天历史
    clearAllHistories() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Cleared all chat histories');
        } catch (error) {
            console.error('Error clearing all chat histories:', error);
        }
    }
}

const chatHistoryService = new ChatHistoryService();
export default chatHistoryService; 