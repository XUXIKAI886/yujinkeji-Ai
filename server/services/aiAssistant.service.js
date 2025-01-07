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

    // 根据助手名称生成图标URL
    generateIconUrl(name) {
        // 关键词映射到图标类型
        const iconMappings = {
            '客服': 'customer-service',
            '服务': 'customer-service',
            '品牌': 'tag',
            '定位': 'tag',
            '店': 'shop',
            '商': 'shop',
            '销售': 'shop',
            '营销': 'rise',
            '推广': 'rise',
            '广告': 'rise',
            '分析': 'pie-chart',
            '数据': 'pie-chart',
            '统计': 'pie-chart',
            '创意': 'bulb',
            '设计': 'bulb',
            '创作': 'bulb',
            '团队': 'team',
            '人力': 'team',
            '招聘': 'team',
            '工具': 'tool',
            '助手': 'tool',
            '机器人': 'robot',
            'AI': 'robot',
            '智能': 'robot',
            '评论': 'comment',
            '反馈': 'comment',
            '评价': 'comment',
            '促销': 'gift',
            '活动': 'gift',
            '优惠': 'gift',
            '体验': 'heart'
        };

        // 默认图标
        let iconType = 'message';

        // 遍历名称中的关键词，找到匹配的图标
        for (const [keyword, icon] of Object.entries(iconMappings)) {
            if (name.includes(keyword)) {
                iconType = icon;
                break;
            }
        }

        // 返回图标URL
        return `https://cdn.jsdelivr.net/npm/@ant-design/icons-svg/inline-svg/${iconType}.svg`;
    }

    async createAssistant(assistantData) {
        try {
            // 生成唯一的key
            if (!assistantData.key) {
                assistantData.key = this.generateKey(assistantData.name);
            }

            // 如果没有提供图标，自动生成
            if (!assistantData.icon) {
                assistantData.icon = this.generateIconUrl(assistantData.name);
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

            // 如果更新了名称但没有提供新图标，自动生成新图标
            if (updateData.name && !updateData.icon) {
                updateData.icon = this.generateIconUrl(updateData.name);
            }

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
            
            const assistants = await AiAssistant.find(query)
                .select('name key description type pointsCost config isActive metadata stats icon')
                .sort({ 'stats.totalCalls': -1 });

            // 为没有图标的助手生成图标URL
            assistants.forEach(assistant => {
                if (!assistant.icon) {
                    assistant.icon = this.generateIconUrl(assistant.name);
                }
            });
            
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