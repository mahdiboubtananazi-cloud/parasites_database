import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { colors, gradients } from './colors';

let theme = createTheme({
  direction: 'rtl',
  palette: {
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
    fontFamily: '"Inter", "Cairo", "Roboto", sans-serif',
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
      fontFamily: '"Cairo", "Inter", sans-serif',
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
            boxShadow: '0 6px 16px rgba(58, 90, 64, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: gradients.primary,
          color: '#ffffff',
          '&:hover': {
            background: `linear-gradient(135deg, #2d4733 0%, #3a5a40 100%)`,
            boxShadow: '0 8px 20px rgba(58, 90, 64, 0.25)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedSecondary: {
          background: gradients.secondary,
          '&:hover': {
            background: `linear-gradient(135deg, #3a5a40 0%, #588157 100%)`,
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: `${colors.primary.light}10`,
            borderColor: colors.primary.light,
          },
        },
        outlinedSecondary: {
          borderColor: colors.secondary.main,
          color: colors.secondary.main,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(58, 90, 64, 0.06)',
          border: `1px solid ${colors.primary.lighter}40`,
          backgroundColor: colors.background.paper,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(58, 90, 64, 0.12)',
            borderColor: colors.primary.light,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: gradients.primary,
          boxShadow: '0 2px 12px rgba(58, 90, 64, 0.15)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.primary.dark,
          color: '#ffffff',
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
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: `${colors.primary.main}15`,
            color: colors.primary.main,
            '&:hover': {
              backgroundColor: `${colors.primary.main}25`,
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: `${colors.primary.main}15`,
          color: colors.primary.main,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
