const mongoose = require('mongoose');

const userAssistantPermissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assistant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AIAssistant',
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    customPointsCost: {
        type: Number,
        default: null
    },
    lastUsed: {
        type: Date,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// 创建复合索引
userAssistantPermissionSchema.index({ user: 1, assistant: 1 }, { unique: true });

const UserAssistantPermission = mongoose.model('UserAssistantPermission', userAssistantPermissionSchema);

module.exports = UserAssistantPermission; 