import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
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
  Typography,
  useTheme,
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
  CheckCircle,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
const TopNav = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));


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
    { label: t('nav_archive') || 'الأرشيف', path: '/archive', icon: Archive },
    { label: t('nav_add_parasite') || 'إضافة عينة', path: '/add-parasite', icon: Plus },
    { label: t('nav_statistics') || 'الإحصائيات', path: '/statistics', icon: BarChart3 },
    { label: t('nav_review') || 'المراجعة', path: '/review', icon: CheckCircle },
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
          background: alpha('#2d4a3f', 0.75),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
          color: '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 4px 20px ${alpha('#2d4a3f', 0.1)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 56, sm: 64, md: 72 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5, md: 2 },
              minHeight: { xs: 56, sm: 64, md: 72 },
            }}
          >
            {/* ===== LOGO ===== */}
            <Box
              onClick={() => handleNavigation('/')}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 44, md: 48 },
                  height: { xs: 40, sm: 44, md: 48 },
                  background: alpha('#ffffff', 0.12),
                  borderRadius: { xs: '10px', md: '12px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                  border: `1.5px solid ${alpha('#FFD700', 0.3)}`,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    background: alpha('#ffffff', 0.18),
                    border: `1.5px solid ${alpha('#FFD700', 0.6)}`,
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: `0 8px 24px ${alpha('#FFD700', 0.2)}`,
                  },
                }}
              >
                <Microscope size={24} strokeWidth={1.5} fill="currentColor" />
              </Box>
            </Box>


            {/* ===== NAVIGATION - CENTER - Desktop/Tablet Only ===== */}
            {!isTablet && (
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: { xs: '2px', md: '4px' },
                  alignItems: 'center',
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
                            backgroundColor: alpha('#000000', 0.85),
                            color: '#FFD700',
                            borderRadius: '8px',
                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                            fontWeight: 600,
                            padding: '6px 12px',
                            border: `1px solid ${alpha('#FFD700', 0.3)}`,
                          },
                        },
                      }}
                    >
                      <Button
                        onClick={() => navigate(item.path)}
                        sx={{
                          width: { sm: 40, md: 44 },
                          height: { sm: 40, md: 44 },
                          minWidth: 'unset',
                          padding: { xs: '6px', md: '8px' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive(item.path) ? '#FFD700' : alpha('#ffffff', 0.6),
                          fontWeight: isActive(item.path) ? 700 : 600,
                          borderRadius: { xs: '8px', md: '10px' },
                          backgroundColor: isActive(item.path)
                            ? alpha('#FFD700', 0.15)
                            : 'transparent',
                          border: isActive(item.path)
                            ? `1.5px solid ${alpha('#FFD700', 0.4)}`
                            : `1.5px solid ${alpha('#ffffff', 0.2)}`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          backdropFilter: 'blur(8px)',
                          '&:hover': {
                            backgroundColor: isActive(item.path)
                              ? alpha('#FFD700', 0.2)
                              : alpha('#ffffff', 0.1),
                            color: '#FFD700',
                            borderColor: alpha('#FFD700', 0.4),
                            transform: 'translateY(-3px)',
                            boxShadow: `0 8px 16px ${alpha('#FFD700', 0.15)}`,
                          },
                        }}
                      >
                        <IconComponent size={20} strokeWidth={1.5} />
                      </Button>
                    </Tooltip>
                  );
                })}
              </Box>
            )}


            {/* ===== RIGHT CONTROLS ===== */}
            <Stack
              direction="row"
              spacing={{ xs: 0.25, sm: 0.5, md: 0.75 }}
              alignItems="center"
              sx={{
                display: 'flex',
                ml: 'auto',
              }}
            >
              {/* Language Selector */}
              <Tooltip title={t('nav_language') || 'اللغة'} arrow>
                <IconButton
                  onClick={(e) => setAnchorElLang(e.currentTarget)}
                  sx={{
                    color: alpha('#ffffff', 0.7),
                    backgroundColor: 'transparent',
                    borderRadius: { xs: '8px', md: '10px' },
                    width: { xs: 36, sm: 40, md: 44 },
                    height: { xs: 36, sm: 40, md: 44 },
                    padding: { xs: '6px', sm: '7px', md: '8px' },
                    transition: 'all 0.3s ease',
                    border: `1.5px solid ${alpha('#ffffff', 0.15)}`,
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.1),
                      borderColor: alpha('#FFD700', 0.4),
                      color: '#FFD700',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Globe size={20} strokeWidth={1.5} />
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
                    minWidth: { xs: 120, sm: 140 },
                    borderRadius: '12px',
                    boxShadow: `0 16px 48px ${alpha('#2d4a3f', 0.25)}`,
                    border: `1px solid ${alpha('#FFD700', 0.2)}`,
                    background: alpha('#2d4a3f', 0.95),
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
                      py: { xs: 0.75, sm: 1 },
                      px: { xs: 1.5, sm: 2 },
                      fontWeight: i18n.language === lang ? 700 : 600,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      color: i18n.language === lang ? '#FFD700' : alpha('#ffffff', 0.7),
                      '&.Mui-selected': {
                        backgroundColor: alpha('#FFD700', 0.12),
                      },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha('#FFD700', 0.15),
                        color: '#FFD700',
                      },
                    }}
                  >
                    {lang === 'en' && 'English'}
                    {lang === 'ar' && 'العربية'}
                    {lang === 'fr' && 'Français'}
                  </MenuItem>
                ))}
              </Menu>


              {/* User Avatar or Login */}
              {user ? (
                <>
                  <Tooltip title={user.email || 'المستخدم'} arrow>
                    <IconButton
                      onClick={(e) => setAnchorElUser(e.currentTarget)}
                      sx={{
                        p: { xs: 0.3, sm: 0.4, md: 0.5 },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.12)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 36, sm: 40, md: 44 },
                          height: { xs: 36, sm: 40, md: 44 },
                          background: alpha('#FFD700', 0.2),
                          fontSize: { xs: '0.85rem', md: '0.95rem' },
                          fontWeight: 700,
                          color: '#FFD700',
                          border: `2px solid ${alpha('#FFD700', 0.4)}`,
                          backdropFilter: 'blur(8px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: alpha('#FFD700', 0.3),
                            borderColor: alpha('#FFD700', 0.8),
                          },
                        }}
                      >
                        {user.email?.charAt(0).toUpperCase() || 'U'}
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
                        minWidth: { xs: 180, sm: 220 },
                        borderRadius: '12px',
                        boxShadow: `0 16px 48px ${alpha('#2d4a3f', 0.25)}`,
                        border: `1px solid ${alpha('#FFD700', 0.2)}`,
                        background: alpha('#2d4a3f', 0.95),
                        backdropFilter: 'blur(12px)',
                      },
                    }}
                    TransitionProps={{ timeout: 200 }}
                  >
                    <MenuItem 
                      disabled 
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                        py: { xs: 0.75, sm: 1 }, 
                        color: '#FFD700',
                        px: { xs: 1, sm: 2 },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 'inherit' }}>
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem 
                      disabled 
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }, 
                        color: alpha('#ffffff', 0.5), 
                        py: { xs: 0.3, sm: 0.5 },
                        px: { xs: 1, sm: 2 },
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: 'inherit' }}>{user.email}</Typography>
                    </MenuItem>
                    <Divider sx={{ my: { xs: 0.3, sm: 0.5 }, borderColor: alpha('#ffffff', 0.1) }} />
                    <MenuItem
                      onClick={() => {
                        setAnchorElUser(null);
                        LogOut(user);
                      }}
                      sx={{
                        color: '#ff6b6b',
                        fontWeight: 700,
                        py: { xs: 0.75, sm: 1 },
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        '&:hover': {
                          backgroundColor: alpha('#ff6b6b', 0.12),
                        },
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <LogOut size={18} strokeWidth={1.5} />
                      {t('nav_logout') || 'تسجيل الخروج'}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Tooltip title={t('nav_login') || 'دخول'} arrow>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#FFD700',
                      borderColor: alpha('#FFD700', 0.4),
                      borderRadius: { xs: '8px', md: '10px' },
                      padding: { xs: '6px 12px', sm: '8px 16px', md: '8px 18px' },
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      border: '1.5px solid',
                      backgroundColor: 'transparent',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      minWidth: 'unset',
                      height: { xs: 36, sm: 40, md: 44 },
                      lineHeight: 1.2,
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: alpha('#FFD700', 0.12),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${alpha('#FFD700', 0.2)}`,
                      },
                    }}
                  >
                    {t('nav_login') || 'دخول'}
                  </Button>
                </Tooltip>
              )}


              {/* Mobile Menu Button */}
              {isTablet && (
                <Tooltip title={mobileDrawerOpen ? 'إغلاق' : 'قائمة'} arrow>
                  <IconButton
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                    sx={{
                      color: alpha('#ffffff', 0.7),
                      backgroundColor: 'transparent',
                      borderRadius: { xs: '8px', md: '10px' },
                      width: { xs: 36, sm: 40, md: 44 },
                      height: { xs: 36, sm: 40, md: 44 },
                      padding: { xs: '6px', sm: '7px', md: '8px' },
                      transition: 'all 0.3s ease',
                      border: `1.5px solid ${alpha('#ffffff', 0.15)}`,
                      '&:hover': {
                        backgroundColor: alpha('#ffffff', 0.1),
                        borderColor: alpha('#FFD700', 0.4),
                        color: '#FFD700',
                      },
                    }}
                  >
                    {mobileDrawerOpen ? (
                      <X size={22} strokeWidth={2} />
                    ) : (
                      <MenuIcon size={22} strokeWidth={2} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>


      {/* ===== MOBILE DRAWER ===== */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: 240, sm: 280 },
            background: alpha('#2d4a3f', 0.95),
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: i18n.language === 'ar' ? 'none' : `1px solid ${alpha('#FFD700', 0.1)}`,
            borderLeft: i18n.language === 'ar' ? `1px solid ${alpha('#FFD700', 0.1)}` : 'none',
          },
        }}
        SlideProps={{ timeout: 300 }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Navigation Items */}
          <Stack spacing={{ xs: 0.75, sm: 1 }} sx={{ flex: 1 }}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  startIcon={<IconComponent size={20} strokeWidth={1.5} />}
                  fullWidth
                  sx={{
                    color: isActive(item.path) ? '#FFD700' : alpha('#ffffff', 0.7),
                    fontWeight: isActive(item.path) ? 700 : 600,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    padding: { xs: '10px 14px', sm: '12px 16px' },
                    borderRadius: { xs: '8px', md: '10px' },
                    backgroundColor: isActive(item.path)
                      ? alpha('#FFD700', 0.15)
                      : 'transparent',
                    border: isActive(item.path)
                      ? `1.5px solid ${alpha('#FFD700', 0.4)}`
                      : `1.5px solid ${alpha('#ffffff', 0.15)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: i18n.language === 'ar' ? 'flex-end' : 'flex-start',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      backgroundColor: alpha('#FFD700', 0.12),
                      color: '#FFD700',
                      borderColor: alpha('#FFD700', 0.4),
                      transform: i18n.language === 'ar' ? 'translateX(-8px)' : 'translateX(8px)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>


          <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderColor: alpha('#ffffff', 0.1) }} />


          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: alpha('#ffffff', 0.4),
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontWeight: 500,
            }}
          >
            Parasites DB © 2025
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};


export default TopNav;