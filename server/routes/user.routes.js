const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

/**
 * 需要认证的路由
 */
router.use(protect); // 应用认证中间件

// 用户个人路由
router.get('/me', userController.getMe);
router.get('/:id/points/history', userController.getPointsHistory);

/**
 * 管理员路由
 */
router.use(authorize('admin')); // 应用管理员权限中间件

// 用户管理路由
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.put('/:id/status', userController.updateUserStatus);
router.put('/:id/points', userController.updatePoints);

module.exports = router; 