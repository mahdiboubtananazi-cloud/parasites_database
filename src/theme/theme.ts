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
    //  الترتيب مهم: Inter أولاً (للإنجليزية) ثم Cairo (للعربية)
    fontFamily: '"Inter", "Cairo", "Roboto", sans-serif',
    h1: { fontWeight: 700, color: colors.text.primary },
    h2: { fontWeight: 700, color: colors.text.primary },
    h3: { fontWeight: 600, color: colors.text.primary },
    h4: { fontWeight: 600, color: colors.text.primary },
    h5: { fontWeight: 600, color: colors.text.primary },
    h6: { fontWeight: 600, color: colors.text.primary },
    button: {
      fontWeight: 600,
      letterSpacing: 0.5,
      fontFamily: '"Cairo", "Inter", sans-serif', // الأزرار نفضلها بـ Cairo غالباً
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
          padding: '10px 24px',
          borderRadius: '10px',
          boxShadow: 'none',
        },
        containedPrimary: {
          background: gradients.primary,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl', //  توسيع العرض ليكون احترافياً على الشاشات الكبيرة
      }
    }
  },
});

theme = responsiveFontSizes(theme);

export default theme;
