const winston = require('winston');
const path = require('path');

// 自定义日志格式
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    // 基础日志格式
    let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
    
    // 如果有额外的元数据，以简洁的格式添加
    if (metadata.data) {
        const data = metadata.data;
        if (typeof data === 'object') {
            // 只记录关键信息
            const simplifiedData = {
                id: data.id || data._id,
                name: data.name,
                type: data.type,
                action: data.action
            };
            log += `\n  Data: ${JSON.stringify(simplifiedData)}`;
        }
    }

    // 如果有错误信息，添加错误详情
    if (metadata.error) {
        log += `\n  Error: ${metadata.error.message || metadata.error}`;
    }

    return log;
});

// 定义日志格式
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
);

// 创建日志记录器
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // 控制台输出
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        // API操作日志
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs/api.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // 错误日志
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});

// 简化的请求日志中间件
logger.requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url } = req;

    // 请求开始日志
    logger.info(`API Request: ${method} ${url}`);

    // 响应完成时的日志
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`API Response: ${method} ${url} - Status: ${res.statusCode} (${duration}ms)`);
    });

    next();
};

module.exports = logger; 