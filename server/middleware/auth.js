const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../utils/response');
const User = require('../models/user.model');

/**
 * 认证中间件
 */
exports.auth = async (req, res, next) => {
    try {
        // 获取token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json(ApiResponse.error('请先登录'));
        }

        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 查找用户
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json(ApiResponse.error('用户不存在'));
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(ApiResponse.error('无效的令牌'));
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(ApiResponse.error('令牌已过期'));
        }
        res.status(401).json(ApiResponse.error('认证失败'));
    }
}; 