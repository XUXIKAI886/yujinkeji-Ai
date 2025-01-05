export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
};

export const lightTheme = {
  colors: {
    primary: '#2271FF',
    primaryGradient: 'linear-gradient(135deg, #2271FF 0%, #4AC3FF 100%)',
    secondary: '#00C6FB',
    background: '#ffffff',
    backgroundGradient: 'linear-gradient(135deg, #F6F9FC 0%, #FFFFFF 100%)',
    surface: '#ffffff',
    text: '#1A1A1A',
    textSecondary: 'rgba(26, 26, 26, 0.7)',
    border: 'rgba(0, 0, 0, 0.1)',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30'
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.05)',
    md: '0 4px 16px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.15)',
    primary: '0 8px 24px rgba(34, 113, 255, 0.25)'
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  blur: {
    sm: 'blur(8px)',
    md: 'blur(16px)',
    lg: 'blur(24px)'
  },
  breakpoints
};

export const darkTheme = {
  colors: {
    primary: '#00c6fb',
    primaryGradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
    secondary: '#005bea',
    background: '#0F172A',
    backgroundGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    surface: 'rgba(30, 41, 59, 0.8)',
    surfaceHover: 'rgba(30, 41, 59, 0.95)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textTertiary: 'rgba(255, 255, 255, 0.65)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    glass: {
      background: 'rgba(15, 23, 42, 0.6)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 4px 16px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.4)',
    primary: '0 8px 24px rgba(0, 198, 251, 0.3)',
    glow: {
      sm: '0 0 8px',
      md: '0 0 16px',
      lg: '0 0 24px'
    }
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  blur: {
    sm: 'blur(8px)',
    md: 'blur(16px)',
    lg: 'blur(24px)'
  },
  breakpoints
};

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`
};

export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.9);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  float: `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `
}; 