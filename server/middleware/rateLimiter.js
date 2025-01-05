const rateLimit = require('express-rate-limit');

// 创建通用限制器
const createLimiter = (options) => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15分钟
        max: 100, // 限制每个IP在windowMs内最多100个请求
        message: {
            success: false,
            message: '请求过于频繁，请稍后再试'
        },
        standardHeaders: true,
        legacyHeaders: false,
        ...options
    });
};

// 登录限制器
const loginLimiter = createLimiter({
    windowMs: 5 * 60 * 1000, // 5分钟
    max: 10, // 限制每个IP在5分钟内最多10次登录尝试
    message: {
        success: false,
        message: '登录尝试次数过多，请5分钟后再试'
    }
});

// API限制器
const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制每个IP在15分钟内最多100个API请求
});

module.exports = {
    loginLimiter,
    apiLimiter
}; 