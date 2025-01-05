class ChatHistoryService {
    constructor() {
        this.storageKey = 'chat_histories';
    }

    // 获取所有聊天历史
    getAllHistories() {
        const histories = localStorage.getItem(this.storageKey);
        return histories ? JSON.parse(histories) : {};
    }

    // 获取特定AI助手的聊天历史
    getHistory(assistantId) {
        const histories = this.getAllHistories();
        return histories[assistantId] || [];
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
        const histories = this.getAllHistories();
        delete histories[assistantId];
        localStorage.setItem(this.storageKey, JSON.stringify(histories));
    }

    // 清除所有聊天历史
    clearAllHistories() {
        localStorage.removeItem(this.storageKey);
    }
}

const chatHistoryService = new ChatHistoryService();
export default chatHistoryService; 