const moment = require('moment');
const User = require('../models/user.model');
const AIAssistant = require('../models/aiAssistant.model');
const PointsHistory = require('../models/pointsHistory.model');

/**
 * 获取系统总体统计信息
 * @returns {Promise<Object>} 系统统计信息
 */
exports.getSystemStats = async () => {
    const [
        totalUsers,
        activeUsers,
        totalPoints,
        totalAssistants,
        activeAssistants
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        PointsHistory.aggregate([
            { $group: { 
                _id: null,
                totalAdded: { $sum: { $cond: [{ $eq: ['$operation', 'add'] }, '$amount', 0] } },
                totalDeducted: { $sum: { $cond: [{ $eq: ['$operation', 'deduct'] }, '$amount', 0] } }
            }}
        ]),
        AIAssistant.countDocuments(),
        AIAssistant.countDocuments({ isActive: true })
    ]);

    return {
        users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers
        },
        points: {
            totalAdded: totalPoints[0]?.totalAdded || 0,
            totalDeducted: totalPoints[0]?.totalDeducted || 0,
            circulation: (totalPoints[0]?.totalAdded || 0) - (totalPoints[0]?.totalDeducted || 0)
        },
        assistants: {
            total: totalAssistants,
            active: activeAssistants,
            inactive: totalAssistants - activeAssistants
        }
    };
};

/**
 * 获取时间段内的使用趋势
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @param {string} interval - 时间间隔（day/week/month）
 * @returns {Promise<Object>} 趋势统计数据
 */
exports.getUsageTrends = async (startDate, endDate, interval = 'day') => {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');

    const matchStage = {
        $match: {
            createdAt: {
                $gte: start.toDate(),
                $lte: end.toDate()
            }
        }
    };

    let groupStage;
    switch (interval) {
        case 'week':
            groupStage = {
                $group: {
                    _id: { $week: '$createdAt' },
                    date: { $first: '$createdAt' },
                    count: { $sum: 1 }
                }
            };
            break;
        case 'month':
            groupStage = {
                $group: {
                    _id: { 
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    date: { $first: '$createdAt' },
                    count: { $sum: 1 }
                }
            };
            break;
        default: // day
            groupStage = {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    date: { $first: '$createdAt' },
                    count: { $sum: 1 }
                }
            };
    }

    const [userTrends, pointTrends, usageTrends] = await Promise.all([
        // 用户注册趋势
        User.aggregate([
            matchStage,
            groupStage,
            { $sort: { date: 1 } }
        ]),
        // 积分使用趋势
        PointsHistory.aggregate([
            matchStage,
            {
                $group: {
                    _id: groupStage.$group._id,
                    date: { $first: '$createdAt' },
                    added: { $sum: { $cond: [{ $eq: ['$operation', 'add'] }, '$amount', 0] } },
                    deducted: { $sum: { $cond: [{ $eq: ['$operation', 'deduct'] }, '$amount', 0] } }
                }
            },
            { $sort: { date: 1 } }
        ]),
        // AI助手使用趋势
        AIAssistant.aggregate([
            {
                $match: {
                    'usage.lastUsed': {
                        $gte: start.toDate(),
                        $lte: end.toDate()
                    }
                }
            },
            groupStage,
            { $sort: { date: 1 } }
        ])
    ]);

    return {
        userTrends,
        pointTrends,
        usageTrends
    };
};

/**
 * 获取AI助手详细统计信息
 * @returns {Promise<Object>} AI助手统计信息
 */
exports.getAIAssistantStats = async () => {
    const stats = await AIAssistant.aggregate([
        {
            $group: {
                _id: '$type',
                totalAssistants: { $sum: 1 },
                activeAssistants: { $sum: { $cond: ['$isActive', 1, 0] } },
                totalCalls: { $sum: '$usage.totalCalls' },
                successfulCalls: { $sum: '$usage.successfulCalls' },
                failedCalls: { $sum: '$usage.failedCalls' },
                averagePointsCost: { $avg: '$pointsCost' }
            }
        }
    ]);

    const topAssistants = await AIAssistant.find()
        .sort({ 'usage.totalCalls': -1 })
        .limit(10)
        .select('name type usage pointsCost');

    return {
        byType: stats,
        topAssistants
    };
};

/**
 * 获取用户行为分析
 * @returns {Promise<Object>} 用户行为统计信息
 */
exports.getUserBehaviorStats = async () => {
    const [pointsDistribution, userActivity] = await Promise.all([
        // 积分分布统计
        User.aggregate([
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lt: ['$points', 100] }, then: '0-100' },
                                { case: { $lt: ['$points', 500] }, then: '100-500' },
                                { case: { $lt: ['$points', 1000] }, then: '500-1000' },
                                { case: { $lt: ['$points', 5000] }, then: '1000-5000' }
                            ],
                            default: '5000+'
                        }
                    },
                    count: { $sum: 1 },
                    totalPoints: { $sum: '$points' }
                }
            }
        ]),
        // 用户活跃度统计
        User.aggregate([
            {
                $lookup: {
                    from: 'pointrecords',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'activities'
                }
            },
            {
                $project: {
                    username: 1,
                    lastLogin: 1,
                    activityCount: { $size: '$activities' },
                    lastActivity: { $max: '$activities.createdAt' }
                }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $gt: ['$activityCount', 100] }, then: 'very_active' },
                                { case: { $gt: ['$activityCount', 50] }, then: 'active' },
                                { case: { $gt: ['$activityCount', 10] }, then: 'moderate' }
                            ],
                            default: 'inactive'
                        }
                    },
                    count: { $sum: 1 },
                    avgActivities: { $avg: '$activityCount' }
                }
            }
        ])
    ]);

    return {
        pointsDistribution,
        userActivity
    };
};

/**
 * 获取管理操作日志统计
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {Promise<Object>} 管理操作统计信息
 */
exports.getAdminActionStats = async (startDate, endDate) => {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');

    const pointAdjustments = await PointsHistory.aggregate([
        {
            $match: {
                type: 'admin_grant',
                createdAt: {
                    $gte: start.toDate(),
                    $lte: end.toDate()
                }
            }
        },
        {
            $group: {
                _id: '$operation',
                count: { $sum: 1 },
                totalPoints: { $sum: '$amount' }
            }
        }
    ]);

    const assistantChanges = await AIAssistant.aggregate([
        {
            $match: {
                'metadata.creator': { $exists: true },
                updatedAt: {
                    $gte: start.toDate(),
                    $lte: end.toDate()
                }
            }
        },
        {
            $group: {
                _id: '$metadata.creator',
                created: { $sum: 1 },
                updates: { 
                    $sum: { 
                        $cond: [
                            { $ne: ['$createdAt', '$updatedAt'] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    return {
        pointAdjustments,
        assistantChanges
    };
}; 