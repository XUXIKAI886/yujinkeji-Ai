import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Avatar, Modal, Button, Input, Tooltip } from 'antd';
import message from 'antd/lib/message';
import { CopyOutlined, DownloadOutlined, UserOutlined, RobotOutlined, FilePdfOutlined, FileMarkdownOutlined, EyeOutlined, EditOutlined, SaveOutlined, UndoOutlined, PictureOutlined, SyncOutlined, ZoomInOutlined, ZoomOutOutlined, DragOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  padding: 3px 6px;
  border-radius: 16px;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.07);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(229, 231, 235, 0.6), transparent);
    margin: 0 60px;
  }
  
  &:last-child::after {
    display: none;
  }
`;

const MessageAvatar = styled(Avatar)`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #8a65d9, #6f42c1)' 
    : 'linear-gradient(135deg, #60a5fa, #3b82f6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin-top: 3px;
  border: 2px solid ${props => props.$isUser 
    ? 'rgba(111, 66, 193, 0.2)' 
    : 'rgba(59, 130, 246, 0.2)'};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .anticon {
    font-size: 20px;
  }
`;

const MessageBubble = styled.div`
  max-width: calc(100% - 52px);
  padding: 10px 14px;
  border-radius: 16px;
  line-height: 1.4;
  position: relative;
  color: ${props => props.isUser ? '#FFFFFF' : '#374151'};
  background: ${props => props.isUser 
    ? '#6f42c1' 
    : '#ffffff'};
  background-image: ${props => props.isUser 
    ? 'linear-gradient(135deg, #8a65d9, #6f42c1, #059669)' 
    : 'linear-gradient(135deg, #f0f9ff, #ffffff, #eef2ff)'};
  box-shadow: ${props => props.isUser 
    ? '0 8px 25px rgba(111, 66, 193, 0.3)' 
    : '0 8px 25px rgba(0, 0, 0, 0.08)'};
  overflow-wrap: break-word;
  white-space: pre-wrap;
  transition: all 0.3s ease;
  border: ${props => props.isUser 
    ? '1px solid rgba(111, 66, 193, 0.6)' 
    : '1px solid rgba(219, 234, 254, 1)'};

  &:hover {
    box-shadow: ${props => props.isUser 
      ? '0 12px 28px rgba(111, 66, 193, 0.35)' 
      : '0 12px 28px rgba(0, 0, 0, 0.12)'};
    transform: translateY(-3px);
  }
`;

const MessageContent = styled.div`
  color: ${props => props.isUser ? '#FFFFFF' : '#374151'};
  width: 100%;
  line-height: 1.2;
  font-size: 14px;
  letter-spacing: 0;
  
  a {
    color: ${props => props.isUser ? '#ffffff' : '#2563eb'};
    text-decoration: underline;
  }
  
  code {
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
  
  pre {
    margin: 6px 0;
    background: rgba(15, 23, 42, 0.95) !important;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(30, 41, 59, 0.5);
  }
`;

// SVG预览的Modal样式
const SVGPreviewModal = styled(Modal)`
  .ant-modal-content {
    background: #f9f9f9;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #6f42c1, #5a67d8);
    border-bottom: none;
    padding: 16px 24px;
  }
  
  .ant-modal-title {
    color: white;
    font-weight: 600;
  }
  
  .svg-preview-container {
    padding: 20px;
    background: white;
    border-radius: 8px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .svg-editor-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .editor-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .editor-toolbar {
    display: flex;
    gap: 8px;
    background: rgba(15,23,42,0.05);
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  .visual-editor {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
`;

const SVGEditor = styled(Input.TextArea)`
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  border-radius: 8px;
  min-height: 200px;
  resize: vertical;
  
  &:focus {
    border-color: #6f42c1;
    box-shadow: 0 0 0 2px rgba(111, 66, 193, 0.2);
  }
`;

// SVG预览按钮样式
const PreviewButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  font-size: 12px;
  height: 26px;
  background: linear-gradient(135deg, #6f42c1, #5a67d8);
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(111, 66, 193, 0.3);
    color: white;
  }
  
  .anticon {
    font-size: 12px;
    margin-right: 4px;
  }
`;

// 代码头部容器
const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: rgba(15,23,42,0.8);
  color: white;
  font-size: 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-family: 'SF Mono', 'Consolas', monospace;
  
  .code-language {
    opacity: 0.7;
  }
  
  .code-actions {
    display: flex;
    gap: 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.05)'};
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.8)' : '#6366f1'};
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.25)' : 'rgba(99, 102, 241, 0.1)'};
    transform: translateY(-1px);
  }

  .anticon {
    font-size: 14px;
  }
`;

const StyledMarkdown = styled(ReactMarkdown)`
  width: 100%;
  line-height: 1.2;
  
  p {
    margin: 0;
    padding: 0;
  }
  
  p + p {
    margin-top: 4px;
  }
  
  ul, ol {
    margin: 2px 0 2px 14px;
    padding-left: 0;
  }
  
  li {
    margin: 0;
    padding-left: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 10px 0 4px;
    color: ${props => props.isUser ? '#ffffff' : '#111827'};
    font-weight: 600;
  }
  
  h1 {
    font-size: 1.5em;
  }
  
  h2 {
    font-size: 1.3em;
  }
  
  h3 {
    font-size: 1.2em;
  }
  
  blockquote {
    margin: 6px 0;
    padding-left: 12px;
    border-left: 3px solid ${props => props.isUser ? 'rgba(255, 255, 255, 0.4)' : '#8b5cf6'};
    color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.8)' : '#6366f1'};
  }
  
  a {
    color: ${props => props.isUser ? '#ffffff' : '#2563eb'};
    text-decoration: underline;
  }
  
  code {
    background: ${props => props.isUser ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.07)'};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 0.9em;
  }
  
  pre {
    margin: 6px 0;
    padding: 10px;
    background: rgba(15,23,42,0.95) !important;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid rgba(30,41,59,0.3);
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 6px 0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    border: 1px solid ${props => props.isUser ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.1)'};
  }
  
  th {
    background: ${props => props.isUser ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'};
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background: ${props => props.isUser ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.03)'};
  }
`;

const Message = ({ message, handleCopy, handleExport, handleExportPDF, handleExportMarkdown }) => {
  const contentRef = useRef(null);
  const svgEditorRef = useRef(null);
  const selectedElementRef = useRef(null);
  
  // 状态管理
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewSVG, setPreviewSVG] = useState('');
  const [editedSVG, setEditedSVG] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isVisualMode, setIsVisualMode] = useState(true);
  const [originalSVG, setOriginalSVG] = useState('');
  const [currentCodeBlock, setCurrentCodeBlock] = useState(null);
  const [scale, setScale] = useState(1);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('visual');

  // 获取消息内容
  const getContent = () => {
    if (contentRef.current) {
      return contentRef.current.innerHTML;
    }
    return '';
  };

  // 判断是否为SVG代码的函数
  const isSVGCode = (code) => {
    const lowerCode = code.toLowerCase();
    return lowerCode.includes('<svg') && lowerCode.includes('</svg>');
  };

  // 添加SVG预览处理函数
  const handlePreviewSVG = (svgCode, codeNode) => {
    setPreviewSVG(svgCode);
    setEditedSVG(svgCode);
    setOriginalSVG(svgCode);
    setCurrentCodeBlock(codeNode);
    setIsEditing(true);
    setIsVisualMode(true);
    setActiveTab('visual');
    setPreviewVisible(true);
    setScale(1);
  };

  // 处理编辑模式切换
  const handleSwitchEditMode = () => {
    setIsVisualMode(!isVisualMode);
    setActiveTab(isVisualMode ? 'code' : 'visual');
  };

  // 处理SVG代码变更
  const handleSVGChange = (e) => {
    setEditedSVG(e.target.value);
  };

  // 恢复原始SVG
  const handleResetSVG = () => {
    setEditedSVG(originalSVG);
    setPreviewSVG(originalSVG);
    setScale(1);
    setSelectedElement(null);
  };

  // 缩放控制
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  // 可视化编辑相关函数
  useEffect(() => {
    if (previewVisible && isVisualMode && svgEditorRef.current) {
      // 不再初始化拖拽功能和键盘事件监听
      // const cleanup = initSVGElements();
      
      // 不再添加键盘事件监听
      // document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        // if (cleanup) cleanup();
        // document.removeEventListener('keydown', handleKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewVisible, isVisualMode, previewSVG, scale]);
  
  // 初始化SVG元素 - 移除拖拽功能
  const initSVGElements = () => {
    if (!svgEditorRef.current) return;
    
    // 获取SVG容器
    const svgContainer = svgEditorRef.current;
    const svgElement = svgContainer.querySelector('svg');
    
    if (!svgElement) {
      console.error('未找到SVG元素');
      return;
    }
    
    // 设置SVG的样式
    svgElement.style.overflow = 'visible';
    
    // 不再添加拖拽功能
    return () => {
      // 清理函数为空
    };
  };
  
  // 下载SVG图片
  const handleDownloadSVG = () => {
    if (!svgEditorRef.current) return;
    
    try {
      // 复制当前的SVG元素，以避免修改原始元素
      const svgElement = svgEditorRef.current.querySelector('svg');
      if (!svgElement) {
        console.error('未找到SVG元素');
        Modal.error({ title: '导出失败', content: '未找到SVG元素' });
        return;
      }
      
      // 克隆SVG元素
      const svgClone = svgElement.cloneNode(true);
      
      // 将SVG转换为字符串
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // 创建Blob和下载链接
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-svg.svg';
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      try {
        message.success('SVG图片已下载');
      } catch (msgErr) {
        console.log('SVG图片已成功下载');
        Modal.success({ title: '下载成功', content: 'SVG图片已下载' });
      }
    } catch (error) {
      console.error('下载SVG失败:', error);
      try {
        message.error('下载失败，请重试');
      } catch (msgErr) {
        Modal.error({ title: '导出失败', content: '下载失败，请重试' });
      }
    }
  };

  // 下载PNG图片
  const handleDownloadPNG = () => {
    if (!svgEditorRef.current) return;
    
    try {
      // 获取SVG元素
      const svgElement = svgEditorRef.current.querySelector('svg');
      if (!svgElement) {
        console.error('未找到SVG元素');
        Modal.error({ title: '导出失败', content: '未找到SVG元素' });
        return;
      }
      
      // 克隆SVG元素并准备导出
      const svgClone = svgElement.cloneNode(true);
      
      // 获取SVG的尺寸
      const svgWidth = svgClone.getAttribute('width') || 800;
      const svgHeight = svgClone.getAttribute('height') || 600;
      
      // 确保SVG有合适的尺寸
      if (!svgClone.getAttribute('width')) svgClone.setAttribute('width', svgWidth);
      if (!svgClone.getAttribute('height')) svgClone.setAttribute('height', svgHeight);
      
      // 将SVG转换为字符串并创建Base64编码
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob);
      
      // 创建Image对象
      const img = new Image();
      img.onload = function() {
        try {
          // 创建Canvas元素
          const canvas = document.createElement('canvas');
          canvas.width = img.width || parseInt(svgWidth);
          canvas.height = img.height || parseInt(svgHeight);
          
          // 在Canvas上绘制SVG
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          // 将Canvas转换为PNG
          const pngUrl = canvas.toDataURL('image/png');
          
          // 创建下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'edited-svg.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          // 清理
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
          
          try {
            message.success('PNG图片已下载');
          } catch (msgErr) {
            console.log('PNG图片已成功下载');
            Modal.success({ title: '下载成功', content: 'PNG图片已下载' });
          }
        } catch (err) {
          console.error('PNG导出错误:', err);
          try {
            message.error('PNG导出失败，请重试');
          } catch (msgErr) {
            console.error('消息显示失败:', msgErr);
            Modal.error({ title: '导出失败', content: 'PNG导出失败，请重试' });
          }
        }
      };
      
      // 图像加载失败处理
      img.onerror = function() {
        console.error('图像加载失败');
        try {
          message.error('图像加载失败，请重试');
        } catch (msgErr) {
          Modal.error({ title: '导出失败', content: '图像加载失败，请重试' });
        }
        URL.revokeObjectURL(url);
      };
      
      // 设置图像源
      img.src = url;
    } catch (error) {
      console.error('下载PNG失败:', error);
      try {
        message.error('下载失败，请重试');
      } catch (msgErr) {
        Modal.error({ title: '导出失败', content: '下载失败，请重试' });
      }
    }
  };

  // 保存编辑后的SVG
  const handleSaveSVG = () => {
    if (svgEditorRef.current && isVisualMode) {
      // 在可视化模式下，从DOM中获取更新后的SVG
      const svgElement = svgEditorRef.current.querySelector('svg');
      if (svgElement) {
        // 获取SVG字符串
        const updatedSVG = new XMLSerializer().serializeToString(svgElement);
        setEditedSVG(updatedSVG);
        setPreviewSVG(updatedSVG);
      }
    }
    
    // 如果有太多更改，可以提示保存成功
    if (isVisualMode) {
      try {
      message.success('SVG编辑已保存！');
      } catch (msgErr) {
        console.log("SVG编辑已保存！");
        Modal.success({ title: "保存成功", content: "SVG编辑已保存！" });
      }
    } else if (editedSVG !== originalSVG) {
      setPreviewSVG(editedSVG);
      try {
        message.success('SVG代码已更新！');
      } catch (msgErr) {
        console.log("SVG代码已更新！");
        Modal.success({ title: "保存成功", content: "SVG代码已更新！" });
      }
    }
    setIsEditing(false);
  };

  return (
    <MessageWrapper>
      <MessageAvatar $isUser={message.isUser}>
        {message.isUser ? <UserOutlined /> : <RobotOutlined />}
      </MessageAvatar>
      <MessageBubble isUser={message.isUser}>
        <MessageContent isUser={message.isUser}>
          <div ref={contentRef}>
            <StyledMarkdown
              isUser={message.isUser}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeContent = String(children).replace(/\n$/, '');
                  
                  // 检查是否为SVG代码
                  const isSvg = !inline && (match?.[1] === 'svg' || match?.[1] === 'html' || match?.[1] === 'xml') && isSVGCode(codeContent);
                  
                  return !inline && match ? (
                    <div style={{marginBottom: '10px'}}>
                      {isSvg && (
                        <CodeHeader>
                          <span className="code-language">{match[1].toUpperCase()} SVG</span>
                          <div className="code-actions">
                            <PreviewButton
                              type="primary"
                              size="small"
                              onClick={() => handlePreviewSVG(codeContent, node)}
                              icon={<EyeOutlined />}
                            >
                              预览SVG
                            </PreviewButton>
                          </div>
                        </CodeHeader>
                      )}
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {codeContent}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img({node, ...props}) {
                  // 处理图片显示
                  return (
                    <img 
                      {...props}
                      style={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        margin: '10px 0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      alt={props.alt || ''}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png'; // 设置一个占位图像
                      }}
                    />
                  );
                }
              }}
            >
              {message.content}
            </StyledMarkdown>
          </div>
          {!message.isUser && (
            <ActionButtons>
              <ActionButton isUser={message.isUser} onClick={() => handleCopy(getContent())}>
                <CopyOutlined /> 复制
              </ActionButton>
              <ActionButton isUser={message.isUser} onClick={() => handleExport(getContent())}>
                <DownloadOutlined /> 导出
              </ActionButton>
              <ActionButton isUser={message.isUser} onClick={() => handleExportPDF(getContent())}>
                <FilePdfOutlined /> PDF
              </ActionButton>
              <ActionButton isUser={message.isUser} onClick={() => handleExportMarkdown(getContent())}>
                <FileMarkdownOutlined /> MD
              </ActionButton>
            </ActionButtons>
          )}
        </MessageContent>
      </MessageBubble>
      
      {/* SVG预览Modal */}
      <SVGPreviewModal
        title={isEditing ? (isVisualMode ? "可视化编辑SVG" : "编辑SVG代码") : "SVG图像预览"}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={
          isEditing ? 
          [
            <Button key="reset" icon={<UndoOutlined />} onClick={handleResetSVG}>
              重置
            </Button>,
            <Button key="cancel" onClick={() => setIsEditing(false)}>
              取消
            </Button>,
            <Button key="downloadSVG" icon={<DownloadOutlined />} onClick={handleDownloadSVG}>
              下载SVG
            </Button>,
            <Button key="downloadPNG" icon={<PictureOutlined />} onClick={handleDownloadPNG}>
              下载PNG
            </Button>,
            <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSaveSVG}>
              保存
            </Button>
          ] : 
          [
            <Button key="close" onClick={() => setPreviewVisible(false)}>
              关闭
            </Button>,
            <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
              编辑SVG
            </Button>
          ]
        }
        width={800}
      >
        <div className="svg-editor-container">
          {isEditing && (
            <div className="editor-toolbar">
              <Tooltip title="切换编辑模式">
                <Button 
                  icon={isVisualMode ? <EditOutlined /> : <DragOutlined />}
                  onClick={handleSwitchEditMode}
                >
                  {isVisualMode ? "代码编辑" : "可视化编辑"}
                </Button>
              </Tooltip>
              
              {isVisualMode && (
                <>
                  <Tooltip title="放大">
                    <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} />
                  </Tooltip>
                  <Tooltip title="缩小">
                    <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
                  </Tooltip>
                  <Tooltip title="重置缩放">
                    <Button icon={<SyncOutlined />} onClick={handleZoomReset} />
                  </Tooltip>
                  <span style={{marginLeft: 'auto', color: '#666'}}>
                    提示: 点击元素可选中查看
                  </span>
                </>
              )}
            </div>
          )}
          
          {isVisualMode ? (
            <div 
              className="svg-preview-container" 
              ref={svgEditorRef}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s'
              }}
              dangerouslySetInnerHTML={{ __html: previewSVG }} 
            />
          ) : (
            <>
              <div className="svg-preview-container" dangerouslySetInnerHTML={{ __html: editedSVG }} />
              <SVGEditor 
                value={editedSVG}
                onChange={handleSVGChange}
                autoSize={{ minRows: 10, maxRows: 20 }}
                placeholder="在此编辑SVG代码，预览区域会实时更新"
              />
            </>
          )}
        </div>
      </SVGPreviewModal>
    </MessageWrapper>
  );
};

export default Message; 