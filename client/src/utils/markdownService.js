import { marked } from 'marked';

// 配置 marked 选项
marked.setOptions({
    gfm: true, // 启用 GitHub 风格的 Markdown
    breaks: true, // 启用换行符转换为 <br>
    headerIds: true, // 为标题添加 id
    mangle: false, // 不转义标题中的内容
    sanitize: false, // 允许 HTML 标签
});

// 自定义渲染器
const renderer = new marked.Renderer();

// 自定义列表项渲染
renderer.listitem = function(text) {
    return `<li class="custom-list-item">${text}</li>`;
};

// 自定义段落渲染
renderer.paragraph = function(text) {
    return `<p class="custom-paragraph">${text}</p>`;
};

// 设置渲染器
marked.use({ renderer });

/**
 * 将 Markdown 文本转换为 HTML
 * @param {string} markdown - Markdown 格式的文本
 * @returns {string} - 转换后的 HTML 文本
 */
export function markdownToHtml(markdown) {
    try {
        return marked(markdown);
    } catch (error) {
        console.error('Markdown 转换失败:', error);
        return markdown; // 转换失败时返回原文本
    }
}

const markdownService = {
    markdownToHtml
};

export default markdownService; 