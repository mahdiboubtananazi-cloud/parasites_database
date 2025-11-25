import { green, teal, grey, red, orange, blue } from '@mui/material/colors';

export const colors = {
  primary: {
    main: '#047857',    // Emerald 700 (يدوياً)
    light: '#34D399',   // Emerald 400
    dark: '#064E3B',    // Emerald 900
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#059669',    // Emerald 600
    light: '#6EE7B7',   // Emerald 300
    dark: '#065F46',    // Emerald 800
    contrastText: '#ffffff',
  },
  // إضافة الألوان القياسية لمنع الأخطاء
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
  green: green, 
  red: red,
  
  background: {
    default: '#F0FDF4', 
    paper: '#ffffff',
  },
  text: {
    primary: '#064E3B', 
    secondary: '#374151',
  },
  action: {
    hover: 'rgba(4, 120, 87, 0.08)',
  }
};

export const gradients = {
  primary: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
  secondary: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
  dark: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
};

// دعم الكود القديم
export const universityColors = {
  primary: colors.primary.main,
  secondary: colors.secondary.main,
  background: colors.background.default,
};
