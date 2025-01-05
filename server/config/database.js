const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * 数据库连接配置
 * 使用Mongoose连接MongoDB数据库
 * 包含连接事件处理和错误处理
 */
const connectDB = async () => {
    try {
        // 设置Mongoose选项
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME
        };

        // 连接数据库
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // 监听数据库连接错误事件
        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err}`);
        });

        // 监听数据库断开连接事件
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        // 监听数据库重新连接事件
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 