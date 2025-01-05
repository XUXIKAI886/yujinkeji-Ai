import React from 'react';
import styled from 'styled-components';
import { Button, Result } from 'antd';
import { logService, ErrorType } from '../services/logService';

const ErrorContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000428;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 记录错误
    logService.error(
      'React component error',
      error,
      ErrorType.UNKNOWN_ERROR
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 在开发环境下显示详细错误信息
      if (process.env.NODE_ENV === 'development') {
        return (
          <ErrorContainer>
            <Result
              status="error"
              title="应用程序错误"
              subTitle={this.state.error?.message || '发生了一个错误'}
              extra={[
                <Button key="reload" type="primary" onClick={this.handleReload}>
                  重新加载
                </Button>,
                <Button key="home" onClick={this.handleGoHome}>
                  返回首页
                </Button>
              ]}
            >
              <div style={{ textAlign: 'left', marginTop: 20 }}>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </details>
              </div>
            </Result>
          </ErrorContainer>
        );
      }

      // 在生产环境下显示友好的错误提示
      return (
        <ErrorContainer>
          <Result
            status="error"
            title="很抱歉，出现了一些问题"
            subTitle="我们正在努力修复，请稍后再试"
            extra={[
              <Button key="reload" type="primary" onClick={this.handleReload}>
                重新加载
              </Button>,
              <Button key="home" onClick={this.handleGoHome}>
                返回首页
              </Button>
            ]}
          />
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 