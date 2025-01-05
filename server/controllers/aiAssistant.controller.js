const aiAssistantService = require('../services/aiAssistant.service');
const cozeService = require('../services/cozeService');
const deepseekService = require('../services/deepseekService');
const AIAssistant = require('../models/aiAssistant.model');
const User = require('../models/user.model');
const PointsHistory = require('../models/pointsHistory.model');
const Event = require('events');
const fs = require('fs').promises;
const path = require('path');

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

        // 根据modelType选择对应的服务
        let response;
        if (assistant.config.modelType === 'coze') {
            response = await cozeService.chat(assistant.config, req.user.id, req.body.message);
        } else if (assistant.config.modelType === 'deepseek') {
            response = await deepseekService.chat(assistant.config, req.body.message, assistant.config.systemPrompt);
        } else {
            return res.status(400).json({ success: false, message: '不支持的模型类型' });
        }
        
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

/**
 * 分析上传的文件
 */
exports.analyzeFiles = async (req, res) => {
    const files = [];
    try {
        console.log('文件分析请求:', {
            key: req.params.key,
            userId: req.user.id,
            files: req.files?.map(f => ({ name: f.originalname, size: f.size }))
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

        // 每个文件额外消耗5积分
        const totalPointsCost = assistant.pointsCost + (req.files?.length * 5 || 0);
        if (user.points < totalPointsCost) {
            return res.status(400).json({ success: false, message: '积分不足' });
        }

        // 读取文件内容
        const fileContents = await Promise.all(req.files.map(async (file) => {
            try {
                // 使用绝对路径
                const content = await fs.readFile(file.path, 'utf-8');
                files.push(file.path); // 记录文件路径以便后续清理
                return {
                    name: file.originalname,
                    content: content,
                    type: file.mimetype
                };
            } catch (error) {
                console.error(`读取文件 ${file.originalname} 失败:`, error);
                throw new Error(`读取文件 ${file.originalname} 失败: ${error.message}`);
            }
        }));

        // 构建系统消息
        const systemMessage = `你是一个专业的数据分析师，需要分析以下文件的内容：\n${
            fileContents.map(f => `- ${f.name} (${f.type})`).join('\n')
        }\n\n请提供详细的分析报告，包括：\n1. 数据概览\n2. 关键发现\n3. 趋势分析\n4. 建议和策略`;

        // 构建用户消息
        const userMessage = fileContents.map(f => 
            `文件：${f.name}\n内容：${f.content}\n---\n`
        ).join('\n');

        // 调用AI服务
        let response;
        if (assistant.config.modelType === 'deepseek') {
            response = await deepseekService.chat(assistant.config, userMessage, systemMessage);
        } else {
            return res.status(400).json({ success: false, message: '当前助手不支持文件分析' });
        }
        
        if (response.success) {
            // 扣除积分
            user.points -= totalPointsCost;
            await user.save();

            // 记录积分变动
            await PointsHistory.create({
                user: user._id,
                points: -totalPointsCost,
                type: 'analyze_files',
                operation: 'deduct',
                description: `使用AI助手[${assistant.name}]分析${req.files.length}个文件`,
                balance: user.points
            });

            // 清理临时文件
            await Promise.all(files.map(filePath => 
                fs.unlink(filePath).catch(error => {
                    console.error(`删除文件 ${filePath} 失败:`, error);
                })
            ));

            // 触发积分更新事件
            const event = new Event('userPointsUpdate');
            event.user = user;
            process.emit('userPointsUpdate', event);
        }

        console.log('文件分析响应:', response);
        res.json(response);
    } catch (error) {
        // 发生错误时也要清理文件
        await Promise.all(files.map(filePath => 
            fs.unlink(filePath).catch(console.error)
        ));

        console.error('文件分析错误:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}; 