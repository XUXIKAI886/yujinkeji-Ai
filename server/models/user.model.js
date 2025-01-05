const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, '用户名是必需的'],
        trim: true,
        minlength: [2, '用户名至少需要2个字符'],
        maxlength: [20, '用户名不能超过20个字符']
    },
    email: {
        type: String,
        required: [true, '邮箱是必需的'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, '请提供有效的邮箱地址']
    },
    password: {
        type: String,
        required: [true, '密码是必需的'],
        minlength: [8, '密码至少需要8个字符'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    points: {
        type: Number,
        default: 0,
        min: [0, '积分不能为负数']
    },
    enabled: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 更新最后登录时间
userSchema.methods.updateLastLogin = function() {
    this.lastLoginAt = new Date();
    return this.save();
};

// 移除敏感字段
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// 更新用户积分
userSchema.methods.updatePoints = async function(points, operation = 'add') {
    if (operation === 'deduct') {
        if (this.points < points) {
            throw new Error('积分不足');
        }
        this.points -= points;
    } else {
        this.points += points;
    }
    await this.save();
    return this.points;
};

module.exports = mongoose.model('User', userSchema); 