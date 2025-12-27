import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  Microscope,
  Menu as MenuIcon,
  Globe,
  Home,
  Archive,
  PlusCircle,
  BarChart2,
  CheckSquare,
  X,
  LogIn,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: t('nav_home') || 'الرئيسية', path: '/', icon: <Home size={20} /> },
    { label: t('nav_archive') || 'الأرشيف', path: '/archive', icon: <Archive size={20} /> },
    { label: t('nav_add') || 'إضافة عينة', path: '/add', icon: <PlusCircle size={20} /> },
    { label: t('nav_stats') || 'الإحصائيات', path: '/statistics', icon: <BarChart2 size={20} /> },
    { label: t('nav_review') || 'المراجعة', path: '/review', icon: <CheckSquare size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* شريط علوي شفاف تماماً */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          pt: 1.5,
          pb: 1,
          px: 2,
          background: 'transparent',
        }}
      >
        <Box
          sx={{
            maxWidth: isMobile ? '100%' : 850,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo + عنوان بسيط، بدون خلفية ثقيلة */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Paper
              elevation={2}
              sx={{
                p: 0.7,
                borderRadius: '50%',
                bgcolor: colors.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Microscope size={18} color="#fff" />
            </Paper>
            {!isMobile && (
              <Box
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: colors.primary.main,
                  letterSpacing: 0.5,
                }}
              >
                Parasites DB
              </Box>
            )}
          </Box>

          {/* روابط الديسكتوب فقط (الشريط في الديسكتوب فقط) */}
          {!isMobile && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {links.map((link) => (
                <Button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    px: 2,
                    py: 0.6,
                    fontSize: '0.9rem',
                    fontWeight: isActive(link.path) ? 700 : 500,
                    color: isActive(link.path)
                      ? colors.primary.main
                      : colors.text.secondary,
                    backgroundColor: isActive(link.path)
                      ? 'rgba(11, 43, 38, 0.06)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(11, 43, 38, 0.04)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {/* تغيير اللغة */}
              <Tooltip title="تغيير اللغة">
                <IconButton size="small" onClick={toggleLanguage}>
                  <Globe size={18} color={colors.text.secondary} />
                </IconButton>
              </Tooltip>

              {/* زر الدخول */}
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/login')}
                startIcon={<LogIn size={16} />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  px: 2.4,
                  bgcolor: colors.primary.main,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: colors.primary.dark,
                    boxShadow: '0 4px 10px rgba(11, 43, 38, 0.25)',
                  },
                }}
              >
                {t('btn_login') || 'دخول'}
              </Button>
            </Stack>
          )}

          {/* في الموبايل: زر واحد فقط، بدون شريط كامل */}
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: colors.primary.main,
                borderRadius: 999,
                bgcolor: 'rgba(11, 43, 38, 0.06)',
                '&:hover': { bgcolor: 'rgba(11, 43, 38, 0.12)' },
              }}
            >
              <MenuIcon size={22} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Drawer للموبايل بخلفية خضراء فاتحة ومسافات مريحة */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 290,
            bgcolor: '#E7F4EC', // أخضر فاتح مريح
            borderRadius:
              i18n.language === 'ar' ? '20px 0 0 20px' : '0 20px 20px 0',
          },
        }}
      >
        {/* رأس القائمة */}
        <Box
          sx={{
            p: 2.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                p: 0.8,
                borderRadius: '50%',
                bgcolor: colors.primary.main,
                display: 'flex',
                color: '#fff',
              }}
            >
              <Microscope size={20} />
            </Box>
            <Box
              sx={{
                fontWeight: 800,
                fontSize: '1rem',
                color: colors.primary.main,
              }}
            >
              Parasites DB
            </Box>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <X size={20} />
          </IconButton>
        </Box>

        <Divider />

        {/* روابط التنقل بقوائم مرتّبة */}
        <List sx={{ px: 1.5, py: 2 }}>
          {links.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path);
                  handleDrawerToggle();
                }}
                selected={isActive(link.path)}
                sx={{
                  borderRadius: 2.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(11, 43, 38, 0.10)',
                    color: colors.primary.main,
                    '&:hover': { bgcolor: 'rgba(11, 43, 38, 0.16)' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(link.path)
                      ? colors.primary.main
                      : colors.text.secondary,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* أسفل الدرج: تغيير اللغة + تسجيل الدخول */}
        <Box sx={{ mt: 'auto', p: 2.2 }}>
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              onClick={toggleLanguage}
              startIcon={<Globe size={18} />}
              sx={{
                justifyContent: 'flex-start',
                borderRadius: 2.5,
                borderColor: 'rgba(11, 43, 38, 0.25)',
                color: colors.primary.main,
                bgcolor: 'rgba(255,255,255,0.6)',
              }}
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                navigate('/login');
                handleDrawerToggle();
              }}
              startIcon={<LogIn size={18} />}
              sx={{
                borderRadius: 2.5,
                bgcolor: colors.primary.main,
                boxShadow: 'none',
              }}
            >
              {t('btn_login') || 'تسجيل الدخول'}
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
