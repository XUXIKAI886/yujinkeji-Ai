const UserAssistantPermission = require('../models/userAssistantPermission.model');
const AIAssistant = require('../models/aiAssistant.model');
const User = require('../models/user.model');
const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 获取用户的AI助手权限列表
 */
exports.getUserAssistantPermissions = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // 检查权限：只允许用户查看自己的权限，或者管理员可以查看所有用户的权限
        if (userId !== req.user.id && req.user.role !== 'admin') {
            logger.warn('获取AI助手权限失败: 权限不足', {
                requestUserId: req.user.id,
                targetUserId: userId
            });
            return res.status(403).json(ApiResponse.error('权限不足'));
        }

        // 获取所有AI助手
        const allAssistants = await AIAssistant.find();
        
        // 获取用户的权限配置
        const permissions = await UserAssistantPermission.find({ user: userId })
            .populate('assistant', 'name type description pointsCost');

        // 合并结果，确保每个AI助手都有权限记录
        const result = allAssistants.map(assistant => {
            const permission = permissions.find(p => p.assistant?._id.toString() === assistant._id.toString());
            return {
                assistant: {
                    id: assistant._id,
                    name: assistant.name,
                    type: assistant.type,
                    description: assistant.description,
                    defaultPointsCost: assistant.pointsCost
                },
                permission: permission ? {
                    id: permission.id,
                    isEnabled: permission.isEnabled,
                    customPointsCost: permission.customPointsCost,
                    lastUsed: permission.lastUsed,
                    usageCount: permission.usageCount
                } : {
                    isEnabled: true,
                    customPointsCost: null,
                    lastUsed: null,
                    usageCount: 0
                }
            };
        });

        res.json(ApiResponse.success('获取AI助手权限列表成功', result));
    } catch (error) {
        logger.error('获取AI助手权限列表失败:', error);
        res.status(500).json(ApiResponse.error('获取AI助手权限列表失败'));
    }
};

/**
 * 更新用户的AI助手权限
 */
exports.updateUserAssistantPermission = async (req, res) => {
    try {
        const { userId, assistantId } = req.params;
        const { isEnabled, customPointsCost } = req.body;

        // 检查权限
        if (req.user.role !== 'admin') {
            logger.warn('更新AI助手权限失败: 权限不足', {
                requestUserId: req.user.id,
                targetUserId: userId
            });
            return res.status(403).json(ApiResponse.error('权限不足'));
        }

        // 检查用户和AI助手是否存在
        const [user, assistant] = await Promise.all([
            User.findById(userId),
            AIAssistant.findById(assistantId)
        ]);

        if (!user || !assistant) {
            return res.status(404).json(ApiResponse.error('用户或AI助手不存在'));
        }

        // 更新或创建权限记录
        const permission = await UserAssistantPermission.findOneAndUpdate(
            { user: userId, assistant: assistantId },
            {
                isEnabled,
                customPointsCost,
                $setOnInsert: {
                    user: userId,
                    assistant: assistantId
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        logger.info('AI助手权限更新成功', {
            userId,
            assistantId,
            isEnabled,
            customPointsCost
        });

        res.json(ApiResponse.success('更新AI助手权限成功', permission));
    } catch (error) {
        logger.error('更新AI助手权限失败:', error);
        res.status(500).json(ApiResponse.error('更新AI助手权限失败'));
    }
};

/**
 * 批量更新用户的AI助手权限
 */
exports.batchUpdateUserAssistantPermissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { permissions } = req.body;

        // 检查权限
        if (req.user.role !== 'admin') {
            logger.warn('批量更新AI助手权限失败: 权限不足', {
                requestUserId: req.user.id,
                targetUserId: userId
            });
            return res.status(403).json(ApiResponse.error('权限不足'));
        }

        // 检查用户是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(ApiResponse.error('用户不存在'));
        }

        // 批量更新权限
        const updateOperations = permissions.map(async ({ assistantId, isEnabled, customPointsCost }) => {
            return UserAssistantPermission.findOneAndUpdate(
                { user: userId, assistant: assistantId },
                {
                    isEnabled,
                    customPointsCost,
                    $setOnInsert: {
                        user: userId,
                        assistant: assistantId
                    }
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            );
        });

        const results = await Promise.all(updateOperations);

        logger.info('批量更新AI助手权限成功', {
            userId,
            updatedCount: results.length
        });

        res.json(ApiResponse.success('批量更新AI助手权限成功', results));
    } catch (error) {
        logger.error('批量更新AI助手权限失败:', error);
        res.status(500).json(ApiResponse.error('批量更新AI助手权限失败'));
    }
}; 