import React, { useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  Stack, Avatar, Menu, MenuItem, IconButton, Tooltip, Divider
} from '@mui/material';
import { LogOut, User, Microscope, Globe, ChevronDown, Menu as MenuIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);

  useEffect(() => { document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'; }, [i18n.language]);

  const isActive = (path: string) => location.pathname === path;
  const changeLanguage = (lang: string) => { i18n.changeLanguage(lang); setAnchorElLang(null); };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.85)', // ?????? ????
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(4, 120, 87, 0.1)', // ?? ???? ????
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 70, justifyContent: 'space-between' }}>
          
          {/* 1. Logo Section (Left) */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer', width: 200 }} onClick={() => navigate('/')}>
            <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(4, 120, 87, 0.2)' }}>
              <Microscope size={24} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5, color: 'primary.dark' }}>
              Bio<span style={{ color: '#10B981' }}>Lab</span>
            </Typography>
          </Stack>

          {/* 2. Center Menu (Centered) */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {[
              { title: t('welcome').includes('Welcome') || t('welcome').includes('Bienvenue') ? 'Home' : '????????', path: '/' },
              { title: t('archive'), path: '/archive' },
              { title: t('add_sample'), path: '/add-parasite' }
            ].map((link) => (
              <Button 
                key={link.path}
                onClick={() => navigate(link.path)}
                sx={{
                  color: isActive(link.path) ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive(link.path) ? 700 : 500,
                  bgcolor: isActive(link.path) ? 'rgba(4, 120, 87, 0.08)' : 'transparent',
                  borderRadius: '50px', px: 3,
                  '&:hover': { bgcolor: 'rgba(4, 120, 87, 0.04)', color: 'primary.main' }
                }}
              >
                {link.title}
              </Button>
            ))}
          </Stack>

          {/* 3. Right Section (User & Lang) */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 200, justifyContent: 'flex-end' }}>
            <IconButton onClick={(e) => setAnchorElLang(e.currentTarget)} size="small">
              <Globe size={20} color="#047857" />
            </IconButton>
            <Menu anchorEl={anchorElLang} open={Boolean(anchorElLang)} onClose={() => setAnchorElLang(null)} PaperProps={{ sx: { mt: 1.5, minWidth: 150, borderRadius: 3 } }}>
              <MenuItem onClick={() => changeLanguage('fr')}> Français</MenuItem>
              <MenuItem onClick={() => changeLanguage('en')}> English</MenuItem>
              <MenuItem onClick={() => changeLanguage('ar')}> ???????</MenuItem>
            </Menu>

            {user ? (
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>{user.name[0]}</Avatar>
              </IconButton>
            ) : (
              <Button variant="contained" size="small" onClick={() => navigate('/login')} sx={{ borderRadius: 50 }}>{t('login')}</Button>
            )}
            <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={() => setAnchorElUser(null)} PaperProps={{ sx: { mt: 1.5 } }}>
              <MenuItem onClick={() => { setAnchorElUser(null); logout(); }} sx={{ color: 'error.main' }}><LogOut size={16} style={{ marginRight: 8 }} /> {t('logout')}</MenuItem>
            </Menu>
          </Stack>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNav;
