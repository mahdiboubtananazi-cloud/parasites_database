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
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
    { label: t('nav_home') || 'Home', path: '/', icon: Home },
    { label: t('nav_parasites') || 'Archive', path: '/archive', icon: Archive },
    { label: t('nav_add_parasite') || 'Add Sample', path: '/add-parasite', icon: Plus },
    { label: t('nav_statistics') || 'Statistics', path: '/statistics', icon: BarChart3 },
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
          background: alpha(colors.primary.lighter, 0.7),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          color: colors.text.primary,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 64, md: 72 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'height 0.3s ease',
            }}
          >
            {/* Logo Section - Floating Effect */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              onClick={() => handleNavigation('/')}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  filter: 'drop-shadow(0 4px 12px rgba(58, 90, 64, 0.2))',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: gradients.primary,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(58, 90, 64, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(58, 90, 64, 0.3)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Microscope size={26} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: colors.primary.main,
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  background: gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                Parasites DB
              </Typography>
            </Stack>

            {/* Navigation - Desktop Only */}
            {!isMobile && (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  display: 'flex',
                  gap: { md: '8px', lg: '12px' },
                }}
              >
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Tooltip key={item.path} title={item.label} arrow>
                      <Button
                        onClick={() => navigate(item.path)}
                        startIcon={<IconComponent size={18} />}
                        sx={{
                          color: isActive(item.path)
                            ? colors.primary.main
                            : colors.text.secondary,
                          fontWeight: isActive(item.path) ? 700 : 600,
                          fontSize: '0.9rem',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          backgroundColor: isActive(item.path)
                            ? alpha(colors.primary.main, 0.12)
                            : 'transparent',
                          border: isActive(item.path)
                            ? `1.5px solid ${alpha(colors.primary.main, 0.3)}`
                            : '1.5px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: alpha(colors.primary.main, 0.08),
                            transition: 'left 0.3s ease',
                            zIndex: 0,
                          },
                          '&:hover': {
                            backgroundColor: alpha(colors.primary.main, 0.08),
                            color: colors.primary.main,
                            borderColor: alpha(colors.primary.main, 0.3),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.15)}`,
                            '&::before': {
                              left: '100%',
                            },
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

            {/* Right Section */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                display: 'flex',
                gap: { xs: '4px', md: '8px' },
              }}
            >
              {/* Language Selector - Floating Button */}
              <Tooltip title={t('language') || 'Language'}>
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorElLang(e.currentTarget)}
                  sx={{
                    color: colors.primary.main,
                    backgroundColor: alpha(colors.primary.main, 0.08),
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: alpha(colors.primary.main, 0.16),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.15)}`,
                    },
                  }}
                >
                  <Globe size={20} />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={() => setAnchorElLang(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 160,
                    borderRadius: '14px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                    background: alpha(colors.primary.lighter, 0.8),
                    backdropFilter: 'blur(8px)',
                  },
                }}
                TransitionProps={{
                  timeout: 200,
                }}
              >
                {['en', 'ar', 'fr'].map((lang) => (
                  <MenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    selected={i18n.language === lang}
                    sx={{
                      py: 1.2,
                      px: 2,
                      fontWeight: i18n.language === lang ? 700 : 500,
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
                    {lang === 'en' && '🇬🇧 English'}
                    {lang === 'ar' && '🇸🇦 العربية'}
                    {lang === 'fr' && '🇫🇷 Français'}
                  </MenuItem>
                ))}
              </Menu>

              {/* User Section - Floating Avatar */}
              {user ? (
                <>
                  <Tooltip title={user.name}>
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
                          fontSize: '1rem',
                          fontWeight: 700,
                          border: `2px solid ${alpha(colors.primary.main, 0.2)}`,
                          boxShadow: `0 2px 8px ${alpha(colors.primary.main, 0.15)}`,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: `0 4px 16px ${alpha(colors.primary.main, 0.25)}`,
                          },
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={() => setAnchorElUser(null)}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: '14px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                        background: alpha(colors.primary.lighter, 0.8),
                        backdropFilter: 'blur(8px)',
                      },
                    }}
                    TransitionProps={{
                      timeout: 200,
                    }}
                  >
                    <MenuItem disabled sx={{ fontSize: '0.85rem', py: 1.2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        👤 {user.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem disabled sx={{ fontSize: '0.8rem', color: 'text.disabled', py: 0.8 }}>
                      {user.email}
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                        logout();
                      }}
                      sx={{
                        color: colors.error.main,
                        fontWeight: 600,
                        py: 1.2,
                        '&:hover': {
                          backgroundColor: alpha(colors.error.main, 0.12),
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <LogOut size={18} style={{ marginRight: 8 }} />
                      {t('logout') || 'Logout'}
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
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {t('login') || 'Login'}
                </Button>
              )}

              {/* Mobile Menu Toggle - Floating Button */}
              {isMobile && (
                <Tooltip title={mobileDrawerOpen ? 'Close' : 'Menu'}>
                  <IconButton
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                    sx={{
                      color: colors.primary.main,
                      backgroundColor: alpha(colors.primary.main, 0.08),
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(colors.primary.main, 0.16),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.15)}`,
                      },
                    }}
                  >
                    {mobileDrawerOpen ? (
                      <X size={24} />
                    ) : (
                      <MenuIcon size={24} />
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
            background: alpha(colors.primary.lighter, 0.95),
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          },
        }}
        SlideProps={{
          timeout: 300,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
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
                    borderRadius: '12px',
                    backgroundColor: isActive(item.path)
                      ? alpha(colors.primary.main, 0.12)
                      : 'transparent',
                    border: isActive(item.path)
                      ? `1.5px solid ${alpha(colors.primary.main, 0.3)}`
                      : '1.5px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      backgroundColor: alpha(colors.primary.main, 0.08),
                      color: colors.primary.main,
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default TopNav;