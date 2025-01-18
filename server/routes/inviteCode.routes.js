const express = require('express');
const router = express.Router();
const inviteCodeController = require('../controllers/inviteCode.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// 生成邀请码 (仅管理员)
router.post('/generate', protect, authorize('admin'), inviteCodeController.generateInviteCode);

// 验证邀请码
router.post('/verify', inviteCodeController.verifyInviteCode);

module.exports = router; 