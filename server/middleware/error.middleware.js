const logger = require('../utils/logger');

/**
 * 自定义错误类
 * 用于创建具有状态码的错误对象
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 处理MongoDB重复键错误
 * @param {Error} err - 错误对象
 * @returns {Object} - 格式化的错误响应
 */
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} 已存在，请使用其他值`;
    return new AppError(message, 400);
};

/**
 * 处理MongoDB验证错误
 * @param {Error} err - 错误对象
 * @returns {Object} - 格式化的错误响应
 */
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(error => error.message);
    const message = `无效的输入数据：${errors.join('; ')}`;
    return new AppError(message, 400);
};

/**
 * 处理JWT错误
 * @param {Error} err - 错误对象
 * @returns {Object} - 格式化的错误响应
 */
const handleJWTError = () => {
    return new AppError('无效的认证令牌，请重新登录', 401);
};

/**
 * 处理JWT过期错误
 * @returns {Object} - 格式化的错误响应
 */
const handleJWTExpiredError = () => {
    return new AppError('认证令牌已过期，请重新登录', 401);
};

/**
 * 开发环境错误处理
 * 返回详细的错误信息
 */
const sendErrorDev = (err, res) => {
    logger.error('开发环境错误:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    res.status(err.statusCode).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

/**
 * 生产环境错误处理
 * 返回对用户友好的错误信息
 */
const sendErrorProd = (err, res) => {
    // 可操作的、已知的错误
    if (err.isOperational) {
        logger.warn('可操作的错误:', {
            message: err.message,
            statusCode: err.statusCode
        });

        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    // 编程错误或未知错误
    else {
        logger.error('未知错误:', {
            message: err.message,
            stack: err.stack
        });

        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // 处理特定类型的错误
        if (error.code === 11000) error = handleDuplicateKeyError(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

/**
 * 404错误处理中间件
 */
const notFound = (req, res, next) => {
    const error = new AppError(`找不到路径: ${req.originalUrl}`, 404);
    next(error);
};

module.exports = {
    AppError,
    errorHandler,
    notFound
}; 