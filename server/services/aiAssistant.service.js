const mongoose = require('mongoose');
const AiAssistant = require('../models/aiAssistant.model');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/error');

class AiAssistantService {
    // 生成唯一的key
    generateKey(name) {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `${nameSlug}-${timestamp}-${randomNum}`;
    }

    async createAssistant(assistantData) {
        try {
            // 生成唯一的key
            if (!assistantData.key) {
                assistantData.key = this.generateKey(assistantData.name);
            }

            // 确保 config.model 字段存在
            if (!assistantData.config || !assistantData.config.model) {
                assistantData.config = {
                    ...assistantData.config,
                    model: assistantData.modelType === 'coze' ? 'coze-bot' : 'deepseek-chat'
                };
            }

            const assistant = new AiAssistant(assistantData);
            const savedAssistant = await assistant.save();
            
            logger.info('AI助手创建成功', {
                data: {
                    id: savedAssistant._id,
                    name: savedAssistant.name,
                    type: savedAssistant.type,
                    action: 'create'
                }
            });

            return savedAssistant;
        } catch (error) {
            logger.error('创建AI助手失败', { error });
            throw new Error('创建AI助手失败: ' + error.message);
        }
    }

    async updateAssistant(id, updateData) {
        try {
            logger.info('开始更新AI助手', {
                data: {
                    id,
                    name: updateData.name,
                    type: updateData.type,
                    action: 'update'
                }
            });

            const assistant = await AiAssistant.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!assistant) {
                throw new ApiError('找不到指定的AI助手');
            }

            logger.info('AI助手更新成功', {
                data: {
                    id: assistant._id,
                    name: assistant.name,
                    type: assistant.type,
                    action: 'update'
                }
            });

            return assistant;
        } catch (error) {
            logger.error('更新AI助手失败', { error });
            throw new ApiError('更新AI助手失败: ' + error.message);
        }
    }

    async deleteAssistant(id) {
        try {
            logger.info('开始删除AI助手', {
                data: {
                    id,
                    action: 'delete'
                }
            });

            const assistant = await AiAssistant.findByIdAndDelete(id);
            if (!assistant) {
                throw new ApiError('找不到指定的AI助手');
            }

            logger.info('AI助手删除成功', {
                data: {
                    id: assistant._id,
                    name: assistant.name,
                    type: assistant.type,
                    action: 'delete'
                }
            });

            return assistant;
        } catch (error) {
            logger.error('删除AI助手失败', { error });
            throw new ApiError('删除AI助手失败: ' + error.message);
        }
    }

    async getAllAssistants(query = {}) {
        try {
            logger.info('获取AI助手列表', {
                data: {
                    action: 'list',
                    query: Object.keys(query).length ? query : 'all'
                }
            });
            
            if (query.status === 'active') {
                query = {
                    ...query,
                    isActive: true
                };
                delete query.status;
            }
            
            const assistants = await AiAssistant.find(query);
            
            logger.info('获取AI助手列表成功', {
                data: {
                    action: 'list',
                    count: assistants.length
                }
            });
            
            return assistants;
        } catch (error) {
            logger.error('获取AI助手列表失败', { error });
            throw new ApiError('获取AI助手列表失败: ' + error.message);
        }
    }

    async getAssistantById(id) {
        try {
            logger.info('获取AI助手详情:', { id });
            const assistant = await AiAssistant.findById(id);
            if (!assistant) {
                logger.warn('获取AI助手详情失败: 找不到指定的AI助手', { id });
                throw new ApiError('找不到指定的AI助手');
            }

            logger.info('获取AI助手详情成功:', {
                id: assistant._id,
                name: assistant.name,
                type: assistant.type
            });

            return assistant;
        } catch (error) {
            logger.error('获取AI助手详情失败:', {
                error: error.message,
                id
            });
            throw new ApiError('获取AI助手详情失败: ' + error.message);
        }
    }

    async getAssistantStats() {
        try {
            logger.info('开始获取AI助手统计信息');
            const stats = await AiAssistant.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                        inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
                        totalPoints: { $sum: '$pointsCost' },
                        byType: {
                            $push: {
                                type: '$type',
                                count: 1
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        active: 1,
                        inactive: 1,
                        totalPoints: 1,
                        typeStats: {
                            $reduce: {
                                input: '$byType',
                                initialValue: {},
                                in: {
                                    $mergeObjects: [
                                        '$$value',
                                        {
                                            $literal: {
                                                $concat: [
                                                    '{"',
                                                    '$$this.type',
                                                    '": ',
                                                    { $toString: '$$this.count' },
                                                    '}'
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]);

            const result = stats[0] || {
                total: 0,
                active: 0,
                inactive: 0,
                totalPoints: 0,
                typeStats: {}
            };

            logger.info('获取AI助手统计信息成功:', result);
            return result;
        } catch (error) {
            logger.error('获取AI助手统计信息失败:', {
                error: error.message
            });
            throw new ApiError('获取AI助手统计信息失败: ' + error.message);
        }
    }

    /**
     * 通过 key 获取 AI 助手
     * @param {string} key - AI 助手的 key
     * @returns {Promise<Object>} - AI 助手对象
     */
    async getAssistantByKey(key) {
        try {
            logger.info('通过 key 获取 AI 助手:', { key });
            const assistant = await AiAssistant.findOne({ key });
            
            if (!assistant) {
                logger.warn('未找到指定的 AI 助手:', { key });
                throw new ApiError('未找到指定的 AI 助手');
            }

            logger.info('获取 AI 助手成功:', {
                id: assistant._id,
                key: assistant.key,
                name: assistant.name
            });

            return assistant;
        } catch (error) {
            logger.error('获取 AI 助手失败:', {
                error: error.message,
                key
            });
            throw new ApiError('获取 AI 助手失败: ' + error.message);
        }
    }
}

module.exports = new AiAssistantService(); 