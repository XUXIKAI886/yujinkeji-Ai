const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// 应用认证和管理员权限中间件
router.use(protect);
router.use(authorize('admin'));

// 用户管理路由
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.put('/users/:id/status', userController.updateUserStatus);
router.put('/users/:id/points', userController.updatePoints);
router.get('/users/:id/points/history', userController.getPointsHistory);

module.exports = router; 