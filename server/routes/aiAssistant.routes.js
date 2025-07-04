const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth.middleware');
const { adminAuth } = require('../middleware/adminAuth');
const aiAssistantController = require('../controllers/aiAssistant.controller');

// 创建上传目录
const uploadDir = path.join(__dirname, '../uploads');
require('fs').mkdirSync(uploadDir, { recursive: true });

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 解码文件名
        const decodedName = Buffer.from(file.originalname, 'binary').toString('utf8');
        // 生成安全的文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(decodedName);
        const basename = path.basename(decodedName, ext);
        const safeFilename = `${basename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}-${uniqueSuffix}${ext}`;
        cb(null, safeFilename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 限制10MB
        files: 5 // 最多5个文件
    },
    fileFilter: (req, file, cb) => {
        // 解码MIME类型
        file.originalname = Buffer.from(file.originalname, 'binary').toString('utf8');
        
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    }
});

// 公共路由
router.get('/', aiAssistantController.getAllAssistants);
router.get('/active', aiAssistantController.getActiveAssistants);

// 需要认证的路由
router.post('/:key/chat', protect, aiAssistantController.chat);
router.post('/:key/analyze', protect, upload.array('files', 5), aiAssistantController.analyzeFiles);

// 管理员路由
router.post('/', adminAuth, aiAssistantController.createAssistant);
router.put('/:id', adminAuth, aiAssistantController.updateAssistant);
router.delete('/:id', adminAuth, aiAssistantController.deleteAssistant);

module.exports = router; 