import React from 'react';
import {
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Paper,
  Tooltip,
} from '@mui/material';
import { Microscope, Menu as MenuIcon, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const links = [
    { label: t('nav_home') || 'Home', path: '/' },
    { label: t('nav_archive') || 'Archive', path: '/archive' },
    { label: t('nav_add') || 'Add Sample', path: '/add' },
    { label: t('nav_stats') || 'Statistics', path: '/statistics' },
    { label: t('nav_review') || 'Review', path: '/review' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        pt: 2,
        pb: 1,
        px: 2,
        // إزالة الخلفية المتدرجة الغامقة العريضة، وجعلها شفافة تماماً
        background: 'transparent',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          borderRadius: 999,
          px: 2.5,
          py: 0.8,
          display: 'flex',
          alignItems: 'center',
          // زجاجي فاتح (أبيض شفاف) ليتماشى مع الخلفية الفاتحة
          bgcolor: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(11, 43, 38, 0.08)', // حدود خضراء خفيفة جداً
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(11, 43, 38, 0.08)', // ظل أخضر خفيف جداً
        }}
      >
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              p: 0.8,
              borderRadius: '999px',
              // اللوغو بالأخضر الغامق ليكون بارزاً
              background: colors.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Microscope size={18} color="#fff" />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop links */}
        {!isMobile && (
          <Stack direction="row" spacing={1} alignItems="center">
            {links.map((link) => (
              <Button
                key={link.path}
                onClick={() => navigate(link.path)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  px: 2,
                  py: 0.5,
                  borderRadius: 999,
                  fontWeight: isActive(link.path) ? 700 : 500,
                  // الروابط النشطة خضراء غامقة، وغير النشطة رمادية
                  color: isActive(link.path) ? colors.primary.main : colors.text.secondary,
                  backgroundColor: isActive(link.path)
                    ? 'rgba(11, 43, 38, 0.08)' // خلفية خفيفة جداً عند التفعيل
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(11, 43, 38, 0.05)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}

            {/* Language Toggle */}
            <Tooltip title={t('nav_toggle_lang') || 'Toggle Language'} arrow>
              <IconButton
                onClick={toggleLanguage}
                sx={{
                  borderRadius: 999,
                  p: 0.6,
                  color: colors.text.secondary,
                  '&:hover': {
                    backgroundColor: 'rgba(11, 43, 38, 0.05)',
                    color: colors.primary.main,
                  },
                }}
              >
                <Globe size={18} />
              </IconButton>
            </Tooltip>

            {/* Login Button */}
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                fontSize: '0.85rem',
                px: 2.5,
                py: 0.6,
                ml: 1,
                // زر الدخول أخضر غامق قوي
                bgcolor: colors.primary.main,
                color: '#fff',
                boxShadow: '0 4px 12px rgba(11, 43, 38, 0.2)',
                '&:hover': {
                  bgcolor: colors.primary.light,
                  boxShadow: '0 6px 16px rgba(11, 43, 38, 0.3)',
                },
              }}
            >
              {t('btn_login') || 'Login'}
            </Button>
          </Stack>
        )}

        {/* Mobile menu */}
        {isMobile && (
          <Stack direction="row" spacing={1} alignItems="center">
             <Tooltip title={t('nav_toggle_lang') || 'Toggle Language'} arrow>
              <IconButton
                onClick={toggleLanguage}
                sx={{
                  borderRadius: 999,
                  color: colors.text.secondary,
                }}
              >
                <Globe size={20} />
              </IconButton>
            </Tooltip>
            <IconButton edge="end" sx={{ color: colors.primary.main }}>
              <MenuIcon size={22} />
            </IconButton>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default Navbar;
