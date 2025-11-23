import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  Stack, Avatar, Menu, MenuItem, IconButton, Tooltip
} from '@mui/material';
import { LogOut, User, Microscope, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isActive = (path: string) => location.pathname === path;

  //  وظيفة تغيير اللغة
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 70 }}>
          {/* Logo Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5} 
            sx={{ flexGrow: 0, mr: 4, cursor: 'pointer' }} 
            onClick={() => navigate('/')}
          >
            <Box 
              sx={{ 
                width: 40, height: 40, 
                bgcolor: 'primary.main', 
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(15, 98, 254, 0.2)'
              }}
            >
              <Microscope size={22} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5, display: { xs: 'none', sm: 'block' } }}>
              Parasite<span style={{ color: '#0F62FE' }}>DB</span>
            </Typography>
          </Stack>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button 
              onClick={() => navigate('/')}
              sx={{ fontWeight: isActive('/') ? 700 : 500, color: isActive('/') ? 'primary.main' : 'text.secondary' }}
            >
              {t('welcome')?.includes('Welcome') ? 'Home' : 'الرئيسية'}
            </Button>
            <Button 
              onClick={() => navigate('/archive')}
              sx={{ fontWeight: isActive('/archive') ? 700 : 500, color: isActive('/archive') ? 'primary.main' : 'text.secondary' }}
            >
              {t('archive')}
            </Button>
            <Button 
              onClick={() => navigate('/add-parasite')}
              sx={{ fontWeight: isActive('/add-parasite') ? 700 : 500, color: isActive('/add-parasite') ? 'primary.main' : 'text.secondary' }}
            >
              {i18n.language === 'ar' ? 'إضافة عينة' : 'Add Sample'}
            </Button>
          </Box>

          {/* Right Section: Language + User */}
          <Stack direction="row" spacing={1} alignItems="center">
            
            {/*  زر تغيير اللغة الجديد */}
            <Tooltip title="تغيير اللغة / Change Language">
              <IconButton onClick={toggleLanguage} sx={{ color: 'text.secondary' }}>
                <Globe size={20} />
                <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                  {i18n.language === 'ar' ? 'EN' : 'AR'}
                </Typography>
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                <Button 
                  onClick={handleMenu}
                  startIcon={<Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: 14 }}>{user.name[0]}</Avatar>}
                  variant="outlined"
                  sx={{ borderColor: 'divider', borderRadius: 50, px: 2, ml: 1 }}
                >
                  <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, mx: 1 }}>
                    {user.name}
                  </Typography>
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { handleClose(); logout(); }} sx={{ color: 'error.main', gap: 1 }}>
                    <LogOut size={16} /> {t('logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1} ml={1}>
                <Button onClick={() => navigate('/login')}>{t('login')}</Button>
                <Button variant="contained" onClick={() => navigate('/register')}>{t('register')}</Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNav;
