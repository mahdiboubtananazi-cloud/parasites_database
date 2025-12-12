import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  useMediaQuery,
  Drawer,
  Divider,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Microscope,
  LogOut,
  Globe,
  X,
  Home,
  Archive,
  Plus,
  BarChart3,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { colors, gradients } from '../../theme/colors';

const TopNav = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:960px)');

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setAnchorElLang(null);
  };

  const navItems = [
    { label: t('nav_home') || 'الرئيسية', path: '/', icon: Home },
    { label: t('nav_parasites') || 'الأرشيف', path: '/archive', icon: Archive },
    { label: t('nav_add_parasite') || 'إضافة عينة', path: '/add-parasite', icon: Plus },
    { label: t('nav_statistics') || 'الإحصائيات', path: '/statistics', icon: BarChart3 },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, #2d4a3f 0%, #3a5a40 100%)`,
          backdropFilter: 'blur(15px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
          color: '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 8px 32px ${alpha('#2d4a3f', 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 64, md: 80 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* Logo - Left Side */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={() => handleNavigation('/')}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: alpha('#ffffff', 0.15),
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  border: `1.5px solid ${alpha('#ffffff', 0.2)}`,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    background: alpha('#ffffff', 0.25),
                    border: `1.5px solid ${alpha('#ffffff', 0.4)}`,
                    transform: 'scale(1.08)',
                  },
                }}
              >
                <Microscope size={26} strokeWidth={2} />
              </Box>

              {/* Logo Text */}
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  transition: 'all 0.3s ease',
                }}
              >
                {t('app_title') || 'أرشيف الطفيليات'}
              </Typography>
            </Stack>

            {/* Navigation - CENTER - Desktop Only */}
            {!isMobile && (
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Tooltip
                      key={item.path}
                      title={item.label}
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: alpha('#000000', 0.8),
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '6px 12px',
                          },
                        },
                      }}
                    >
                      <Button
                        onClick={() => navigate(item.path)}
                        startIcon={<IconComponent size={18} />}
                        sx={{
                          color: isActive(item.path)
                            ? '#ffffff'
                            : alpha('#ffffff', 0.7),
                          fontWeight: isActive(item.path) ? 700 : 600,
                          fontSize: '0.9rem',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          backgroundColor: isActive(item.path)
                            ? alpha('#ffffff', 0.15)
                            : 'transparent',
                          border: isActive(item.path)
                            ? `1.5px solid ${alpha('#ffffff', 0.3)}`
                            : '1.5px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          backdropFilter: isActive(item.path) ? 'blur(8px)' : 'none',
                          '&:hover': {
                            backgroundColor: alpha('#ffffff', 0.1),
                            color: '#ffffff',
                            borderColor: alpha('#ffffff', 0.3),
                            transform: 'translateY(-2px)',
                            boxShadow: `inset 0 1px 2px ${alpha('#ffffff', 0.1)}`,
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Tooltip>
                  );
                })}
              </Box>
            )}

            {/* Right Controls */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                display: 'flex',
                ml: 'auto',
                gap: { xs: '6px', md: '12px' },
              }}
            >
              {/* Language Selector */}
              <Tooltip title={t('language') || 'اللغة'} arrow>
                <IconButton
                  onClick={(e) => setAnchorElLang(e.currentTarget)}
                  sx={{
                    color: '#ffffff',
                    backgroundColor: alpha('#ffffff', 0.1),
                    borderRadius: '10px',
                    width: 42,
                    height: 42,
                    transition: 'all 0.3s ease',
                    border: `1.5px solid ${alpha('#ffffff', 0.15)}`,
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.2),
                      borderColor: alpha('#ffffff', 0.3),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Globe size={20} strokeWidth={2} />
                </IconButton>
              </Tooltip>

              {/* Language Menu */}
              <Menu
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={() => setAnchorElLang(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 160,
                    borderRadius: '12px',
                    boxShadow: `0 16px 48px ${alpha('#2d4a3f', 0.2)}`,
                    border: `1px solid ${alpha('#ffffff', 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha('#2d4a3f', 0.95)} 0%, ${alpha('#3a5a40', 0.95)} 100%)`,
                    backdropFilter: 'blur(12px)',
                  },
                }}
                TransitionProps={{ timeout: 200 }}
              >
                {['en', 'ar', 'fr'].map((lang) => (
                  <MenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    selected={i18n.language === lang}
                    sx={{
                      py: 1.2,
                      px: 2,
                      fontWeight: i18n.language === lang ? 700 : 600,
                      fontSize: '0.9rem',
                      color: '#ffffff',
                      '&.Mui-selected': {
                        backgroundColor: alpha('#ffffff', 0.15),
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.2),
                        },
                      },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha('#ffffff', 0.1),
                      },
                    }}
                  >
                    {lang === 'en' && 'English'}
                    {lang === 'ar' && 'العربية'}
                    {lang === 'fr' && 'Français'}
                  </MenuItem>
                ))}
              </Menu>

              {/* User Avatar */}
              {user ? (
                <>
                  <Tooltip title={user.name} arrow>
                    <IconButton
                      onClick={(e) => setAnchorElUser(e.currentTarget)}
                      sx={{
                        p: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          background: alpha('#ffffff', 0.15),
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'white',
                          border: `2px solid ${alpha('#ffffff', 0.3)}`,
                          backdropFilter: 'blur(8px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: alpha('#ffffff', 0.25),
                            borderColor: alpha('#ffffff', 0.5),
                          },
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  {/* User Menu */}
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={() => setAnchorElUser(null)}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: '12px',
                        boxShadow: `0 16px 48px ${alpha('#2d4a3f', 0.2)}`,
                        border: `1px solid ${alpha('#ffffff', 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha('#2d4a3f', 0.95)} 0%, ${alpha('#3a5a40', 0.95)} 100%)`,
                        backdropFilter: 'blur(12px)',
                      },
                    }}
                    TransitionProps={{ timeout: 200 }}
                  >
                    <MenuItem disabled sx={{ fontSize: '0.85rem', py: 1.2, color: '#ffffff' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem disabled sx={{ fontSize: '0.8rem', color: alpha('#ffffff', 0.6), py: 0.8 }}>
                      <Typography variant="caption">{user.email}</Typography>
                    </MenuItem>
                    <Divider sx={{ my: 0.5, borderColor: alpha('#ffffff', 0.1) }} />
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                        logout();
                      }}
                      sx={{
                        color: '#ff6b6b',
                        fontWeight: 700,
                        py: 1.2,
                        fontSize: '0.9rem',
                        '&:hover': {
                          backgroundColor: alpha('#ff6b6b', 0.1),
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <LogOut size={18} style={{ marginRight: 8 }} />
                      {t('logout') || 'تسجيل الخروج'}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#ffffff',
                    borderColor: alpha('#ffffff', 0.4),
                    borderRadius: '50px',
                    padding: '10px 26px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    border: '1.5px solid',
                    backgroundColor: alpha('#ffffff', 0.08),
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: alpha('#ffffff', 0.8),
                      backgroundColor: alpha('#ffffff', 0.15),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${alpha('#ffffff', 0.15)}`,
                    },
                  }}
                >
                  {t('login') || 'دخول'}
                </Button>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <Tooltip title={mobileDrawerOpen ? 'إغلاق' : 'قائمة'} arrow>
                  <IconButton
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                    sx={{
                      color: '#ffffff',
                      backgroundColor: alpha('#ffffff', 0.1),
                      borderRadius: '10px',
                      width: 42,
                      height: 42,
                      transition: 'all 0.3s ease',
                      border: `1.5px solid ${alpha('#ffffff', 0.15)}`,
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        backgroundColor: alpha('#ffffff', 0.2),
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {mobileDrawerOpen ? (
                      <X size={24} strokeWidth={2.5} />
                    ) : (
                      <MenuIcon size={24} strokeWidth={2.5} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: `linear-gradient(135deg, #2d4a3f 0%, #3a5a40 100%)`,
            backdropFilter: 'blur(15px)',
            borderRight: i18n.language === 'ar' ? 'none' : `1px solid ${alpha('#ffffff', 0.1)}`,
            borderLeft: i18n.language === 'ar' ? `1px solid ${alpha('#ffffff', 0.1)}` : 'none',
          },
        }}
        SlideProps={{ timeout: 300 }}
      >
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Navigation Items */}
          <Stack spacing={1} sx={{ flex: 1 }}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  startIcon={<IconComponent size={20} />}
                  fullWidth
                  sx={{
                    color: isActive(item.path) ? '#ffffff' : alpha('#ffffff', 0.7),
                    fontWeight: isActive(item.path) ? 700 : 600,
                    fontSize: '0.95rem',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: isActive(item.path)
                      ? alpha('#ffffff', 0.15)
                      : 'transparent',
                    border: isActive(item.path)
                      ? `1.5px solid ${alpha('#ffffff', 0.3)}`
                      : '1.5px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: i18n.language === 'ar' ? 'flex-end' : 'flex-start',
                    backdropFilter: isActive(item.path) ? 'blur(8px)' : 'none',
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.1),
                      color: '#ffffff',
                      transform: i18n.language === 'ar' ? 'translateX(-8px)' : 'translateX(8px)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 2, borderColor: alpha('#ffffff', 0.1) }} />

          {/* Footer Info */}
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: alpha('#ffffff', 0.5),
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Parasites Database © 2025
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default TopNav;