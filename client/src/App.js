import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import { handleGlobalError } from './services/logService';

const App = () => {
  React.useEffect(() => {
    // 设置全局错误处理
    window.onerror = (message, source, lineno, colno, error) => {
      handleGlobalError(error || message);
      return false;
    };

    // 处理未捕获的Promise错误
    window.onunhandledrejection = (event) => {
      handleGlobalError(event.reason);
    };

    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
