const User = require('../models/user.model');
const PointsHistory = require('../models/pointsHistory.model');
const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../utils/validators');

// 密码强度验证函数
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
        errors.push('密码长度至少为8个字符');
    }
    if (!hasUpperCase) {
        errors.push('密码必须包含大写字母');
    }
    if (!hasLowerCase) {
        errors.push('密码必须包含小写字母');
    }
    if (!hasNumbers) {
        errors.push('密码必须包含数字');
    }
    if (!hasSpecialChar) {
        errors.push('密码必须包含特殊字符');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * 用户注册
 */
exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // 验证邮箱格式
        if (!validateEmail(email)) {
            return res.status(400).json(ApiResponse.error('邮箱格式不正确'));
        }

        // 验证密码强度
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json(ApiResponse.error('密码不符合要求', {
                errors: passwordValidation.errors
            }));
        }

        // 检查邮箱是否已存在
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(ApiResponse.error('该邮箱已被注册'));
        }

        // 检查是否是管理员邮箱
        const isAdmin = email === process.env.ADMIN_EMAIL;

        // 创建用户
        const user = await User.create({
            email,
            password, // 密码会在model层通过中间件自动加密
            username,
            role: isAdmin ? 'admin' : 'user',
            points: 30, // 新用户赠送30积分
            enabled: true
        });

        // 生成JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // 记录积分历史
        await PointsHistory.create({
            user: user._id,
            points: 30,
            type: 'register',
            operation: 'add',
            description: '新用户注册奖励',
            balance: 30
        });

        // 返回用户信息和token
        res.status(201).json(ApiResponse.success('注册成功', {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                points: user.points,
                enabled: user.enabled
            },
            token
        }));
    } catch (error) {
        logger.error('用户注册失败:', error);
        res.status(500).json(ApiResponse.error('注册失败，请稍后重试'));
    }
};

/**
 * 用户登录
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info('用户尝试登录:', { email });

        // 查找用户
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            logger.warn('登录失败: 用户不存在', { email });
            return res.status(401).json(ApiResponse.error('邮箱或密码错误'));
        }

        // 检查用户状态
        if (!user.enabled) {
            logger.warn('登录失败: 账号已被禁用', { email });
            return res.status(403).json(ApiResponse.error('账号已被禁用'));
        }

        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn('登录失败: 密码错误', { email });
            return res.status(401).json(ApiResponse.error('邮箱或密码错误'));
        }

        // 生成JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        logger.info('用户登录成功', {
            userId: user._id,
            email: user.email,
            role: user.role
        });

        // 返回用户信息和token
        res.json(ApiResponse.success('登录成功', {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                points: user.points,
                enabled: user.enabled
            },
            token
        }));
    } catch (error) {
        logger.error('登录过程发生错误:', error);
        res.status(500).json(ApiResponse.error('登录失败，请稍后重试'));
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json(ApiResponse.error('用户不存在'));
        }
        res.json(ApiResponse.success('获取用户信息成功', user.toJSON()));
    } catch (error) {
        logger.error('获取用户信息失败:', error);
        res.status(500).json(ApiResponse.error('获取用户信息失败，请稍后重试'));
    }
};

/**
 * 获取所有用户
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取用户列表失败'
        });
    }
};

/**
 * 添加用户积分
 * @route POST /api/users/:id/points
 * @access Private Admin
 */
exports.addPoints = async (req, res) => {
    try {
        const { points, reason } = req.body;
        const user = await User.findById(req.params.id);

        logger.info('开始添加用户积分:', {
            userId: req.params.id,
            points,
            reason,
            operatorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        if (!user) {
            logger.warn('添加积分失败: 用户不存在', {
                userId: req.params.id,
                points,
                reason,
                operatorId: req.user.id
            });
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        const oldPoints = user.points;
        user.points += points;
        await user.save();

        // 记录积分变动
        await PointsHistory.create({
            user: user._id,
            points: points,
            type: 'admin_grant',
            operation: 'add',
            description: reason || '管理员调整积分',
            balance: user.points
        });

        logger.info('积分添加成功:', {
            userId: user._id,
            oldPoints,
            newPoints: user.points,
            addedPoints: points,
            reason,
            operatorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: '积分添加成功',
            data: {
                userId: user._id,
                points: user.points,
                added: points,
                reason
            }
        });
    } catch (error) {
        logger.error('添加积分失败:', {
            error: error.message,
            userId: req.params.id,
            points: req.body.points,
            reason: req.body.reason,
            operatorId: req.user.id,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: '添加积分失败'
        });
    }
};

/**
 * 扣除用户积分
 * @route POST /api/users/:id/points/deduct
 * @access Private Admin
 */
exports.deductPoints = async (req, res) => {
    try {
        const { points, reason } = req.body;
        const user = await User.findById(req.params.id);

        logger.info('开始扣除用户积分:', {
            userId: req.params.id,
            points,
            reason,
            operatorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        if (!user) {
            logger.warn('扣除积分失败: 用户不存在', {
                userId: req.params.id,
                points,
                reason,
                operatorId: req.user.id
            });
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        if (user.points < points) {
            logger.warn('扣除积分失败: 用户积分不足', {
                userId: user._id,
                currentPoints: user.points,
                deductPoints: points,
                reason,
                operatorId: req.user.id
            });
            return res.status(400).json({
                success: false,
                message: '用户积分不足'
            });
        }

        const oldPoints = user.points;
        user.points -= points;
        await user.save();

        // 记录积分变动
        await PointsHistory.create({
            user: user._id,
            points: -points,
            type: 'admin_grant',
            operation: 'deduct',
            description: reason || '管理员扣除积分',
            balance: user.points
        });

        logger.info('积分扣除成功:', {
            userId: user._id,
            oldPoints,
            newPoints: user.points,
            deductedPoints: points,
            reason,
            operatorId: req.user.id,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: '积分扣除成功',
            data: {
                userId: user._id,
                points: user.points,
                deducted: points,
                reason
            }
        });
    } catch (error) {
        logger.error('扣除积分失败:', {
            error: error.message,
            userId: req.params.id,
            points: req.body.points,
            reason: req.body.reason,
            operatorId: req.user.id,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: '扣除积分失败'
        });
    }
};

/**
 * 获取积分历史
 */
exports.getPointsHistory = async (req, res) => {
    try {
        const userId = req.params.id;

        // 检查权限：只允许用户查看自己的积分历史，或者管理员可以查看所有用户的积分历史
        if (userId !== req.user.id && req.user.role !== 'admin') {
            logger.warn('获取积分历史失败: 权限不足', {
                requestUserId: req.user.id,
                targetUserId: userId
            });
            return res.status(403).json(ApiResponse.error('权限不足'));
        }

        logger.info('开始获取积分历史:', {
            userId,
            requestUserId: req.user.id
        });

        // 查询积分历史记录
        const history = await PointsHistory.find({ user: userId })
            .sort({ createdAt: -1 }) // 按时间倒序
            .lean();

        // 打印查询结果
        logger.info('积分历史查询结果:', {
            userId,
            recordCount: history.length,
            records: history.slice(0, 2)  // 只打印前两条记录用于调试
        });

        return res.json(ApiResponse.success('获取积分历史成功', history));
    } catch (error) {
        logger.error('获取积分历史失败:', {
            error: error.message,
            userId: req.params.id,
            requestUserId: req.user.id,
            stack: error.stack
        });
        return res.status(500).json(ApiResponse.error('获取积分历史失败'));
    }
};

/**
 * 创建用户
 */
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, points = 0, enabled = true } = req.body;

        // 验证邮箱
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: '邮箱格式不正确'
            });
        }

        // 检查邮箱是否已存在
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '该邮箱已被注册'
            });
        }

        // 创建用户
        const user = await User.create({
            username,
            email,
            password,
            points,
            enabled
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                points: user.points,
                enabled: user.enabled
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建用户失败'
        });
    }
};

/**
 * 更新用户信息
 */
exports.updateUser = async (req, res) => {
    try {
        const { username, email, points, enabled } = req.body;
        const userId = req.params.id;

        // 检查用户是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 如果更新邮箱，检查新邮箱是否已被使用
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: '该邮箱已被使用'
                });
            }
        }

        // 更新用户信息
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                points,
                enabled
            },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新用户信息失败'
        });
    }
};

/**
 * 更新用户状态
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const { enabled } = req.body;
        const userId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { enabled },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新用户状态失败'
        });
    }
};

/**
 * 更新用户积分
 */
exports.updatePoints = async (req, res) => {
    try {
        const { points } = req.body;
        const userId = req.params.id;

        logger.info('尝试更新用户积分:', {
            userId,
            newPoints: points,
            adminId: req.user.id
        });

        // 验证积分值
        if (typeof points !== 'number' || points < 0) {
            logger.warn('积分更新失败: 无效的积分值', {
                userId,
                points,
                adminId: req.user.id
            });
            return res.status(400).json({
                success: false,
                message: '无效的积分值'
            });
        }

        // 查找用户
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('积分更新失败: 用户不存在', {
                userId,
                adminId: req.user.id
            });
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 计算积分变化
        const pointsDiff = points - user.points;
        const operation = pointsDiff >= 0 ? 'add' : 'deduct';
        const oldPoints = user.points;

        // 更新用户积分
        user.points = points;
        await user.save();

        // 记录积分变更历史
        await PointsHistory.create({
            user: userId,
            points: pointsDiff,
            type: 'admin_grant',
            operation: pointsDiff >= 0 ? 'add' : 'deduct',
            description: `管理员调整积分: ${pointsDiff >= 0 ? '增加' : '减少'} ${Math.abs(pointsDiff)} 积分`,
            balance: points
        });

        logger.info('积分更新成功', {
            userId,
            oldPoints,
            newPoints: points,
            pointsDiff,
            adminId: req.user.id
        });

        return res.json(ApiResponse.success('积分更新成功', {
            points: user.points,
            oldPoints,
            newPoints: points,
            pointsDiff
        }));
    } catch (error) {
        logger.error('积分更新过程发生错误:', {
            error,
            userId: req.params.id,
            points: req.body.points,
            adminId: req.user.id
        });
        res.status(500).json({
            success: false,
            message: '更新积分失败'
        });
    }
};

/**
 * 重置用户状态
 */
exports.resetUserStatus = async (req, res) => {
    try {
        const { email } = req.body;
        logger.info('尝试重置用户状态:', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('重置失败: 用户不存在', { email });
            return res.status(404).json(ApiResponse.error('用户不存在'));
        }

        // 更新用户状态
        user.enabled = true;
        user.role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
        await user.save();

        logger.info('用户状态重置成功', {
            userId: user._id,
            email: user.email,
            role: user.role,
            enabled: user.enabled
        });

        res.json(ApiResponse.success('用户状态重置成功', {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            enabled: user.enabled
        }));
    } catch (error) {
        logger.error('重置用户状态失败:', error);
        res.status(500).json(ApiResponse.error('重置用户状态失败'));
    }
};

/**
 * 检查用户状态
 */
exports.checkUserStatus = async (req, res) => {
    try {
        const { email } = req.params;
        logger.info('检查用户状态:', { email });

        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            logger.warn('用户不存在:', { email });
            return res.status(404).json(ApiResponse.error('用户不存在'));
        }

        logger.info('用户状态:', {
            userId: user._id,
            email: user.email,
            role: user.role,
            enabled: user.enabled
        });

        res.json(ApiResponse.success('获取用户状态成功', {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            enabled: user.enabled,
            points: user.points
        }));
    } catch (error) {
        logger.error('检查用户状态失败:', error);
        res.status(500).json(ApiResponse.error('检查用户状态失败'));
    }
}; 