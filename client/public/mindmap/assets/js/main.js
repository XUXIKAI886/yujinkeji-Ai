console.log('main.js 开始执行');

const { Markmap } = window.markmap;

// 初始化思维导图
const svg = document.getElementById('markmap');
const mm = Markmap.create(svg);
const textarea = document.getElementById('markdown-input');

// 示例 Markdown
const exampleMarkdown = `
# 思维导图示例

## 域锦科技
### AI助理
- 美团全能客服
- 外卖数据分析
- 关键词优化

### 域锦开发
- 选择器
- 布局
  - Flexbox
  - Grid
- 动画

### JavaScript
- 基础语法
- DOM操作
- 事件处理
- ES6+特性
  - 箭头函数
  - Promise
  - async/await

## 域锦开发
### Node.js
- Express
- Koa
- 数据库操作

### 数据库
- MongoDB
- MySQL
- Redis

## 呈尚策划
### 代运营提效
- VS Code
- WebStorm

### 专业度提升
- Git
- SVN
`;

// 文件输入处理
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        textarea.value = content;
        updateMarkmap(content);
    };
    reader.readAsText(file);
});

// 示例按钮处理
document.getElementById('exampleBtn').addEventListener('click', () => {
    textarea.value = exampleMarkdown;
    updateMarkmap(exampleMarkdown);
});

// 导出按钮处理
document.getElementById('exportBtn').addEventListener('click', () => {
    const svgData = svg.outerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.svg';
    a.click();
    URL.revokeObjectURL(url);
});

// 实时更新处理
let updateTimer;
textarea.addEventListener('input', () => {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
        updateMarkmap(textarea.value);
    }, 300);
});

// Markdown 转换和更新函数
function updateMarkmap(content) {
    console.log('更新思维导图:', content);
    try {
        // 使用全局 transformer 对象
        const { root } = window.transformer.transform(content);
        mm.setData(root);
        mm.fit(); // 自适应大小
    } catch (error) {
        console.error('转换失败:', error);
    }
}

// 初始加载示例
window.addEventListener('load', () => {
    console.log('页面完全加载');
    textarea.value = exampleMarkdown;
    updateMarkmap(exampleMarkdown);
});

// 全屏功能处理
const fullscreenBtn = document.getElementById('fullscreenBtn');
const previewDiv = document.querySelector('.preview');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (previewDiv.requestFullscreen) {
            previewDiv.requestFullscreen();
        } else if (previewDiv.webkitRequestFullscreen) {
            previewDiv.webkitRequestFullscreen();
        } else if (previewDiv.msRequestFullscreen) {
            previewDiv.msRequestFullscreen();
        }
        fullscreenBtn.textContent = '退出全屏';
        previewDiv.classList.add('fullscreen');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullscreenBtn.textContent = '全屏';
        previewDiv.classList.remove('fullscreen');
    }
    // 调整思维导图大小以适应新的容器大小
    setTimeout(() => {
        mm.fit();
    }, 100);
});

// 监听全屏变化事件
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
        fullscreenBtn.textContent = '全屏';
        previewDiv.classList.remove('fullscreen');
        // 调整思维导图大小
        mm.fit();
    }
}
