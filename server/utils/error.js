/**
 * 自定义API错误类
 */
class ApiError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 验证错误类
 */
class ValidationError extends ApiError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

/**
 * 认证错误类
 */
class AuthError extends ApiError {
    constructor(message) {
        super(message, 401);
        this.name = 'AuthError';
    }
}

/**
 * 权限错误类
 */
class ForbiddenError extends ApiError {
    constructor(message) {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

/**
 * 资源不存在错误类
 */
class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    ApiError,
    ValidationError,
    AuthError,
    ForbiddenError,
    NotFoundError
}; 