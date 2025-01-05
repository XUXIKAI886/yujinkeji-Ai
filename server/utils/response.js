/**
 * API响应工具类
 */
class ApiResponse {
    /**
     * 创建成功响应
     * @param {string} message 成功消息
     * @param {*} data 响应数据
     * @returns {object} 响应对象
     */
    static success(message, data = null) {
        return {
            success: true,
            message,
            data
        };
    }

    /**
     * 创建错误响应
     * @param {string} message 错误消息
     * @param {*} data 错误详情数据
     * @returns {object} 响应对象
     */
    static error(message, data = null) {
        return {
            success: false,
            message,
            data
        };
    }

    /**
     * 创建分页响应
     * @param {string} message 成功消息
     * @param {Array} items 分页数据
     * @param {number} total 总数
     * @param {number} page 当前页码
     * @param {number} pageSize 每页大小
     * @returns {object} 响应对象
     */
    static page(message, items, total, page, pageSize) {
        return {
            success: true,
            message,
            data: {
                items,
                pagination: {
                    total,
                    page,
                    pageSize,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        };
    }

    /**
     * 创建新建成功响应
     * @param {*} data 创建的数据
     * @param {string} message 成功消息
     * @returns {object} 响应对象
     */
    static created(data, message = '创建成功') {
        return {
            success: true,
            message,
            data
        };
    }

    /**
     * 创建更新成功响应
     * @param {*} data 更新后的数据
     * @param {string} message 成功消息
     * @returns {object} 响应对象
     */
    static updated(data, message = '更新成功') {
        return {
            success: true,
            message,
            data
        };
    }

    /**
     * 创建删除成功响应
     * @param {string} message 删除成功消息
     * @returns {object} 响应对象
     */
    static deleted(message = '删除成功') {
        return {
            success: true,
            message
        };
    }
}

module.exports = {
    ApiResponse
}; 