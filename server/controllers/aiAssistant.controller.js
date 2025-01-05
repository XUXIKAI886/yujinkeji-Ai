const aiAssistantService = require('../services/aiAssistant.service');
const cozeService = require('../services/cozeService');
const AIAssistant = require('../models/aiAssistant.model');
const User = require('../models/user.model');
const PointsHistory = require('../models/pointsHistory.model');
const Event = require('events');

/**
 * 获取所有AI助手
 */
exports.getAllAssistants = async (req, res) => {
    try {
        const assistants = await aiAssistantService.getAllAssistants();
        res.json({ success: true, data: assistants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 获取活跃的AI助手
 */
exports.getActiveAssistants = async (req, res) => {
    try {
        const assistants = await aiAssistantService.getAllAssistants({ status: 'active' });
        res.json({ success: true, data: assistants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 创建新的AI助手
 */
exports.createAssistant = async (req, res) => {
    try {
        const assistant = await aiAssistantService.createAssistant(req.body);
        res.status(201).json({ success: true, data: assistant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 更新AI助手
 */
exports.updateAssistant = async (req, res) => {
    try {
        const assistant = await aiAssistantService.updateAssistant(req.params.id, req.body);
        res.json({ success: true, data: assistant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 删除AI助手
 */
exports.deleteAssistant = async (req, res) => {
    try {
        await aiAssistantService.deleteAssistant(req.params.id);
        res.json({ success: true, message: '删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * AI助手对话
 */
exports.chat = async (req, res) => {
    try {
        console.log('Chat request:', {
            key: req.params.key,
            userId: req.user.id,
            message: req.body.message
        });

        const assistant = await AIAssistant.findOne({ key: req.params.key });
        if (!assistant) {
            return res.status(404).json({ success: false, message: '助手不存在' });
        }

        // 检查用户积分是否足够
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }

        if (user.points < assistant.pointsCost) {
            return res.status(400).json({ success: false, message: '积分不足' });
        }

        // 调用AI助手
        const response = await cozeService.chat(assistant.config, req.user.id, req.body.message);
        
        if (response.success) {
            // 扣除积分
            user.points -= assistant.pointsCost;
            await user.save();

            // 记录积分变动
            await PointsHistory.create({
                user: user._id,
                points: -assistant.pointsCost,
                type: 'use_assistant',
                operation: 'deduct',
                description: `使用AI助手[${assistant.name}]`,
                balance: user.points
            });

            // 触发积分更新事件
            const event = new Event('userPointsUpdate');
            event.user = user;
            process.emit('userPointsUpdate', event);
        }

        console.log('Chat response:', response);
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}; 