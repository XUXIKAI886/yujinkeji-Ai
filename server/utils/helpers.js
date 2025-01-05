const crypto = require('crypto');
const moment = require('moment');
const logger = require('./logger');

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @returns {string} - 生成的随机字符串
 */
exports.generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串
 * @returns {string} - 格式化后的日期字符串
 */
exports.formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date).format(format);
};

/**
 * 计算时间差
 * @param {Date} startDate - 开始时间
 * @param {Date} endDate - 结束时间
 * @returns {Object} - 包含时间差的对象
 */
exports.getDateDiff = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const duration = moment.duration(end.diff(start));

    return {
        years: duration.years(),
        months: duration.months(),
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds()
    };
};

/**
 * 分页助手函数
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Object} - 分页参数
 */
exports.getPaginationParams = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return {
        skip,
        limit: parseInt(limit),
        page: parseInt(page)
    };
};

/**
 * 构建分页响应
 * @param {Array} data - 数据数组
 * @param {number} total - 总数
 * @param {number} page - 当前页码
 * @param {number} limit - 每页数量
 * @returns {Object} - 分页响应对象
 */
exports.buildPaginationResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};

/**
 * 清理对象中的空值
 * @param {Object} obj - 输入对象
 * @returns {Object} - 清理后的对象
 */
exports.cleanObject = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            cleaned[key] = obj[key];
        }
    });
    return cleaned;
};

/**
 * 安全的JSON解析
 * @param {string} str - JSON字符串
 * @param {*} defaultValue - 解析失败时的默认值
 * @returns {*} - 解析结果
 */
exports.safeJSONParse = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        logger.error(`JSON解析失败: ${error.message}`);
        return defaultValue;
    }
};

/**
 * 延迟执行
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} - Promise对象
 */
exports.delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 重试函数
 * @param {Function} fn - 要重试的函数
 * @param {number} maxAttempts - 最大尝试次数
 * @param {number} delay - 重试延迟（毫秒）
 * @param {Function} shouldRetry - 判断是否应该重试的函数
 * @returns {Promise} - Promise对象
 */
exports.retry = async (fn, maxAttempts = 3, delay = 1000, shouldRetry = null) => {
    let lastError;
    
    logger.info('开始重试操作', {
        maxAttempts,
        delay
    });
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            logger.debug('执行重试尝试', {
                attempt,
                maxAttempts
            });
            const result = await fn();
            logger.info('尝试成功', {
                attempt
            });
            return result;
        } catch (error) {
            lastError = error;
            logger.warn('尝试失败', {
                attempt,
                maxAttempts,
                error: error.message,
                stack: error.stack
            });
            
            // 如果提供了shouldRetry函数，使用它来判断是否应该重试
            if (shouldRetry && !shouldRetry(error)) {
                logger.info('根据shouldRetry判断不再重试');
                throw error;
            }
            
            if (attempt < maxAttempts) {
                const nextDelay = delay * Math.pow(2, attempt - 1); // 指数退避
                logger.info('等待后进行下一次尝试', {
                    nextDelay
                });
                await exports.delay(nextDelay);
            } else {
                logger.error('所有重试尝试都失败', {
                    totalAttempts: maxAttempts,
                    finalError: error.message,
                    stack: error.stack
                });
            }
        }
    }
    
    throw lastError;
};

/**
 * 生成唯一ID
 * @param {string} prefix - ID前缀
 * @returns {string} - 唯一ID
 */
exports.generateUniqueId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${prefix}${timestamp}${randomStr}`;
};

/**
 * 检查字符串是否是有效的MongoDB ObjectId
 * @param {string} id - 要检查的ID
 * @returns {boolean} - 是否有效
 */
exports.isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * 计算字符串的MD5哈希
 * @param {string} str - 输入字符串
 * @returns {string} - MD5哈希值
 */
exports.md5 = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}; 