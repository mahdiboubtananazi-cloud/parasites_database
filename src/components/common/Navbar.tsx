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
  ChevronDown,
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

  const { user, logout } = useAuth();

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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    setUserAnchor(null);
    navigate('/');
  };

  return (
    <>
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
            maxWidth: 1200,
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
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: colors.primary.main }}>
                {t('app_title')}
              </Typography>
            )}
          </Box>

          {/* Desktop Links */}
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
                    bgcolor: isActive(link.path) ? `${colors.primary.main}10` : 'transparent',
                    '&:hover': { bgcolor: `${colors.primary.main}08` },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', mx: 1 }} />

              <Tooltip title={t('nav_language')}>
                <IconButton onClick={toggleLanguage} size="small" sx={{ color: colors.text.secondary }}>
                  <Globe size={20} />
                  <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 700 }}>
                    {i18n.language === 'ar' ? 'FR' : 'AR'}
                  </Typography>
                </IconButton>
              </Tooltip>

              {user ? (
                <>
                  <Button
                    onClick={(e) => setUserAnchor(e.currentTarget)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 999,
                      pl: 0.5,
                      pr: 1.5,
                      py: 0.5,
                      ml: 1,
                      gap: 1,
                      border: `1px solid ${colors.primary.lighter}`,
                      '&:hover': { bgcolor: `${colors.primary.main}05`, borderColor: colors.primary.main },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary.main, fontSize: '0.85rem' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <ChevronDown size={16} color={colors.text.secondary} />
                  </Button>
                  <Menu
                    anchorEl={userAnchor}
                    open={Boolean(userAnchor)}
                    onClose={() => setUserAnchor(null)}
                    PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', gap: 1.5, mt: 0.5 }}>
                      <LogOut size={16} />
                      {t('nav_logout', { defaultValue: 'تسجيل خروج' })}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  startIcon={<LogIn size={16} />}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    bgcolor: colors.primary.main,
                    boxShadow: '0 4px 12px rgba(11, 43, 38, 0.2)',
                    '&:hover': { bgcolor: colors.primary.dark, boxShadow: '0 6px 16px rgba(11, 43, 38, 0.3)' },
                  }}
                >
                  {t('nav_login')}
                </Button>
              )}
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ color: colors.primary.main }}>
              <MenuIcon size={24} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: { width: 280, bgcolor: '#fafcfb', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Paper sx={{ p: 1, borderRadius: '50%', bgcolor: colors.primary.main, display: 'flex' }}>
              <Microscope size={20} color="#fff" />
            </Paper>
            <Typography variant="h6" fontWeight={800} color={colors.primary.main}>
              {t('app_title')}
            </Typography>
          </Stack>
          <IconButton onClick={handleDrawerToggle} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {user && (
          <Box sx={{ px: 3, pb: 3 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: colors.primary.main }}>{user.name?.charAt(0)}</Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" noWrap>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <List sx={{ px: 2 }}>
          {links.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive(link.path)}
                onClick={() => { navigate(link.path); handleDrawerToggle(); }}
                sx={{ borderRadius: 3, '&.Mui-selected': { bgcolor: `${colors.primary.main}15`, color: colors.primary.main } }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive(link.path) ? colors.primary.main : 'inherit' }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 3 }}>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Globe size={18} />}
              onClick={toggleLanguage}
              sx={{ justifyContent: 'flex-start', borderRadius: 3, color: colors.text.primary, borderColor: 'rgba(0,0,0,0.1)' }}
            >
              {i18n.language === 'ar' ? 'Français' : 'العربية'}
            </Button>
            {user ? (
              <Button
                variant="outlined"
                fullWidth
                color="error"
                startIcon={<LogOut size={18} />}
                onClick={() => { handleLogout(); handleDrawerToggle(); }}
                sx={{ justifyContent: 'flex-start', borderRadius: 3 }}
              >
                {t('nav_logout', { defaultValue: 'تسجيل خروج' })}
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                startIcon={<LogIn size={18} />}
                onClick={() => { navigate('/login'); handleDrawerToggle(); }}
                sx={{ borderRadius: 3, bgcolor: colors.primary.main, boxShadow: 'none' }}
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