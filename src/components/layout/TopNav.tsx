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
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          background: `linear-gradient(135deg, ${alpha('#ffffff', 0.85)} 0%, ${alpha(colors.primary.lighter, 0.6)} 100%)`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha(colors.primary.main, 0.08)}`,
          color: colors.text.primary,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.05)}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 64, md: 76 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Logo & Title */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              onClick={() => handleNavigation('/')}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {/* Icon Box */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  background: gradients.primary,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.25)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 6px 16px ${alpha(colors.primary.main, 0.35)}`,
                  },
                }}
              >
                <Microscope size={24} strokeWidth={2.5} />
              </Box>

              {/* Title */}
              <Stack spacing={0}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: colors.primary.main,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('app_title') || 'أرشيف الطفيليات'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(colors.text.secondary, 0.7),
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Academic Database
                </Typography>
              </Stack>
            </Stack>

            {/* Navigation - Desktop Only */}
            {!isMobile && (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  display: 'flex',
                  gap: { md: '6px', lg: '8px' },
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
                            backgroundColor: alpha(colors.primary.main, 0.9),
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '6px 12px',
                          },
                        },
                      }}
                    >
                      <Button
                        onClick={() => navigate(item.path)}
                        startIcon={<IconComponent size={19} />}
                        sx={{
                          color: isActive(item.path)
                            ? colors.primary.main
                            : colors.text.secondary,
                          fontWeight: isActive(item.path) ? 700 : 600,
                          fontSize: '0.9rem',
                          padding: '9px 14px',
                          borderRadius: '9px',
                          backgroundColor: isActive(item.path)
                            ? alpha(colors.primary.main, 0.1)
                            : 'transparent',
                          border: isActive(item.path)
                            ? `1.5px solid ${alpha(colors.primary.main, 0.25)}`
                            : '1.5px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            backgroundColor: alpha(colors.primary.main, 0.08),
                            color: colors.primary.main,
                            borderColor: alpha(colors.primary.main, 0.25),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.12)}`,
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Tooltip>
                  );
                })}
              </Stack>
            )}

            {/* Right Controls - Language, User, Menu */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                display: 'flex',
                gap: { xs: '2px', md: '6px' },
                ml: 'auto',
              }}
            >
              {/* Language Selector */}
              <Tooltip title={t('language') || 'اللغة'} arrow>
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorElLang(e.currentTarget)}
                  sx={{
                    color: colors.primary.main,
                    backgroundColor: alpha(colors.primary.main, 0.08),
                    borderRadius: '9px',
                    width: 40,
                    height: 40,
                    transition: 'all 0.3s ease',
                    border: `1.5px solid ${alpha(colors.primary.main, 0.12)}`,
                    '&:hover': {
                      backgroundColor: alpha(colors.primary.main, 0.14),
                      borderColor: alpha(colors.primary.main, 0.25),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.12)}`,
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
                    mt: 1.2,
                    minWidth: 160,
                    borderRadius: '12px',
                    boxShadow: `0 8px 32px ${alpha(colors.primary.main, 0.15)}`,
                    border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(colors.primary.lighter, 0.4)} 100%)`,
                    backdropFilter: 'blur(8px)',
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
                      '&.Mui-selected': {
                        backgroundColor: alpha(colors.primary.main, 0.15),
                        color: colors.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(colors.primary.main, 0.2),
                        },
                      },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(colors.primary.main, 0.08),
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
                          transform: 'scale(1.08)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: gradients.primary,
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'white',
                          border: `2px solid ${alpha(colors.primary.main, 0.2)}`,
                          boxShadow: `0 2px 8px ${alpha(colors.primary.main, 0.15)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: `0 4px 16px ${alpha(colors.primary.main, 0.25)}`,
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
                        mt: 1.2,
                        minWidth: 220,
                        borderRadius: '12px',
                        boxShadow: `0 8px 32px ${alpha(colors.primary.main, 0.15)}`,
                        border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(colors.primary.lighter, 0.4)} 100%)`,
                        backdropFilter: 'blur(8px)',
                      },
                    }}
                    TransitionProps={{ timeout: 200 }}
                  >
                    <MenuItem disabled sx={{ fontSize: '0.85rem', py: 1.2, color: colors.text.primary }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem disabled sx={{ fontSize: '0.8rem', color: 'text.disabled', py: 0.8 }}>
                      <Typography variant="caption">{user.email}</Typography>
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                        logout();
                      }}
                      sx={{
                        color: colors.error.main,
                        fontWeight: 700,
                        py: 1.2,
                        fontSize: '0.9rem',
                        '&:hover': {
                          backgroundColor: alpha(colors.error.main, 0.1),
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
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: gradients.primary,
                    borderRadius: '50px',
                    padding: '10px 24px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.25)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: `linear-gradient(135deg, #2d4733 0%, #3a5a40 100%)`,
                      boxShadow: `0 8px 24px ${alpha(colors.primary.main, 0.35)}`,
                      transform: 'translateY(-2px)',
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
                      color: colors.primary.main,
                      backgroundColor: alpha(colors.primary.main, 0.08),
                      borderRadius: '9px',
                      width: 40,
                      height: 40,
                      transition: 'all 0.3s ease',
                      border: `1.5px solid ${alpha(colors.primary.main, 0.12)}`,
                      '&:hover': {
                        backgroundColor: alpha(colors.primary.main, 0.14),
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
            background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(colors.primary.lighter, 0.3)} 100%)`,
            backdropFilter: 'blur(10px)',
            borderRight: i18n.language === 'ar' ? 'none' : `1px solid ${alpha(colors.primary.main, 0.1)}`,
            borderLeft: i18n.language === 'ar' ? `1px solid ${alpha(colors.primary.main, 0.1)}` : 'none',
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
                    color: isActive(item.path)
                      ? colors.primary.main
                      : colors.text.secondary,
                    fontWeight: isActive(item.path) ? 700 : 600,
                    fontSize: '0.95rem',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: isActive(item.path)
                      ? alpha(colors.primary.main, 0.1)
                      : 'transparent',
                    border: isActive(item.path)
                      ? `1.5px solid ${alpha(colors.primary.main, 0.25)}`
                      : '1.5px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: i18n.language === 'ar' ? 'flex-end' : 'flex-start',
                    '&:hover': {
                      backgroundColor: alpha(colors.primary.main, 0.08),
                      color: colors.primary.main,
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
          <Divider sx={{ my: 2 }} />

          {/* Footer Info */}
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: alpha(colors.text.secondary, 0.6),
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