const stats = require('../utils/stats');
const response = require('../utils/response');
const logger = require('../utils/logger');
const { formatDateTime } = require('../utils/helpers');

/**
 * 获取系统仪表盘数据
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const systemStats = await stats.getSystemStats();
        response.success('获取仪表盘数据成功', systemStats).send(res);
    } catch (error) {
        next(error);
    }
};

/**
 * 获取使用趋势数据
 */
exports.getUsageTrends = async (req, res, next) => {
    try {
        const { startDate, endDate, interval } = req.query;
        const trends = await stats.getUsageTrends(startDate, endDate, interval);
        response.success('获取使用趋势数据成功', trends).send(res);
    } catch (error) {
        next(error);
    }
};

/**
 * 获取AI助手统计数据
 */
exports.getAIAssistantStats = async (req, res, next) => {
    try {
        const aiStats = await stats.getAIAssistantStats();
        response.success('获取AI助手统计数据成功', aiStats).send(res);
    } catch (error) {
        next(error);
    }
};

/**
 * 获取用户行为分析数据
 */
exports.getUserBehaviorStats = async (req, res, next) => {
    try {
        const behaviorStats = await stats.getUserBehaviorStats();
        response.success('获取用户行为分析数据成功', behaviorStats).send(res);
    } catch (error) {
        next(error);
    }
};

/**
 * 获取管理操作日志统计
 */
exports.getAdminActionStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const actionStats = await stats.getAdminActionStats(startDate, endDate);
        response.success('获取管理操作统计数据成功', actionStats).send(res);
    } catch (error) {
        next(error);
    }
};

/**
 * 批量调整用户积分
 */
exports.batchAdjustPoints = async (req, res, next) => {
    try {
        const { userIds, amount, operation, description } = req.body;
        
        const results = await Promise.allSettled(
            userIds.map(userId => 
                User.findById(userId).then(async user => {
                    if (!user) {
                        throw new Error(`用户 ${userId} 不存在`);
                    }
                    
                    const newPoints = await user.updatePoints(amount, operation);
                    
                    await PointRecord.createRecord({
                        user: user._id,
                        type: 'admin_grant',
                        amount,
                        operation,
                        balance: newPoints,
                        description
                    });

                    return {
                        userId: user._id,
                        username: user.username,
                        newPoints,
                        status: 'success'
                    };
                })
            )
        );

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        response.success('批量调整积分完成', {
            total: results.length,
            success: successCount,
            failure: failureCount,
            details: results.map(r => 
                r.status === 'fulfilled' 
                    ? r.value 
                    : { error: r.reason.message, status: 'failed' }
            )
        }).send(res);

    } catch (error) {
        next(error);
    }
};

/**
 * 批量更新AI助手状态
 */
exports.batchUpdateAssistantStatus = async (req, res, next) => {
    try {
        const { assistantIds, isActive } = req.body;
        
        const results = await Promise.allSettled(
            assistantIds.map(id => 
                AIAssistant.findByIdAndUpdate(
                    id,
                    { isActive },
                    { new: true }
                ).then(assistant => {
                    if (!assistant) {
                        throw new Error(`AI助手 ${id} 不存在`);
                    }
                    return {
                        id: assistant._id,
                        name: assistant.name,
                        isActive: assistant.isActive,
                        status: 'success'
                    };
                })
            )
        );

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        response.success('批量更新AI助手状态完成', {
            total: results.length,
            success: successCount,
            failure: failureCount,
            details: results.map(r => 
                r.status === 'fulfilled' 
                    ? r.value 
                    : { error: r.reason.message, status: 'failed' }
            )
        }).send(res);

    } catch (error) {
        next(error);
    }
};

/**
 * 导出统计数据
 */
exports.exportStats = async (req, res, next) => {
    try {
        const { type, startDate, endDate } = req.query;
        let data;

        switch (type) {
            case 'system':
                data = await stats.getSystemStats();
                break;
            case 'usage':
                data = await stats.getUsageTrends(startDate, endDate, 'day');
                break;
            case 'ai':
                data = await stats.getAIAssistantStats();
                break;
            case 'user':
                data = await stats.getUserBehaviorStats();
                break;
            case 'admin':
                data = await stats.getAdminActionStats(startDate, endDate);
                break;
            default:
                return response.error('无效的导出类型').send(res);
        }

        // 设置导出文件名
        const filename = `${type}_stats_${formatDateTime(new Date(), 'YYYYMMDD_HHmmss')}.json`;
        
        // 设置响应头
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/json');
        
        // 发送数据
        res.send(JSON.stringify(data, null, 2));

    } catch (error) {
        next(error);
    }
}; 