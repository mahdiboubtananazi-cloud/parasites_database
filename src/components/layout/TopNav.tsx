import React, { useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  Stack, Avatar, Menu, MenuItem, IconButton, Tooltip, Divider
} from '@mui/material';
import { LogOut, User, Microscope, Globe, ChevronDown } from 'lucide-react';
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

  //  ضبط اتجاه الصفحة عند التحميل وعند تغيير اللغة
  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const isActive = (path: string) => location.pathname === path;
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setAnchorElLang(null);
  };

  const getLangLabel = () => {
    switch(i18n.language) {
      case 'ar': return 'العربية';
      case 'fr': return 'Français';
      default: return 'English';
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: { xs: 64, md: 72 } }}> {/* ارتفاع متجاوب */}
          
          {/* Logo */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5} 
            sx={{ flexGrow: 0, mr: { xs: 1, md: 4 }, cursor: 'pointer' }} 
            onClick={() => navigate('/')}
          >
            <Box 
              sx={{ 
                width: { xs: 36, md: 42 }, height: { xs: 36, md: 42 }, 
                bgcolor: 'primary.main', 
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(15, 98, 254, 0.2)'
              }}
            >
              <Microscope size={24} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5, display: { xs: 'none', sm: 'block' } }}>
              Parasite<span style={{ color: '#0F62FE' }}>DB</span>
            </Typography>
          </Stack>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button onClick={() => navigate('/')} sx={{ color: isActive('/') ? 'primary.main' : 'text.secondary', fontWeight: isActive('/') ? 700 : 500 }}>
              {t('welcome').includes('Welcome') || t('welcome').includes('Bienvenue') ? 'Home' : 'الرئيسية'}
            </Button>
            <Button onClick={() => navigate('/archive')} sx={{ color: isActive('/archive') ? 'primary.main' : 'text.secondary', fontWeight: isActive('/archive') ? 700 : 500 }}>
              {t('archive')}
            </Button>
            <Button onClick={() => navigate('/add-parasite')} sx={{ color: isActive('/add-parasite') ? 'primary.main' : 'text.secondary', fontWeight: isActive('/add-parasite') ? 700 : 500 }}>
              {t('add_sample')}
            </Button>
          </Box>

          {/* Right Section */}
          <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center" sx={{ ml: 'auto' }}>
            
            {/*  Language Switcher Dropdown */}
            <Button
              onClick={(e) => setAnchorElLang(e.currentTarget)}
              startIcon={<Globe size={18} />}
              endIcon={<ChevronDown size={14} />}
              sx={{ 
                color: 'text.secondary',
                minWidth: { xs: 'auto', md: 120 },
                '& .MuiButton-startIcon': { mr: { xs: 0, md: 1 } },
                '& .MuiButton-endIcon': { ml: { xs: 0, md: 1 } },
                '& span': { display: { xs: 'none', md: 'inline' } } // إخفاء النص في الموبايل
              }}
            >
              {getLangLabel()}
            </Button>
            
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={() => setAnchorElLang(null)}
              PaperProps={{ sx: { mt: 1.5, minWidth: 150, borderRadius: 3 } }}
            >
              <MenuItem selected={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}> Français</MenuItem>
              <MenuItem selected={i18n.language === 'en'} onClick={() => changeLanguage('en')}> English</MenuItem>
              <Divider />
              <MenuItem selected={i18n.language === 'ar'} onClick={() => changeLanguage('ar')}> العربية</MenuItem>
            </Menu>

            {/* User Section */}
            {user ? (
              <>
                <Button 
                  onClick={(e) => setAnchorElUser(e.currentTarget)}
                  sx={{ minWidth: 0, p: 0.5, borderRadius: '50%' }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>{user.name[0]}</Avatar>
                </Button>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 3 } }}
                >
                   <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                   </Box>
                   <Divider />
                  <MenuItem onClick={() => { setAnchorElUser(null); logout(); }} sx={{ color: 'error.main', gap: 1 }}>
                    <LogOut size={16} /> {t('logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" onClick={() => navigate('/login')}>{t('login')}</Button>
                <Button variant="contained" size="small" onClick={() => navigate('/register')} sx={{ display: { xs: 'none', sm: 'flex' } }}>{t('register')}</Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNav;
