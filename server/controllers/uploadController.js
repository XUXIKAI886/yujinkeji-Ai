const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadImage = async (req, res) => {
    try {
        console.log('Upload request received:', {
            file: req.file,
            body: req.body
        });

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的图片'
            });
        }

        // 检查文件类型
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                message: '只允许上传图片文件'
            });
        }

        // 检查文件大小
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: '图片大小不能超过5MB'
            });
        }

        // 生成唯一的文件名
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        
        // 移动文件到目标目录
        const targetPath = path.join(uploadDir, fileName);
        
        try {
            await fs.promises.rename(req.file.path, targetPath);
        } catch (error) {
            console.error('文件移动失败:', error);
            // 如果重命名失败，尝试复制然后删除
            await fs.promises.copyFile(req.file.path, targetPath);
            await fs.promises.unlink(req.file.path);
        }

        // 生成完整的访问URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const imageUrl = `${baseUrl}/uploads/images/${fileName}`;

        console.log('Upload successful:', {
            originalName: req.file.originalname,
            fileName: fileName,
            size: req.file.size,
            url: imageUrl
        });

        res.json({
            success: true,
            url: imageUrl,
            message: '图片上传成功'
        });
    } catch (error) {
        console.error('图片上传失败:', error);
        // 清理临时文件
        if (req.file && req.file.path) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('临时文件清理失败:', unlinkError);
            }
        }
        res.status(500).json({
            success: false,
            message: '图片上传失败: ' + error.message
        });
    }
};

module.exports = {
    uploadImage
}; 