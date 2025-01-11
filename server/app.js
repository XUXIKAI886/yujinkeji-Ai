const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
const envPath = path.resolve(process.cwd(), 'server/.env');
dotenv.config({ path: envPath });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { errorHandler } = require('./middleware/error');
const logger = require('./utils/logger');

// 导入路由
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const aiAssistantRoutes = require('./routes/aiAssistant.routes');
const userAssistantPermissionRoutes = require('./routes/userAssistantPermission.routes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根路径处理
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '欢迎访问域锦科技 API 服务',
        version: process.env.API_VERSION || '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            assistants: '/api/assistants',
            upload: '/api/upload'
        },
        documentation: '访问 /api 路径获取更多API信息'
    });
});

// API信息路径
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API 接口信息',
        version: process.env.API_VERSION || '1.0.0',
        endpoints: {
            auth: {
                login: '/api/auth/login',
                register: '/api/auth/register',
                resetPassword: '/api/auth/reset-password'
            },
            users: {
                me: '/api/users/me',
                list: '/api/users',
                points: '/api/users/:id/points',
                delete: '/api/users/:id'
            },
            assistants: {
                list: '/api/assistants',
                active: '/api/assistants/active',
                chat: '/api/assistants/:key/chat',
                analyze: '/api/assistants/:key/analyze'
            },
            upload: {
                image: '/api/upload/image'
            }
        }
    });
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assistants', aiAssistantRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', userAssistantPermissionRoutes);

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `找不到路径: ${req.originalUrl}`
    });
});

// 错误处理
app.use(errorHandler);

// 错误处理中间件
app.use((error, req, res, next) => {
    logger.error('应用错误:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        user: req.user?.id
    });

    res.status(error.status || 500).json({
        success: false,
        message: error.message || '服务器内部错误',
        code: error.code
    });
});

// 连接数据库
mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 超时时间
    retryWrites: true,
    w: 'majority'
})
.then(() => {
    logger.info('数据库连接成功');
    logger.info(`MongoDB Connected: ${process.env.MONGODB_URI.split('@')[1]}`);

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`服务器已启动，监听端口 ${PORT}`);
        logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`API版本: ${process.env.API_VERSION}`);
    });
})
.catch(err => {
    logger.error('数据库连接失败:', err);
    process.exit(1);
});

module.exports = app; 