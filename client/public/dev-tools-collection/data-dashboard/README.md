# 美团外卖商家数据分析平台

这是一个基于 Web 的数据可视化大屏项目，专门为美团外卖商家设计的数据分析平台。通过直观的数据展示和实时监控，帮助商家更好地了解和分析经营状况。

## 功能特点

### 1. 热销商品分析
- TOP5 商品实时排名
- 销量和增长趋势展示
- 动态更新的排名变化效果

### 2. 销售数据统计
- 年度/月度/周度/日订单量展示
- 总营业额实时统计
- 立体地球仪特效展示

### 3. 运营指标监控
- 日均订单量
- 客单价分析
- 月度营收统计
- 配送准时率和订单完成率水波图展示

### 4. 餐品分类分析
- 主食类销售分析
- 小吃类销售分析
- 饮品类销售分析
- 可视化比例展示

## 技术栈

- HTML5 + CSS3
- JavaScript / jQuery
- ECharts 数据可视化库
- ECharts-liquidfill 水波图插件

## 项目结构

```
├── css/                # 样式文件
├── js/                 # JavaScript 文件
├── images/            # 图片资源
├── fonts/             # 字体文件
├── node_modules/      # 依赖包
└── index.html         # 主页面
```

## 如何使用

1. 克隆项目到本地：
```bash
git clone [项目地址]
```

2. 安装依赖：
```bash
npm install
```

3. 启动项目：
   - 使用任意 Web 服务器（如 Python 的 SimpleHTTPServer）：
```bash
python -m http.server 8080
```
   - 或使用 Node.js 的 http-server：
```bash
npx http-server
```

4. 访问项目：
   - 打开浏览器
   - 访问 `http://localhost:8080`

## 浏览器支持

- Chrome（推荐）
- Firefox
- Edge
- Safari

## 注意事项

- 建议使用 1920 x 1080 及以上分辨率
- 需要现代浏览器支持
- 建议使用 Chrome 浏览器以获得最佳效果

## 数据更新

- 当前版本使用模拟数据
- 可通过修改 `js/main.js` 中的数据源配置接入实际数据
- 支持实时数据更新

## 许可证

MIT License 