const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { adminAuth } = require('../middleware/adminAuth');
const aiAssistantController = require('../controllers/aiAssistant.controller');

// 公共路由
router.get('/', aiAssistantController.getAllAssistants);
router.get('/active', aiAssistantController.getActiveAssistants);

// 需要认证的路由
router.post('/:key/chat', protect, aiAssistantController.chat);

// 管理员路由
router.post('/', adminAuth, aiAssistantController.createAssistant);
router.put('/:id', adminAuth, aiAssistantController.updateAssistant);
router.delete('/:id', adminAuth, aiAssistantController.deleteAssistant);

module.exports = router; 