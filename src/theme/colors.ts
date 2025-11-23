import { green, red, orange, blue, grey } from '@mui/material/colors';

export const colors = {
  // الألوان الأساسية للمشروع (الهوية البصرية)
  primary: {
    main: '#0F62FE',
    light: '#4589ff',
    dark: '#0043ce',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  // إضافة الألوان القياسية لمنع الأخطاء (هذا هو سبب المشكلة)
  success: {
    main: green[600],
    light: green[400],
    dark: green[800],
    contrastText: '#ffffff',
  },
  error: {
    main: red[600],
    light: red[400],
    dark: red[900],
    contrastText: '#ffffff',
  },
  warning: {
    main: orange[500],
    light: orange[300],
    dark: orange[800],
    contrastText: '#ffffff',
  },
  info: {
    main: blue[500],
    light: blue[300],
    dark: blue[800],
    contrastText: '#ffffff',
  },
  grey: grey,
  green: green, // دعم الكود القديم الذي يطلب colors.green
  red: red,
  
  // الخلفيات والنصوص
  background: {
    default: '#F4F7FE',
    paper: '#ffffff',
  },
  text: {
    primary: '#1B254B',
    secondary: '#A3AED0',
  },
  action: {
    hover: 'rgba(15, 98, 254, 0.08)',
  }
};

export const gradients = {
  primary: 'linear-gradient(45deg, #0F62FE 0%, #4589ff 100%)',
  secondary: 'linear-gradient(45deg, #10b981 0%, #34d399 100%)',
  dark: 'linear-gradient(135deg, #1B254B 0%, #0F62FE 100%)',
};

// دعم الكود القديم
export const universityColors = {
  primary: colors.primary.main,
  secondary: colors.secondary.main,
  background: colors.background.default,
};
