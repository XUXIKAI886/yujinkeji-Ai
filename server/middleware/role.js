const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 检查用户角色的中间件
 * @param {string[]} roles - 允许的角色列表
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json(ApiResponse.error('请先登录'));
            }

            if (!roles.includes(req.user.role)) {
                logger.warn('角色权限不足:', {
                    userId: req.user._id,
                    userRole: req.user.role,
                    requiredRoles: roles
                });
                return res.status(403).json(ApiResponse.error('权限不足'));
            }

            next();
        } catch (error) {
            logger.error('角色检查中间件错误:', error);
            res.status(500).json(ApiResponse.error('服务器错误'));
        }
    };
};

module.exports = {
    checkRole
}; 