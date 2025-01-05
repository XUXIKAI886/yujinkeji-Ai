# AI助手平台后端服务

基于Node.js和Express框架开发的AI助手平台后端服务，支持用户管理、积分系统、AI助手调用等功能。

## 功能特性

- 用户管理
  - 注册与登录
  - 用户信息管理
  - 角色权限控制
- 积分系统
  - 积分明细记录
  - 积分消费与赠送
  - 积分统计分析
- AI助手管理
  - AI助手配置
  - 调用权限控制
  - 使用统计分析
- 系统功能
  - JWT认证
  - 请求日志记录
  - 错误处理机制
  - API访问限制

## 管理员账号

默认管理员账号信息：
- 邮箱：admin@example.com
- 密码：admin123

请在首次部署后及时修改默认密码！

## 技术栈

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token
- Winston (日志)
- Express Validator
- 其他依赖...

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
cd [项目目录]
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制`.env.example`文件为`.env`，并根据实际情况修改配置：
```bash
cp .env.example .env
```

4. 启动服务
```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

## API文档

### 用户相关

#### 注册
- 路径: POST /api/users/register
- 描述: 新用户注册
- 请求体:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "username"
  }
  ```

#### 登录
- 路径: POST /api/users/login
- 描述: 用户登录
- 请求体:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### AI助手相关

#### 获取AI助手列表
- 路径: GET /api/assistants
- 描述: 获取可用的AI助手列表
- 查询参数:
  - page: 页码
  - limit: 每页数量
  - type: AI助手类型

#### 调用AI助手
- 路径: POST /api/assistants/:assistantId/call
- 描述: 调用指定的AI助手
- 请求体:
  ```json
  {
    "input": "用户输入内容"
  }
  ```

### 积分相关

#### 获取积分历史
- 路径: GET /api/users/points/history
- 描述: 获取用户积分变动历史
- 查询参数:
  - page: 页码
  - limit: 每页数量
  - type: 记录类型

## 开发指南

### 项目结构
```
src/
├── config/         # 配置文件
├── controllers/    # 控制器
├── middleware/     # 中间件
├── models/         # 数据模型
├── routes/         # 路由定义
├── utils/          # 工具函数
└── app.js         # 应用入口
```

### 开发规范

1. 代码风格
- 使用ES6+语法
- 使用async/await处理异步
- 遵循ESLint规则

2. 错误处理
- 使用统一的错误处理中间件
- 合理使用try-catch
- 记录错误日志

3. API设计
- 遵循RESTful规范
- 使用适当的HTTP方法
- 返回统一的响应格式

4. 安全性
- 验证所有用户输入
- 使用适当的认证和授权
- 保护敏感信息

## 部署说明

1. 环境要求
- Node.js >= 14
- MongoDB >= 4.0
- PM2 (用于生产环境)

2. 部署步骤
```bash
# 安装依赖
npm install --production

# 配置环境变量
vim .env

# 使用PM2启动服务
pm2 start ecosystem.config.js
```

3. 监控和维护
- 使用PM2监控进程
- 定期检查日志
- 配置自动备份

## 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 作者: [您的名字]
- 邮箱: [您的邮箱]
- 项目地址: [项目仓库地址] 