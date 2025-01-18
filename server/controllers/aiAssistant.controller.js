const aiAssistantService = require('../services/aiAssistant.service');
const cozeService = require('../services/cozeService');
const deepseekService = require('../services/deepseekService');
const AIAssistant = require('../models/aiAssistant.model');
const User = require('../models/user.model');
const PointsHistory = require('../models/pointsHistory.model');
const Event = require('events');
const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');

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
        const assistantData = {
            ...req.body,
            icon: req.body.icon || null,
            metadata: {
                ...req.body.metadata,
                creator: req.user._id
            }
        };

        const assistant = await aiAssistantService.createAssistant(assistantData);
        
        res.status(201).json({
            success: true,
            data: assistant,
            message: 'AI助手创建成功'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error: error.code === 11000 ? '该名称已被使用，请使用其他名称' : error.message
        });
    }
};

/**
 * 更新AI助手
 */
exports.updateAssistant = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            icon: req.body.icon || null
        };

        const assistant = await aiAssistantService.updateAssistant(id, updateData);
        
        res.json({
            success: true,
            data: assistant,
            message: 'AI助手更新成功'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error: error.code === 11000 ? '该名称已被使用，请使用其他名称' : error.message
        });
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
            // 只使用配置中的专属提示词
            const systemPrompt = assistant.config.systemPrompt || '';
            response = await deepseekService.chat(assistant.config, req.body.message, systemPrompt);
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
 * 读取文件内容
 * @param {Object} file - 上传的文件对象
 * @returns {Promise<string>} - 文件内容
 */
async function readFileContent(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Excel文件处理
    if (['.xlsx', '.xls'].includes(ext)) {
        const workbook = XLSX.readFile(file.path);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        return data.map(row => row.join('\t')).join('\n');
    }
    
    // 文本文件处理
    if (['.txt', '.csv'].includes(ext)) {
        return await fs.readFile(file.path, 'utf8');
    }
    
    // 其他类型文件，返回文件类型信息
    return `[${file.mimetype}文件，大小：${(file.size / 1024).toFixed(2)}KB]`;
}

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

        // 移除每个文件额外消耗5积分的设定，只使用基础积分
        const totalPointsCost = assistant.pointsCost;
        if (user.points < totalPointsCost) {
            return res.status(400).json({ success: false, message: '积分不足' });
        }

        // 读取文件内容
        const fileContents = await Promise.all(req.files.map(async (file) => {
            try {
                // 解码文件名
                const decodedName = Buffer.from(file.originalname, 'binary').toString('utf8');
                files.push(file.path); // 记录文件路径以便后续清理
                
                // 读取文件内容
                const content = await readFileContent(file);
                
                return {
                    name: decodedName,
                    content: content,
                    type: file.mimetype
                };
            } catch (error) {
                console.error(`读取文件 ${file.originalname} 失败:`, error);
                throw new Error(`读取文件 ${file.originalname} 失败: ${error.message}`);
            }
        }));

        // 构建系统消息，只使用助手配置中的专属提示词
        const systemMessage = assistant.config.systemPrompt || '';

        // 构建用户消息，只包含文件信息
        const userMessage = fileContents.map(f => 
            `文件：${f.name}\n数据内容：\n${f.content}`
        ).join('\n\n');

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