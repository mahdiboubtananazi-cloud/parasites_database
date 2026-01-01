import React, { useState, useEffect } from 'react';
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
  Menu,
  MenuItem,
  Avatar,
  Typography,
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
  LogOut,
  User,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  // Auth
  const { user, logout } = useAuth();

  // تتبع التمرير
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: t('nav_home'), path: '/', icon: <Home size={20} /> },
    { label: t('nav_archive'), path: '/archive', icon: <Archive size={20} /> },
    { label: t('nav_add_parasite'), path: '/add', icon: <PlusCircle size={20} /> },
    { label: t('nav_statistics'), path: '/statistics', icon: <BarChart2 size={20} /> },
    { label: t('nav_review'), path: '/review', icon: <CheckSquare size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  // تغيير اللغة بين العربية والفرنسية فقط
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    setUserAnchor(null);
    navigate('/');
  };

  return (
    <>
      {/* شريط علوي مع خلفية عند التمرير */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          pt: 1.5,
          pb: 1,
          px: 2,
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? `1px solid ${colors.primary.lighter}30` : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          sx={{
            maxWidth: isMobile ? '100%' : 900,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' },
            }}
            onClick={() => navigate('/')}
          >
            <Paper
              elevation={scrolled ? 2 : 0}
              sx={{
                p: 0.8,
                borderRadius: '50%',
                bgcolor: colors.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Microscope size={20} color="#fff" />
            </Paper>
            {!isMobile && (
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: colors.primary.main,
                }}
              >
                {t('app_title')}
              </Typography>
            )}
          </Box>

          {/* روابط الديسكتوب */}
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
                    py: 0.7,
                    fontSize: '0.88rem',
                    fontWeight: isActive(link.path) ? 700 : 500,
                    color: isActive(link.path) ? colors.primary.main : colors.text.secondary,
                    backgroundColor: isActive(link.path) ? `${colors.primary.main}10` : 'transparent',
                    '&:hover': { backgroundColor: `${colors.primary.main}08` },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {/* زر تغيير اللغة */}
              <Tooltip title={t('nav_language')}>
                <Button
                  size="small"
                  onClick={toggleLanguage}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 999,
                    color: colors.text.secondary,
                    fontSize: '0.85rem',
                    gap: 1,
                    '&:hover': { bgcolor: `${colors.primary.main}08` },
                  }}
                >
                  <Globe size={18} />
                  <span>{i18n.language === 'ar' ? 'FR' : 'ع'}</span>
                </Button>
              </Tooltip>

              {/* زر المستخدم أو تسجيل الدخول */}
              {user ? (
                <>
                  <Button
                    onClick={(e) => setUserAnchor(e.currentTarget)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 999,
                      px: 2,
                      py: 0.6,
                      gap: 1,
                      color: colors.primary.main,
                      bgcolor: `${colors.primary.main}10`,
                      '&:hover': { bgcolor: `${colors.primary.main}15` },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 26,
                        height: 26,
                        bgcolor: colors.primary.main,
                        fontSize: '0.75rem',
                      }}
                    >
                      {user.name?.charAt(0) || <User size={14} />}
                    </Avatar>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {user.name?.split(' ')[0] || t('nav_account')}
                    </Typography>
                  </Button>
                  <Menu
                    anchorEl={userAnchor}
                    open={Boolean(userAnchor)}
                    onClose={() => setUserAnchor(null)}
                    PaperProps={{ sx: { borderRadius: 2, minWidth: 160, mt: 1 } }}
                  >
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ gap: 1.5, color: '#ef4444', fontSize: '0.9rem' }}
                    >
                      <LogOut size={18} />
                      {t('nav_logout', { defaultValue: 'تسجيل الخروج' })}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    px: 2.5,
                    py: 0.7,
                    gap: 1,
                    bgcolor: colors.primary.main,
                    boxShadow: 'none',
                    fontSize: '0.85rem',
                    '&:hover': {
                      bgcolor: colors.primary.dark,
                      boxShadow: `0 4px 12px ${colors.primary.main}30`,
                    },
                  }}
                >
                  <LogIn size={16} />
                  <span>{t('nav_login')}</span>
                </Button>
              )}
            </Stack>
          )}

          {/* زر الموبايل */}
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: colors.primary.main,
                borderRadius: 999,
                bgcolor: scrolled ? `${colors.primary.main}10` : 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: `${colors.primary.main}15` },
              }}
            >
              <MenuIcon size={22} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Drawer للموبايل */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: '#f8faf9',
            borderRadius: i18n.language === 'ar' ? '20px 0 0 20px' : '0 20px 20px 0',
          },
        }}
      >
        {/* رأس القائمة */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.primary.lighter}30`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: colors.primary.main,
                display: 'flex',
                color: '#fff',
              }}
            >
              <Microscope size={22} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: colors.primary.main }}>
              {t('app_title')}
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} size="small">
            <X size={20} color={colors.text.secondary} />
          </IconButton>
        </Box>

        {/* معلومات المستخدم */}
        {user && (
          <Box
            sx={{
              p: 2.5,
              bgcolor: `${colors.primary.main}08`,
              borderBottom: `1px solid ${colors.primary.lighter}30`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: colors.primary.main,
                  fontSize: '1rem',
                }}
              >
                {user.name?.charAt(0) || <User size={20} />}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: colors.primary.main }}>
                  {user.name || t('nav_account')}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* روابط التنقل */}
        <List sx={{ px: 2, py: 2, flex: 1 }}>
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
                  py: 1.2,
                  '&.Mui-selected': {
                    bgcolor: `${colors.primary.main}12`,
                    color: colors.primary.main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: isActive(link.path) ? colors.primary.main : colors.text.secondary,
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

        {/* أسفل الدرج */}
        <Box sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            {/* تغيير اللغة */}
            <Button
              fullWidth
              variant="outlined"
              onClick={toggleLanguage}
              startIcon={<Globe size={18} />}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                borderColor: colors.primary.lighter,
                color: colors.primary.main,
                justifyContent: 'flex-start',
                gap: 1,
              }}
            >
              {i18n.language === 'ar' ? 'Français' : 'العربية'}
            </Button>

            {/* تسجيل الدخول / الخروج */}
            {user ? (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  handleLogout();
                  handleDrawerToggle();
                }}
                startIcon={<LogOut size={18} />}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': { bgcolor: '#fef2f2' },
                }}
              >
                {t('nav_logout', { defaultValue: 'تسجيل الخروج' })}
              </Button>
            ) : (
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
                  py: 1.2,
                  bgcolor: colors.primary.main,
                  boxShadow: 'none',
                }}
              >
                {t('nav_login')}
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;