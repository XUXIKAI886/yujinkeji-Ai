const mongoose = require('mongoose');

/**
 * AI助手Schema定义
 * 包含AI助手的基本信息、配置和使用规则
 */
const aiAssistantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'AI助手名称是必需的'],
        trim: true,
        minlength: [2, 'AI助手名称至少需要2个字符'],
        maxlength: [50, 'AI助手名称不能超过50个字符']
    },
    icon: {
        type: String,
        trim: true,
        default: null
    },
    key: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'AI助手描述是必需的'],
        trim: true,
        minlength: [10, '描述至少需要10个字符'],
        maxlength: [500, '描述不能超过500个字符']
    },
    type: {
        type: String,
        required: [true, 'AI助手类型是必需的'],
        enum: {
            values: ['general', 'text', 'image', 'code', 'other'],
            message: '无效的AI助手类型'
        }
    },
    pointsCost: {
        type: Number,
        required: [true, '使用积分成本是必需的'],
        min: [0, '积分成本不能为负数']
    },
    config: {
        modelType: {
            type: String,
            required: [true, '模型类型是必需的'],
            enum: {
                values: ['coze', 'deepseek'],
                message: '无效的模型类型'
            }
        },
        model: {
            type: String,
            required: [true, '模型名称是必需的']
        },
        apiKey: {
            type: String,
            required: [true, 'API密钥是必需的']
        },
        apiUrl: {
            type: String,
            required: [true, 'API地址是必需的']
        },
        temperature: {
            type: Number,
            default: 0.7,
            min: [0, '温度值不能小于0'],
            max: [1, '温度值不能大于1']
        },
        maxTokens: {
            type: Number,
            default: 2000,
            min: [1, '最大令牌数不能小于1']
        },
        botId: String,
        systemPrompt: String
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    metadata: {
        version: {
            type: String,
            default: '1.0.0'
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        tags: [String],
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    accessLevel: {
        type: String,
        enum: {
            values: ['public', 'private', 'restricted'],
            message: '无效的访问级别'
        },
        default: 'public'
    },
    stats: {
        totalCalls: {
            type: Number,
            default: 0
        },
        successfulCalls: {
            type: Number,
            default: 0
        },
        failedCalls: {
            type: Number,
            default: 0
        },
        averageResponseTime: {
            type: Number,
            default: 0
        },
        lastUsed: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 索引
aiAssistantSchema.index({ key: 1 }, { unique: true, sparse: true });
aiAssistantSchema.index({ name: 1 });
aiAssistantSchema.index({ type: 1 });
aiAssistantSchema.index({ isActive: 1 });
aiAssistantSchema.index({ 'metadata.creator': 1 });

/**
 * 更新使用统计的实例方法
 * @param {boolean} success - 调用是否成功
 */
aiAssistantSchema.methods.updateUsageStats = async function(success) {
    this.stats.totalCalls += 1;
    if (success) {
        this.stats.successfulCalls += 1;
    } else {
        this.stats.failedCalls += 1;
    }
    this.stats.lastUsed = new Date();
    await this.save();
};

/**
 * 检查用户是否有权限使用该AI助手的实例方法
 * @param {Object} user - 用户对象
 * @returns {boolean} - 返回是否有权限
 */
aiAssistantSchema.methods.checkAccess = function(user) {
    if (!this.isActive) return false;
    if (user.role === 'admin') return true;
    if (this.accessLevel === 'admin' && user.role !== 'admin') return false;
    if (this.accessLevel === 'premium' && user.role === 'user') return false;
    return true;
};

/**
 * 获取活跃AI助手列表的静态方法
 * @param {Object} filter - 查询过滤条件
 * @returns {Promise<Document[]>} - 返回AI助手列表
 */
aiAssistantSchema.statics.getActiveAssistants = async function(filter = {}) {
    try {
        const query = { isActive: true, ...filter };
        console.log('查询活跃AI助手:', query);
        const assistants = await this.find(query)
            .select('name key description type pointsCost config isActive metadata stats')
            .sort({ 'stats.totalCalls': -1 });
        console.log('找到活跃AI助手数量:', assistants.length);
        return assistants;
    } catch (error) {
        console.error('获取活跃AI助手列表失败:', error);
        throw new Error(`获取AI助手列表失败: ${error.message}`);
    }
};

/**
 * 获取使用统计信息的静态方法
 * @returns {Promise<Object>} - 返回统计信息
 */
aiAssistantSchema.statics.getUsageStats = async function() {
    try {
        return await this.aggregate([
            { $group: {
                _id: '$type',
                totalCalls: { $sum: '$stats.totalCalls' },
                successfulCalls: { $sum: '$stats.successfulCalls' },
                failedCalls: { $sum: '$stats.failedCalls' },
                assistantCount: { $sum: 1 }
            }}
        ]);
    } catch (error) {
        throw new Error(`获取使用统计信息失败: ${error.message}`);
    }
};

// 创建并导出AI助手模型
const AIAssistant = mongoose.model('AIAssistant', aiAssistantSchema);
module.exports = AIAssistant; 