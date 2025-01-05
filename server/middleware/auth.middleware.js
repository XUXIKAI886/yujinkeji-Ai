const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 认证中间件
 */
exports.protect = async (req, res, next) => {
    try {
        // 获取token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            logger.warn('认证失败: 未提供token');
            return res.status(401).json(ApiResponse.error('请先登录'));
        }

        try {
            // 验证token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            logger.debug('Token验证成功:', { userId: decoded.id });

            // 检查用户是否存在
            const user = await User.findById(decoded.id);
            if (!user) {
                logger.warn('认证失败: 用户不存在', { userId: decoded.id });
                return res.status(401).json(ApiResponse.error('用户不存在'));
            }

            // 检查用户状态
            if (!user.enabled) {
                logger.warn('认证失败: 用户账户已停用', { userId: user._id });
                return res.status(403).json(ApiResponse.error('账户已被停用'));
            }

            // 将用户信息添加到请求对象
            req.user = user;
            logger.debug('用户认证成功', { 
                userId: user._id,
                role: user.role,
                path: req.path
            });
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                logger.warn('认证失败: 无效的token');
                return res.status(401).json(ApiResponse.error('无效的登录状态'));
            }
            if (error.name === 'TokenExpiredError') {
                logger.warn('认证失败: token已过期');
                return res.status(401).json(ApiResponse.error('登录已过期'));
            }
            throw error;
        }
    } catch (error) {
        logger.error('认证过程发生错误:', error);
        res.status(500).json(ApiResponse.error('认证过程发生错误'));
    }
};

/**
 * 角色授权中间件
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.warn('授权失败: 权限不足', {
                userId: req.user._id,
                userRole: req.user.role,
                requiredRoles: roles,
                path: req.path
            });
            return res.status(403).json(ApiResponse.error('没有权限执行此操作'));
        }

        logger.debug('用户授权成功', {
            userId: req.user._id,
            role: req.user.role,
            path: req.path
        });
        next();
    };
};

/**
 * 检查用户积分是否足够的中间件
 * @param {number} requiredPoints - 所需积分数量
 */
exports.checkPoints = (requiredPoints) => {
    return (req, res, next) => {
        if (req.user.points < requiredPoints) {
            logger.warn(`用户 ${req.user._id} 积分不足: 当前${req.user.points}, 需要${requiredPoints}`);
            return res.status(403).json({
                success: false,
                message: '积分不足',
                currentPoints: req.user.points,
                requiredPoints: requiredPoints
            });
        }
        next();
    };
};

/**
 * 记录API访问日志的中间件
 */
exports.logAccess = (req, res, next) => {
    const startTime = Date.now();
    
    // 响应完成后记录日志
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: duration,
            userId: req.user ? req.user._id : 'anonymous',
            ip: req.ip
        };
        
        logger.info('API访问', logData);
    });
    
    next();
};

/**
 * 限制API请求频率的中间件
 * @param {number} windowMs - 时间窗口（毫秒）
 * @param {number} maxRequests - 最大请求次数
 */
exports.rateLimit = (windowMs = 60000, maxRequests = 100) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const key = req.user ? req.user._id.toString() : req.ip;
        const now = Date.now();
        
        if (!requests.has(key)) {
            requests.set(key, []);
        }
        
        const userRequests = requests.get(key);
        const validRequests = userRequests.filter(time => now - time < windowMs);
        
        if (validRequests.length >= maxRequests) {
            logger.warn(`请求频率限制: ${key}`);
            return res.status(429).json({
                success: false,
                message: '请求过于频繁，请稍后再试'
            });
        }
        
        validRequests.push(now);
        requests.set(key, validRequests);
        
        next();
    };
}; 