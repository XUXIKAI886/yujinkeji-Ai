const mongoose = require('mongoose');

const pointsHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['add', 'register', 'use_assistant', 'admin_grant', 'analyze_files'],
        required: true
    },
    operation: {
        type: String,
        enum: ['add', 'deduct'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const PointsHistory = mongoose.model('PointsHistory', pointsHistorySchema);

module.exports = PointsHistory; 