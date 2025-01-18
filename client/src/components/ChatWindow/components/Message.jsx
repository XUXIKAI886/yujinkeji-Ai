import React, { useRef } from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { CopyOutlined, DownloadOutlined, UserOutlined, RobotOutlined, FilePdfOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 16px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }
`;

const MessageAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$isUser ? '#60a5fa' : '#10b981'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .anticon {
    font-size: 20px;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  background: ${props => props.isUser ? '#60a5fa' : '#ffffff'};
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: ${props => props.isUser ? '0 2px 8px rgba(96, 165, 250, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s ease;
  overflow-x: hidden;
  word-wrap: break-word;

  &:hover {
    box-shadow: ${props => props.isUser ? '0 4px 12px rgba(96, 165, 250, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)'};
    transform: translateY(-1px);
  }
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
  font-size: 15px;
  color: ${props => props.isUser ? '#ffffff' : '#1f2937'};
  
  /* 确保换行符正确显示 */
  p {
    white-space: pre-wrap !important;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: ${props => props.isUser ? 'flex-start' : 'flex-end'};
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MessageBubble}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px 8px;
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.6)'};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.isUser ? '#ffffff' : '#1f2937'};
  }

  .anticon {
    font-size: 16px;
  }
`;

const StyledMarkdown = styled.div`
  /* 基础样式 */
  * {
    white-space: pre-wrap !important;
    margin: 0;
    padding: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }

  /* 段落样式 */
  p {
    margin: 0;
    padding: 0;
    line-height: 1.5;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    
    &:empty {
      display: none;
    }
    
    & + p {
      margin-top: 2px;
    }
  }

  /* 列表样式 */
  ul, ol {
    margin: 2px 0;
    padding-left: 24px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    
    li {
      margin: 1px 0;
      padding: 0;
    }
  }

  /* 代码块样式 */
  pre {
    margin: 4px 0;
    padding: 12px;
    border-radius: 8px;
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
    overflow-x: auto;
    white-space: pre-wrap !important;
    word-wrap: break-word;
  }

  /* 移除多余的空行 */
  br {
    display: none;
  }

  p:empty {
    display: none;
  }

  /* 调整相邻元素间距 */
  * + * {
    margin-top: 2px;
  }

  /* 确保第一个和最后一个元素没有多余的边距 */
  > *:first-child {
    margin-top: 0 !important;
  }

  > *:last-child {
    margin-bottom: 0 !important;
  }

  /* 优化引用样式 */
  blockquote {
    margin: 2px 0;
    padding-left: 12px;
    border-left: 3px solid ${props => props.isUser ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'};
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }

  /* 表格样式优化 */
  table {
    margin: 2px 0;
    font-size: 0.95em;
    max-width: 100%;
    overflow-x: auto;
    display: block;
    
    th, td {
      padding: 4px 6px;
      word-break: break-word;
    }
  }

  /* 行内代码样式 */
  code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    padding: 2px 4px;
    border-radius: 4px;
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
    word-break: break-word;
  }

  /* 图片样式 */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 8px 0;
    display: block;

    &:first-child {
      margin-top: 0;
    }
  }
`;

const Message = ({ message, handleCopy, handleExport, handleExportPDF, handleExportMarkdown }) => {
  const contentRef = useRef(null);

  const getContent = () => {
    if (contentRef.current) {
      return contentRef.current.innerHTML;
    }
    return message.content;
  };

  return (
    <MessageWrapper>
      <MessageAvatar $isUser={message.isUser} icon={message.isUser ? <UserOutlined /> : <RobotOutlined />} />
      <MessageBubble isUser={message.isUser}>
        <MessageContent isUser={message.isUser}>
          <StyledMarkdown isUser={message.isUser}>
            <div ref={contentRef}>
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({children}) {
                    if (children.length === 0 || (children.length === 1 && children[0] === '')) {
                      return null;
                    }
                    return <p>{children}</p>;
                  },
                  br() {
                    return null;
                  },
                  text({children}) {
                    if (typeof children === 'string' && children.trim() === '') {
                      return null;
                    }
                    return children;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </StyledMarkdown>
        </MessageContent>
        <ActionButtons isUser={message.isUser}>
          <ActionButton 
            isUser={message.isUser} 
            onClick={() => handleCopy(getContent())}
          >
            <CopyOutlined /> 复制
          </ActionButton>
          <ActionButton 
            isUser={message.isUser} 
            onClick={() => handleExport(getContent())}
          >
            <DownloadOutlined /> 导出
          </ActionButton>
          <ActionButton 
            isUser={message.isUser} 
            onClick={() => handleExportPDF(getContent())}
          >
            <FilePdfOutlined /> PDF
          </ActionButton>
          <ActionButton 
            isUser={message.isUser} 
            onClick={() => handleExportMarkdown(getContent())}
          >
            <FileMarkdownOutlined /> Markdown
          </ActionButton>
        </ActionButtons>
      </MessageBubble>
    </MessageWrapper>
  );
};

export default Message; 