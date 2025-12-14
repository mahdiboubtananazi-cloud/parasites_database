# ==========================================
# ????? TopNav.tsx
# ==========================================
Set-Content -Path 'src/components/layout/TopNav.tsx' -Value @'
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Microscope, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

const TopNav = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setAnchorEl(null);
  };

  return (
    <AppBar position='sticky' sx={{ backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ p: 1, backgroundColor: '#3a5a40', borderRadius: '12px', color: 'white' }}>
              <Microscope size={24} />
            </Box>
            <Box>
              <Typography variant='h6' sx={{ color: '#3a5a40', fontWeight: 800 }}>{t('app_title')}</Typography>
              <Typography variant='caption' sx={{ color: '#748dc8', fontWeight: 600 }}>{t('app_subtitle')}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button onClick={(e) => setAnchorEl(e.currentTarget)} startIcon={<Globe size={18} />}>
              {i18n.language === 'ar' ? '???????' : 'English'}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => changeLanguage('ar')}>???????</MenuItem>
              <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
            </Menu>
            <Button onClick={handleLogout} color='error'>{t('nav_logout')}</Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TopNav;
'@

# ==========================================
# ????? Home.tsx
# ==========================================
Set-Content -Path 'src/pages/Home.tsx' -Value @'
import React from 'react';
import { Container, Box, Typography, Button, Paper, InputBase } from '@mui/material';
import { Search, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Box sx={{ background: 'linear-gradient(135deg, #3a5a40 0%, #344e41 100%)', pt: 12, pb: 16, color: 'white', textAlign: 'center' }}>
        <Container maxWidth='md'>
          <Typography variant='h2' sx={{ fontWeight: 900, mb: 3 }}>{t('app_title')}</Typography>
          <Typography variant='h5' sx={{ mb: 6, opacity: 0.9 }}>{t('hero_description')}</Typography>
          
          <Paper sx={{ p: '8px 16px', display: 'flex', alignItems: 'center', borderRadius: '16px', maxWidth: 600, mx: 'auto' }}>
            <Search size={24} color='#748dc8' />
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder={t('search_placeholder')} />
            <Button variant='contained' sx={{ borderRadius: '12px', bgcolor: '#3a5a40' }}>{t('btn_search')}</Button>
          </Paper>

          <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant='contained' size='large' onClick={() => navigate('/archive')} startIcon={<Database />} sx={{ bgcolor: 'white', color: '#3a5a40' }}>
              {t('btn_browse_archive')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default Home;
'@

Write-Host '? ?? ????? ???? ??????? ?????!' -ForegroundColor Green
