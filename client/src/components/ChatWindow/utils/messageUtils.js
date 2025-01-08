// 格式化消息内容
export const formatMessageContent = (content) => {
    if (!content) return '';
    
    // 移除所有特殊标记和HTML标签，但保留图片URL
    let formattedContent = content
        .replace(/<(?!img)[^>]*>/g, '') // 移除除img标签外的所有HTML标签
        .replace(/##\s*[🎨📝]\s*[^]*?(?=\n|$)/g, '') // 移除以##开头的特殊标记行
        .replace(/[*\-#]+\s*/g, '') // 移除所有*、-、#号及其后的空格
        .replace(/\n\s*\n\s*\n/g, '\n') // 将多个连续空行减少为一个空行
        .split('\n')
        .map(line => line.trim()) // 清理每行首尾空格
        .filter(line => line) // 移除空行
        .join('\n'); // 用单个换行符连接段落
    
    // 清理首尾空白
    formattedContent = formattedContent.trim();
    
    return formattedContent;
};

// 检查文本是否是图片URL
export const isImageUrl = (text) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    // 修改URL匹配模式，排除中文字符和标点
    // eslint-disable-next-line no-useless-escape
    const urlPattern = /https?:\/\/[a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=]+/i;
    const url = text.match(urlPattern)?.[0] || text;
    return imageExtensions.test(url) || /\.(jpg|jpeg|png|gif|webp)(\?[^<>"]*)?$/i.test(url);
};

// 从文本中提取URL
export const extractUrl = (text) => {
    // eslint-disable-next-line no-useless-escape
    const urlPattern = /https?:\/\/[a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=]+/i;
    const match = text.match(urlPattern);
    return match ? match[0] : null;
}; 