import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    overflow-x: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
    background: none;
  }

  // Ant Design 组件样式覆盖
  .ant-btn {
    border-radius: 8px;
    height: 40px;
    padding: 0 24px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .ant-input {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover, &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}20`};
    }
  }

  .ant-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }

  .ant-menu {
    background: transparent;
    border: none;

    .ant-menu-item {
      border-radius: 8px;
      margin: 4px 8px;

      &:hover {
        color: ${({ theme }) => theme.colors.primary};
        background: ${({ theme }) => `${theme.colors.primary}10`};
      }

      &.ant-menu-item-selected {
        background: ${({ theme }) => `${theme.colors.primary}20`};
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  .ant-layout {
    background: ${({ theme }) => theme.colors.background};

    .ant-layout-sider {
      background: ${({ theme }) => theme.colors.surface};
      border-right: 1px solid ${({ theme }) => theme.colors.border};
    }

    .ant-layout-header {
      background: ${({ theme }) => theme.colors.surface};
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
  }

  // 平滑滚动
  html {
    scroll-behavior: smooth;
  }

  // 自定义滚动条
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `${theme.colors.primary}40`};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => `${theme.colors.primary}60`};
    }
  }

  // 选中文本样式
  ::selection {
    background: ${({ theme }) => `${theme.colors.primary}40`};
    color: ${({ theme }) => theme.colors.text};
  }

  // 页面过渡动画
  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;
  }

  .page-transition-exit {
    opacity: 1;
    transform: translateY(0);
  }

  .page-transition-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s, transform 0.3s;
  }
`;

export default GlobalStyles; 