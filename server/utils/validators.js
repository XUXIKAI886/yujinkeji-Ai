/**
 * 邮箱格式验证
 * @param {string} email 待验证的邮箱地址
 * @returns {boolean} 是否是有效的邮箱地址
 */
exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 密码强度验证
 * @param {string} password 待验证的密码
 * @returns {object} 包含验证结果和错误信息的对象
 */
exports.validatePassword = (password) => {
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
 * 用户名验证
 * @param {string} username 待验证的用户名
 * @returns {object} 包含验证结果和错误信息的对象
 */
exports.validateUsername = (username) => {
    const minLength = 2;
    const maxLength = 20;
    const validChars = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

    const errors = [];
    if (username.length < minLength) {
        errors.push(`用户名长度不能少于${minLength}个字符`);
    }
    if (username.length > maxLength) {
        errors.push(`用户名长度不能超过${maxLength}个字符`);
    }
    if (!validChars.test(username)) {
        errors.push('用户名只能包含字母、数字、下划线和中文字符');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}; 