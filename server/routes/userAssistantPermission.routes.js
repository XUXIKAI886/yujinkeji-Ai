const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const userAssistantPermissionController = require('../controllers/userAssistantPermission.controller');

// 获取用户的AI助手权限列表
router.get('/users/:userId/assistant-permissions', 
    protect,
    userAssistantPermissionController.getUserAssistantPermissions
);

// 更新单个AI助手的权限
router.put('/users/:userId/assistant-permissions/:assistantId',
    protect,
    authorize('admin'),
    userAssistantPermissionController.updateUserAssistantPermission
);

// 批量更新AI助手权限
router.put('/users/:userId/assistant-permissions',
    protect,
    authorize('admin'),
    userAssistantPermissionController.batchUpdateUserAssistantPermissions
);

module.exports = router; 