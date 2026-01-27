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
  alpha,
} from '@mui/material';
import {
  Microscope,
  Menu as MenuIcon,
  Globe,
  Home,
  Archive,
  PlusCircle, // أيقونة الإضافة
  BarChart2,
  CheckSquare,
  X,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

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
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === القائمة الصحيحة (تمت إعادة زر الإضافة) ===
  const links = [
    { label: t('nav_home'), path: '/', icon: <Home size={18} /> },
    { label: t('nav_archive'), path: '/archive', icon: <Archive size={18} /> },
    { label: t('nav_add_parasite'), path: '/add', icon: <PlusCircle size={18} /> }, // تمت إعادته!
    { label: t('nav_statistics'), path: '/statistics', icon: <BarChart2 size={18} /> },
    // يظهر فقط للمشرفين
    ...(user ? [{ label: t('nav_review'), path: '/review', icon: <CheckSquare size={18} /> }] : []),
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
        component={motion.nav}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          py: scrolled ? 1 : 2,
          px: 2,
          background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
          borderBottom: scrolled ? `1px solid rgba(0,0,0,0.05)` : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 38, height: 38,
                borderRadius: 2.5,
                bgcolor: colors.primary.main,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: scrolled ? `0 4px 12px ${alpha(colors.primary.main, 0.3)}` : 'none',
                transition: 'all 0.3s'
              }}
            >
              <Microscope size={22} />
            </Box>
            {!isMobile && (
              <Box>
                 <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b', lineHeight: 1.2 }}>
                   {t('app_title')}
                 </Typography>
                 <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, letterSpacing: 0.5 }}>
                   DATABASE
                 </Typography>
              </Box>
            )}
          </Box>

          {/* Desktop Links */}
          {!isMobile && (
            <Box 
               sx={{ 
                  bgcolor: scrolled ? alpha(colors.primary.lighter, 0.3) : 'transparent',
                  p: 0.5, 
                  borderRadius: 99,
                  border: scrolled ? `1px solid ${alpha(colors.primary.main, 0.05)}` : 'none',
                  transition: 'all 0.3s'
               }}
            >
              <Stack direction="row" spacing={0.5}>
                {links.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      startIcon={active ? link.icon : null}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 99,
                        px: 2.5,
                        py: 0.8,
                        fontSize: '0.9rem',
                        fontWeight: active ? 700 : 500,
                        color: active ? '#fff' : colors.text.secondary,
                        bgcolor: active ? colors.primary.main : 'transparent',
                        boxShadow: active ? `0 4px 12px ${alpha(colors.primary.main, 0.25)}` : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                           bgcolor: active ? colors.primary.main : alpha(colors.primary.main, 0.08),
                           color: active ? '#fff' : colors.primary.main
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Right Section */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            
            {/* زر اللغة (تم التعديل ليكون FR/AR) */}
            <Tooltip title={t('nav_language')}>
              <IconButton 
                 onClick={toggleLanguage} 
                 size="small" 
                 sx={{ 
                    border: `1px solid ${alpha(colors.text.secondary, 0.2)}`,
                    borderRadius: 2,
                    p: 0.8
                 }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                  {i18n.language === 'ar' ? 'FR' : 'AR'} {/* تصحيح اللغة */}
                </Typography>
              </IconButton>
            </Tooltip>

            {!isMobile && (
               <>
                 <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
                 
                 {user ? (
                   <>
                     <Button
                       onClick={(e) => setUserAnchor(e.currentTarget)}
                       endIcon={<ChevronDown size={14} />}
                       sx={{
                         textTransform: 'none',
                         borderRadius: 3,
                         pl: 0.8, pr: 1.5, py: 0.5,
                         border: '1px solid transparent',
                         '&:hover': { bgcolor: alpha(colors.primary.main, 0.05), border: `1px solid ${alpha(colors.primary.main, 0.1)}` },
                       }}
                     >
                       <Avatar
                         sx={{ width: 34, height: 34, bgcolor: colors.primary.main, fontSize: '0.9rem', mr: 1 }}
                       >
                         {user.name?.charAt(0).toUpperCase()}
                       </Avatar>
                       <Box sx={{ textAlign: 'left', display: { xs: 'none', lg: 'block' } }}>
                          <Typography variant="subtitle2" sx={{ lineHeight: 1, fontWeight: 700 }}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Member</Typography>
                       </Box>
                     </Button>
                     
                     <Menu
                       anchorEl={userAnchor}
                       open={Boolean(userAnchor)}
                       onClose={() => setUserAnchor(null)}
                       PaperProps={{
                         elevation: 0,
                         sx: {
                           mt: 1.5,
                           minWidth: 200,
                           borderRadius: 4,
                           boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                           border: '1px solid rgba(0,0,0,0.05)',
                           overflow: 'visible',
                           '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0, right: 14,
                              width: 10, height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                              borderTop: '1px solid rgba(0,0,0,0.05)',
                              borderLeft: '1px solid rgba(0,0,0,0.05)',
                           },
                         },
                       }}
                       transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                       anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                     >
                       <Box sx={{ px: 2.5, py: 2 }}>
                         <Typography variant="subtitle2" fontWeight={700} noWrap>{user.name}</Typography>
                         <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                       </Box>
                       <Divider sx={{ my: 1 }} />
                       <MenuItem onClick={() => navigate('/settings')} sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}>
                          <ListItemIcon><Settings size={16} /></ListItemIcon>
                          {t('settings', {defaultValue: 'Settings'})}
                       </MenuItem>
                       <MenuItem 
                          onClick={handleLogout}
                          sx={{ color: '#ef4444', borderRadius: 2, mx: 1, '&:hover': { bgcolor: '#fef2f2' } }}
                       >
                         <ListItemIcon><LogOut size={16} color="#ef4444" /></ListItemIcon>
                         {t('nav_logout')}
                       </MenuItem>
                     </Menu>
                   </>
                 ) : (
                   <Button
                     variant="contained"
                     onClick={() => navigate('/login')}
                     sx={{
                       borderRadius: 3,
                       px: 3, py: 1,
                       bgcolor: '#1e293b',
                       color: '#fff',
                       fontWeight: 700,
                       boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                       '&:hover': { bgcolor: '#0f172a', transform: 'translateY(-1px)' },
                     }}
                   >
                     {t('nav_login')}
                   </Button>
                 )}
               </>
            )}

            {isMobile && (
              <IconButton 
                 onClick={handleDrawerToggle}
                 sx={{ 
                    bgcolor: mobileOpen ? alpha(colors.primary.main, 0.1) : 'transparent',
                    color: mobileOpen ? colors.primary.main : '#1e293b'
                 }}
              >
                {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </IconButton>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: '#ffffff',
            borderTopLeftRadius: i18n.language === 'ar' ? 24 : 0,
            borderBottomLeftRadius: i18n.language === 'ar' ? 24 : 0,
            borderTopRightRadius: i18n.language === 'ar' ? 0 : 24,
            borderBottomRightRadius: i18n.language === 'ar' ? 0 : 24,
            boxShadow: '0 0 40px rgba(0,0,0,0.1)'
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <Box sx={{ 
               width: 44, height: 44, 
               borderRadius: 2.5, 
               bgcolor: colors.primary.main, 
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: '#fff' 
            }}>
               <Microscope size={24} />
            </Box>
            <Box>
               <Typography variant="h6" fontWeight={800} lineHeight={1.1}>{t('app_title')}</Typography>
               <Typography variant="caption" color="text.secondary">Mobile Navigation</Typography>
            </Box>
          </Stack>

          <List sx={{ px: 0 }}>
            {links.map((link) => (
              <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={isActive(link.path)}
                  onClick={() => { navigate(link.path); handleDrawerToggle(); }}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    color: isActive(link.path) ? colors.primary.main : '#64748b',
                    bgcolor: isActive(link.path) ? alpha(colors.primary.main, 0.08) : 'transparent',
                    '&:hover': { bgcolor: alpha(colors.primary.main, 0.04) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText 
                     primary={link.label} 
                     primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }} 
                  />
                  {isActive(link.path) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.primary.main }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 'auto' }}>
            {user ? (
               <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', mb: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                     <Avatar sx={{ bgcolor: colors.primary.main }}>{user.name?.charAt(0)}</Avatar>
                     <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                     </Box>
                     <IconButton size="small" onClick={handleLogout} color="error">
                        <LogOut size={18} />
                     </IconButton>
                  </Stack>
               </Paper>
            ) : (
               <Button
                  fullWidth
                  variant="contained"
                  onClick={() => { navigate('/login'); handleDrawerToggle(); }}
                  sx={{ 
                     borderRadius: 3, 
                     py: 1.5, 
                     bgcolor: '#1e293b',
                     fontWeight: 700,
                     mb: 2 
                  }}
               >
                  {t('nav_login')}
               </Button>
            )}

            <Button
               fullWidth
               variant="text"
               startIcon={<Globe size={18} />}
               onClick={toggleLanguage}
               sx={{ color: '#64748b', borderRadius: 3 }}
            >
               {i18n.language === 'ar' ? 'Français' : 'العربية'} {/* تصحيح هنا أيضاً */}
            </Button>
          </Box>

        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;