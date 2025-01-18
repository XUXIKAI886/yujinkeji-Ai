const InviteCode = require('../models/inviteCode.model');
const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * 生成邀请码
 */
exports.generateInviteCode = async (req, res) => {
    try {
        // 生成8位随机邀请码
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        
        // 创建邀请码记录
        const inviteCode = await InviteCode.create({
            code,
            createdBy: req.user._id
        });

        logger.info('邀请码生成成功:', {
            code: inviteCode.code,
            createdBy: req.user._id
        });

        res.json(ApiResponse.success('邀请码生成成功', {
            code: inviteCode.code,
            expiresAt: inviteCode.expiresAt
        }));
    } catch (error) {
        logger.error('生成邀请码失败:', error);
        res.status(500).json(ApiResponse.error('生成邀请码失败'));
    }
};

/**
 * 验证邀请码
 */
exports.verifyInviteCode = async (req, res) => {
    try {
        const { code } = req.body;
        
        // 查找邀请码
        const inviteCode = await InviteCode.findOne({ code });
        
        if (!inviteCode) {
            return res.status(400).json(ApiResponse.error('无效的邀请码'));
        }

        if (inviteCode.isUsed) {
            return res.status(400).json(ApiResponse.error('邀请码已被使用'));
        }

        if (inviteCode.expiresAt < new Date()) {
            return res.status(400).json(ApiResponse.error('邀请码已过期'));
        }

        res.json(ApiResponse.success('邀请码验证成功'));
    } catch (error) {
        logger.error('验证邀请码失败:', error);
        res.status(500).json(ApiResponse.error('验证邀请码失败'));
    }
};

/**
 * 使用邀请码
 */
exports.useInviteCode = async (code, userId) => {
    try {
        logger.info('尝试使用邀请码:', { code, userId });
        // 转换为大写进行查询
        const inviteCode = await InviteCode.findOne({ 
            code: code.toUpperCase() 
        });
        
        logger.info('查询邀请码结果:', { 
            found: !!inviteCode,
            isUsed: inviteCode?.isUsed,
            expiresAt: inviteCode?.expiresAt
        });

        if (!inviteCode || inviteCode.isUsed || inviteCode.expiresAt < new Date()) {
            return false;
        }

        inviteCode.isUsed = true;
        inviteCode.usedBy = userId;
        await inviteCode.save();

        logger.info('邀请码使用成功:', { code });
        return true;
    } catch (error) {
        logger.error('使用邀请码失败:', error);
        return false;
    }
}; 