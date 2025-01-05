require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

async function updateUserRole() {
    try {
        // 连接数据库
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('数据库连接成功');

        // 更新用户角色
        const result = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { role: 'admin' },
            { new: true }
        );

        if (result) {
            console.log('用户角色更新成功:', result);
        } else {
            console.log('未找到用户');
        }

    } catch (error) {
        console.error('更新失败:', error);
    } finally {
        await mongoose.disconnect();
        console.log('数据库连接已关闭');
    }
}

updateUserRole(); 