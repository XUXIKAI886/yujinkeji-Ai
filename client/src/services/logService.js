import axios from 'axios';

const API_URL = '/api';

// 日志级别
export const LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

// 错误类型
export const ErrorType = {
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

class LogService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // 最大日志数量
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  // 发送日志到服务器
  async sendToServer(logEntry) {
    try {
      await axios.post(`${API_URL}/logs`, logEntry);
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // 添加日志
  async log(level, message, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 在开发模式下打印日志
    if (this.debugMode) {
      console[level](`[${level.toUpperCase()}]`, message, details);
    }

    // 添加到本地日志数组
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // 发送到服务器
    await this.sendToServer(logEntry);
  }

  // 记录信息
  info(message, details = {}) {
    return this.log(LogLevel.INFO, message, details);
  }

  // 记录警告
  warn(message, details = {}) {
    return this.log(LogLevel.WARN, message, details);
  }

  // 记录错误
  error(message, error = null, type = ErrorType.UNKNOWN_ERROR) {
    const details = {
      type,
      stack: error?.stack,
      message: error?.message,
      code: error?.code,
      response: error?.response?.data
    };
    return this.log(LogLevel.ERROR, message, details);
  }

  // 记录调试信息
  debug(message, details = {}) {
    if (this.debugMode) {
      return this.log(LogLevel.DEBUG, message, details);
    }
  }

  // 获取最近的日志
  getLogs(limit = 100) {
    return this.logs.slice(0, limit);
  }

  // 清除日志
  clearLogs() {
    this.logs = [];
  }

  // 格式化API错误
  formatApiError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || '服务器错误',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        message: '网络请求失败',
        type: ErrorType.NETWORK_ERROR
      };
    } else {
      return {
        message: error.message || '未知错误',
        type: ErrorType.UNKNOWN_ERROR
      };
    }
  }
}

export const logService = new LogService();

// 全局错误处理
export const handleGlobalError = (error, errorInfo = null) => {
  logService.error('Uncaught error', error, ErrorType.UNKNOWN_ERROR);
  
  // 在开发环境下抛出错误
  if (process.env.NODE_ENV === 'development') {
    console.error('Uncaught error:', error, errorInfo);
  }
};

export default logService; 