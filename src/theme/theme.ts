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
      marginBottom: '1rem',
    },
    h2: { 
      fontWeight: 700, 
      color: colors.text.primary,
      fontSize: '2rem',
      marginBottom: '0.8rem',
    },
    h3: { 
      fontWeight: 600, 
      color: colors.text.primary,
      fontSize: '1.5rem',
    },
    h4: { 
      fontWeight: 600, 
      color: colors.text.primary,
      fontSize: '1.25rem',
    },
    h5: { 
      fontWeight: 600, 
      color: colors.text.primary,
    },
    h6: { 
      fontWeight: 600, 
      color: colors.text.primary,
    },
    body1: {
      color: colors.text.primary,
      lineHeight: 1.6,
    },
    body2: {
      color: colors.text.secondary,
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0.5,
      fontFamily: '"Cairo", "Inter", sans-serif',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 28px',
          borderRadius: '10px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(77, 93, 83, 0.15)',
          },
        },
        containedPrimary: {
          background: gradients.primary,
          color: '#ffffff',
          '&:hover': {
            background: `linear-gradient(135deg, #3a4541 0%, #5a8a6b 100%)`,
          },
        },
        containedSecondary: {
          background: gradients.secondary,
          '&:hover': {
            background: `linear-gradient(135deg, #8b7a3e 0%, #c9a961 100%)`,
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(77, 93, 83, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.primary.light}20`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(77, 93, 83, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.primary.main,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.primary.main,
          color: '#ffffff',
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
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
