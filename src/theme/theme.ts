import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { universityColors, gradients, shadows } from './colors';

// إعدادات الخطوط
const fontFamily = {
  arabic: '"Cairo", "Arial", sans-serif',
  english: '"Inter", "Roboto", "Arial", sans-serif',
};

// إنشاء الثيم
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: universityColors.primary.main,
      light: universityColors.primary.light,
      dark: universityColors.primary.dark,
      contrastText: universityColors.primary.contrastText,
    },
    secondary: {
      main: universityColors.secondary.main,
      light: universityColors.secondary.light,
      dark: universityColors.secondary.dark,
      contrastText: universityColors.secondary.contrastText,
    },
    background: {
      default: universityColors.background.default,
      paper: universityColors.background.paper,
    },
    text: {
      primary: universityColors.text.primary,
      secondary: universityColors.text.secondary,
      disabled: universityColors.text.disabled,
    },
    success: {
      main: universityColors.success.main,
      light: universityColors.success.light,
      dark: universityColors.success.dark,
    },
    warning: {
      main: universityColors.warning.main,
      light: universityColors.warning.light,
      dark: universityColors.warning.dark,
    },
    error: {
      main: universityColors.error.main,
      light: universityColors.error.light,
      dark: universityColors.error.dark,
    },
    info: {
      main: universityColors.info.main,
      light: universityColors.info.light,
      dark: universityColors.info.dark,
    },
  },
  typography: {
    fontFamily: fontFamily.arabic,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    shadows.sm,
    shadows.md,
    shadows.lg,
    shadows.xl,
    ...Array(20).fill(shadows.lg),
  ] as ThemeOptions['shadows'],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: shadows.md,
          '&:hover': {
            boxShadow: shadows.lg,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: shadows.md,
          '&:hover': {
            boxShadow: shadows.lg,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.sm,
          background: gradients.primary,
        },
      },
    },
  },
});

// إضافة متغيرات مخصصة للثيم
declare module '@mui/material/styles' {
  interface Theme {
    gradients: typeof gradients;
    customShadows: typeof shadows;
  }
  interface ThemeOptions {
    gradients?: typeof gradients;
    customShadows?: typeof shadows;
  }
}

// إضافة المتغيرات المخصصة
const themeWithCustom = {
  ...theme,
  gradients,
  customShadows: shadows,
};

export default themeWithCustom;

