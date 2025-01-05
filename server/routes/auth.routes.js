const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { rateLimit } = require('../middleware/auth.middleware');

// 认证路由
router.post('/register', rateLimit(60000, 5), userController.register);
router.post('/login', rateLimit(60000, 5), userController.login);
router.post('/reset-password', rateLimit(60000, 5), userController.resetUserStatus);
router.get('/check/:email', rateLimit(60000, 10), userController.checkUserStatus);

module.exports = router; 