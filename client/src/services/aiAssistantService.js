import http from '../utils/http';
import EventEmitter from 'events';

const assistantEvents = new EventEmitter();

const aiAssistantService = {
    // 获取所有AI助手
    getAllAssistants: async () => {
        try {
            const response = await http.get('/assistants');
            if (response.data.success) {
                // 触发助手列表更新事件
                assistantEvents.emit('assistantsUpdated', response.data.data);
            }
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('获取AI助手列表失败:', error);
            return {
                success: false,
                message: error.response?.data?.message || '获取AI助手列表失败'
            };
        }
    },

    // 获取活跃的AI助手列表
    getActiveAssistants: async () => {
        try {
            const response = await http.get('/assistants', {
                params: { status: 'active' }
            });
            
            if (response.data.success) {
                // 触发活跃助手列表更新事件
                assistantEvents.emit('activeAssistantsUpdated', response.data.data);
                return {
                    success: true,
                    data: response.data.data
                };
            }
            
            return {
                success: false,
                message: response.data.message
            };
        } catch (error) {
            console.error('获取活跃AI助手出错:', error);
            return {
                success: false,
                message: error.message || '获取活跃AI助手列表失败'
            };
        }
    },

    // 创建AI助手
    createAssistant: async (data) => {
        try {
            const response = await http.post('/assistants', data);
            if (response.data.success) {
                // 创建成功后刷新助手列表
                await aiAssistantService.getAllAssistants();
            }
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '创建AI助手失败'
            };
        }
    },

    // 更新AI助手
    updateAssistant: async (id, data) => {
        try {
            const response = await http.put(`/assistants/${id}`, data);
            if (response.data.success) {
                // 更新成功后刷新助手列表
                await aiAssistantService.getAllAssistants();
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || '更新AI助手成功'
                };
            }
            return {
                success: false,
                message: response.data.message || '更新AI助手失败'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '更新AI助手失败'
            };
        }
    },

    // 删除AI助手
    deleteAssistant: async (id) => {
        try {
            const response = await http.delete(`/assistants/${id}`);
            if (response.data.success) {
                // 删除成功后刷新助手列表
                await aiAssistantService.getAllAssistants();
            }
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '删除AI助手失败'
            };
        }
    },

    // 获取AI助手统计信息
    getAssistantStats: async () => {
        try {
            const response = await http.get('/assistants/stats');
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '获取AI助手统计信息失败'
            };
        }
    },

    // 获取单个AI助手详情
    getAssistantById: async (id) => {
        try {
            const response = await http.get(`/assistants/${id}`);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '获取AI助手详情失败'
            };
        }
    },

    // 调用AI助手
    callAssistant: async (assistantKey, message) => {
        try {
            const response = await http.post(`/assistants/${assistantKey}/chat`, { message });
            return {
                success: true,
                data: response.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '调用AI助手失败'
            };
        }
    },

    // 订阅助手列表更新事件
    onAssistantsUpdated: (callback) => {
        assistantEvents.on('assistantsUpdated', callback);
        return () => assistantEvents.off('assistantsUpdated', callback);
    },

    // 订阅活跃助手列表更新事件
    onActiveAssistantsUpdated: (callback) => {
        assistantEvents.on('activeAssistantsUpdated', callback);
        return () => {
            assistantEvents.off('activeAssistantsUpdated', callback);
        };
    },

    /**
     * 调用AI助手分析文件
     * @param {string} assistantKey - AI助手的key
     * @param {FormData} formData - 包含文件的FormData对象
     * @returns {Promise<Object>} 分析结果
     */
    analyzeFiles: async (assistantKey, formData) => {
        try {
            const response = await http.post(`/assistants/${assistantKey}/analyze`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return {
                success: true,
                data: response.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('文件分析失败:', error);
            return {
                success: false,
                message: error.response?.data?.message || '文件分析失败'
            };
        }
    }
};

export default aiAssistantService; 