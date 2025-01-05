const { validationResult, body, param, query } = require('express-validator');
const { AppError } = require('./error.middleware');

/**
 * 验证结果处理中间件
 * 检查请求中的验证错误并返回适当的响应
 */
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(err => `${err.param}: ${err.msg}`);
        return next(new AppError(messages.join('; '), 400));
    }
    next();
};

/**
 * 用户注册验证规则
 */
exports.registerValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('密码至少需要6个字符')
        .matches(/\d/)
        .withMessage('密码必须包含数字')
        .matches(/[a-zA-Z]/)
        .withMessage('密码必须包含字母'),
    body('username')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('用户名长度必须在2-30个字符之间')
        .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
        .withMessage('用户名只能包含字母、数字、下划线和中文'),
    exports.validate
];

/**
 * 用户登录验证规则
 */
exports.loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('请输入密码'),
    exports.validate
];

/**
 * AI助手创建验证规则
 */
exports.createAIAssistantValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('名称长度必须在2-50个字符之间'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('描述长度必须在10-500个字符之间'),
    body('type')
        .isIn(['text', 'image', 'code', 'other'])
        .withMessage('无效的AI助手类型'),
    body('pointsCost')
        .isInt({ min: 0 })
        .withMessage('积分成本必须是非负整数'),
    body('config')
        .isObject()
        .withMessage('配置必须是一个对象'),
    body('config.model')
        .notEmpty()
        .withMessage('模型配置是必需的'),
    body('config.temperature')
        .optional()
        .isFloat({ min: 0, max: 2 })
        .withMessage('温度值必须在0-2之间'),
    body('config.maxTokens')
        .optional()
        .isInt({ min: 1 })
        .withMessage('最大令牌数必须是正整数'),
    exports.validate
];

/**
 * 积分操作验证规则
 */
exports.pointsOperationValidation = [
    body('amount')
        .isInt({ min: 1 })
        .withMessage('积分数量必须是正整数'),
    body('type')
        .isIn(['register', 'ai_usage', 'admin_grant', 'other'])
        .withMessage('无效的积分操作类型'),
    body('description')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('描述长度必须在5-200个字符之间'),
    exports.validate
];

/**
 * ID参数验证规则
 */
exports.idValidation = [
    param('id')
        .isMongoId()
        .withMessage('无效的ID格式'),
    exports.validate
];

/**
 * 分页查询参数验证规则
 */
exports.paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('页码必须是正整数'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('每页数量必须在1-100之间'),
    exports.validate
];

/**
 * 日期范围验证规则
 */
exports.dateRangeValidation = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('开始日期格式无效'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('结束日期格式无效')
        .custom((endDate, { req }) => {
            if (req.query.startDate && endDate < req.query.startDate) {
                throw new Error('结束日期不能早于开始日期');
            }
            return true;
        }),
    exports.validate
];

/**
 * 搜索查询验证规则
 */
exports.searchValidation = [
    query('keyword')
        .trim()
        .isLength({ min: 1 })
        .withMessage('搜索关键词不能为空')
        .isLength({ max: 50 })
        .withMessage('搜索关键词不能超过50个字符'),
    exports.validate
]; 