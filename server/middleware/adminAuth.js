const { ApiResponse } = require('../utils/response');
const { auth } = require('./auth');

/**
 * 管理员认证中间件
 */
exports.adminAuth = [
    auth,
    (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json(ApiResponse.error('需要管理员权限'));
        }
        next();
    }
]; 