import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { colors, gradients } from './colors';

//  دالة ديناميكية تُرجع Theme حسب اللغة
export const getTheme = (language: string = 'ar') => {
  const isRTL = language === 'ar';

  let theme = createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    palette: {
      mode: 'light',
      primary: colors.primary,
      secondary: colors.secondary,
      error: colors.error,
      warning: colors.warning,
      success: colors.success,
      info: colors.info,
      background: colors.background,
      text: colors.text,
    },
    typography: {
      fontFamily: isRTL 
        ? '"Cairo", "Roboto", sans-serif'
        : '"Inter", "Roboto", sans-serif',
      h1: {
        fontWeight: 700,
        color: colors.text.primary,
        fontSize: '2.5rem',
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 700,
        color: colors.text.primary,
        fontSize: '2rem',
        letterSpacing: '-0.3px',
      },
      h3: {
        fontWeight: 600,
        color: colors.text.primary,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 600,
        color: colors.primary.main,
        fontSize: '1.25rem',
      },
      h5: {
        fontWeight: 600,
        color: colors.text.primary,
      },
      h6: {
        fontWeight: 600,
        color: colors.text.secondary,
      },
      body1: {
        color: colors.text.primary,
        lineHeight: 1.7,
        fontSize: '0.95rem',
      },
      body2: {
        color: colors.text.secondary,
        lineHeight: 1.6,
        fontSize: '0.9rem',
      },
      button: {
        fontWeight: 600,
        letterSpacing: 0.3,
        fontFamily: isRTL ? '"Cairo", sans-serif' : '"Inter", sans-serif',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            boxShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
              transform: 'translateY(-2px)',
            },
          },
          containedPrimary: {
            background: gradients.primary,
            color: colors.primary.contrastText,
            '&:hover': {
              background: 'linear-gradient(135deg, #051F20 0%, #0B2B26 100%)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          outlined: {
            borderColor: colors.primary.main,
            color: colors.primary.contrastText,
            '&:hover': {
              backgroundColor: `${colors.primary.light}40`,
              borderColor: colors.primary.light,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            border: `1px solid ${colors.primary.lighter}40`,
            backgroundColor: colors.background.paper,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              borderColor: colors.primary.light,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.primary.dark,
            color: colors.text.primary,
            borderRight: `1px solid ${colors.primary.main}40`,
          },
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: 'lg',
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: colors.background.paper,
              '& fieldset': {
                borderColor: `${colors.primary.lighter}60`,
              },
              '&:hover fieldset': {
                borderColor: colors.primary.light,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary.main,
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              color: colors.text.secondary,
              '&.Mui-focused': {
                color: colors.primary.main,
              },
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: `${colors.primary.lighter}30`,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
};

//  Theme افتراضي للعربية
const theme = getTheme('ar');
export default theme;
