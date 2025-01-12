# 域锦科技 AI 助手平台

一个基于 AI 技术的智能助手平台，专注于提升外卖运营效率和数据分析能力。

## 功能特性

### 1. AI 智能对话
- 多场景专业 AI 助手
- 自然语言交互
- 智能问答和建议

### 2. 数据分析工具

#### 2.1 商圈分析
- 店铺评分分布分析
- 月售订单分布统计
- 起送价分布分析
- 配送费分析
- 配送时间分布
- 店铺名称词云图

#### 2.2 评价分析
- 评分分布统计
- 情感分析
- 评分趋势分析
- 词频统计
- 评价词云图

#### 2.3 销售可视化
- 收入趋势分析
- 营业额分析
- 曝光人数统计
- 入店人数分析
- 转化率分析
- 下单人数趋势

#### 2.4 绩效统计
- 店铺结算分析
- 结算天数统计
- 绩效金额计算
- 数据导出功能

#### 2.5 商家统计
- 每日店铺数统计
- 结算金额分析
- 趋势图表展示
- Excel导出功能

### 3. 思维导图工具
- Markdown 格式支持
- 实时预览
- 导出 SVG
- 全屏显示模式

## 技术栈

### 前端
- React
- Ant Design
- ECharts
- Layui
- Styled Components
- Papa Parse (CSV解析)
- XLSX (Excel处理)
- Markmap (思维导图)

### 后端
- Node.js
- Express
- MongoDB
- JWT认证
- Winston日志
- Multer文件处理

## 安装部署

### 环境要求
- Node.js >= 14.0.0
- MongoDB >= 4.0
- NPM 或 Yarn

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
```

3. 配置环境变量
```bash
# 后端配置 (server/.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
API_VERSION=1.0.0

# 前端配置 (client/.env)
REACT_APP_API_URL=http://localhost:3000/api
```

4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 项目结构
```
.
├── client/                 # 前端代码
│   ├── public/            # 静态资源
│   │   ├── mindmap/      # 思维导图模块
│   │   ├── performance-stats/  # 绩效统计模块
│   │   ├── sales-visualization/  # 销售可视化模块
│   │   ├── takeout-review-analysis/  # 评价分析模块
│   │   └── vendor-statistics/  # 商家统计模块
│   └── src/              # React源代码
│       ├── components/   # 组件
│       ├── contexts/     # 上下文
│       ├── pages/        # 页面
│       ├── services/     # 服务
│       └── utils/        # 工具函数
└── server/               # 后端代码
    ├── controllers/      # 控制器
    ├── middleware/       # 中间件
    ├── models/          # 数据模型
    ├── routes/          # 路由
    └── utils/           # 工具函数
```

## 使用说明

1. 用户认证
- 注册/登录系统
- 会员功能仅限域锦科技会员使用

2. 数据分析
- 支持上传 CSV/Excel 格式数据
- 自动生成可视化图表
- 支持导出分析结果

3. 思维导图
- 支持 Markdown 格式输入
- 实时预览效果
- 可导出为 SVG 格式

## 开发团队

- 域锦科技研发团队

## 版权信息

© 2025 域锦科技 保留所有权利 