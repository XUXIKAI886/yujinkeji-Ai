import TurndownService from 'turndown';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*'
});

// 自定义转换规则
turndownService.addRule('codeBlocks', {
    filter: node => {
        return (
            node.nodeName === 'PRE' &&
            node.firstChild &&
            node.firstChild.nodeName === 'CODE'
        );
    },
    replacement: (content, node) => {
        const code = node.firstChild.textContent;
        const lang = node.firstChild.className.replace('language-', '');
        return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    }
});

// 保留表格样式
turndownService.addRule('tables', {
    filter: 'table',
    replacement: (content, node) => {
        const rows = node.rows;
        const headers = Array.from(rows[0].cells).map(cell => cell.textContent.trim());
        const separator = headers.map(() => '---');
        const body = Array.from(rows).slice(1).map(row => {
            return Array.from(row.cells).map(cell => cell.textContent.trim());
        });

        const table = [
            headers.join(' | '),
            separator.join(' | '),
            ...body.map(row => row.join(' | '))
        ].join('\n');

        return '\n' + table + '\n\n';
    }
});

// 添加标题处理规则
turndownService.addRule('headings', {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: (content, node) => {
        const level = Number(node.nodeName.charAt(1));
        const hashes = '#'.repeat(level);
        
        // 获取标题后的内容
        let nextContent = '';
        let nextNode = node.nextElementSibling;
        
        // 如果下一个元素不是列表，我们需要检查是否有内容来创建列表
        if (!nextNode || (nextNode.nodeName !== 'UL' && nextNode.nodeName !== 'OL')) {
            // 获取到下一个标题之前的所有文本内容
            let textContent = '';
            while (nextNode && !nextNode.nodeName.match(/^H[1-6]$/)) {
                textContent += nextNode.textContent.trim() + ' ';
                nextNode = nextNode.nextElementSibling;
            }
            
            // 只有当有实际文本内容时，才创建列表项
            if (textContent.trim()) {
                nextContent = `\n- ${textContent.trim()}\n`;
            }
        }
        
        return `\n${hashes} ${content}${nextContent}`;
    }
});

export default turndownService; 