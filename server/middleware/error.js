const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
    // 记录错误日志
    logger.error('错误:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        user: req.user ? req.user._id : 'anonymous'
    });

    // 处理特定类型的错误
    if (err.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.error('数据验证失败：' + err.message));
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(ApiResponse.error('无效的令牌'));
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json(ApiResponse.error('令牌已过期'));
    }

    if (err.code === 11000) {
        return res.status(400).json(ApiResponse.error('数据重复'));
    }

    // 开发环境返回详细错误信息
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    // 生产环境返回简化的错误信息
    res.status(err.status || 500).json(ApiResponse.error('服务器内部错误'));
};

module.exports = {
    errorHandler
}; 