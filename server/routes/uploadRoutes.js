const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadImage } = require('../controllers/uploadController');

// 配置 multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(__dirname, '../uploads/temp');
        // 确保目录存在
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // 使用原始文件名，但确保文件名安全
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, Date.now() + '-' + safeName);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('只允许上传图片文件!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制5MB
    }
}).single('image');

// 图片上传路由
router.post('/image', (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // Multer 错误
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: '图片大小不能超过5MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: '文件上传错误: ' + err.message
            });
        } else if (err) {
            // 其他错误
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        // 一切正常，继续处理
        uploadImage(req, res, next);
    });
});

module.exports = router; 