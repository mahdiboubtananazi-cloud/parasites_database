import React from 'react';
import { 
  Box, Container, Typography, Paper, Button, Stack, Grid, alpha, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Database, ArrowLeft, ArrowRight, Microscope } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const features = [
    {
      title: t('feature_archive_title'),
      description: t('feature_archive_desc'),
      icon: <Database size={32} />,
      path: '/archive',
      color: theme.palette.primary.main,
      bg: alpha(theme.palette.primary.main, 0.1),
      action: t('btn_browse')
    },
    {
      title: t('feature_add_title'),
      description: t('feature_add_desc'),
      icon: <Plus size={32} />,
      path: '/add-parasite',
      color: theme.palette.secondary.main,
      bg: alpha(theme.palette.secondary.main, 0.1),
      action: t('btn_add'),
      restricted: true
    },
    {
      title: t('feature_search_title'),
      description: t('feature_search_desc'),
      icon: <Search size={32} />,
      path: '/archive',
      color: theme.palette.warning.main,
      bg: alpha(theme.palette.warning.main, 0.1),
      action: t('btn_search')
    }
  ];

  return (
    <Box sx={{ pb: 8 }}>
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0F62FE 0%, #0043ce 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          borderRadius: { xs: 0, md: '0 0 40px 40px' },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.1)', width: 'fit-content', px: 2, py: 1, borderRadius: 50 }}>
                  <Microscope size={20} />
                  <Typography variant="subtitle2" fontWeight="bold">Parasite Database</Typography>
                </Box>
                
                <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {t('hero_title')} <br />
                  <span style={{ color: '#6ee7b7' }}>{t('hero_subtitle')}</span>
                </Typography>
                
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, fontWeight: 400 }}>
                  {t('hero_desc')}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
                  <Button variant="contained" size="large" onClick={() => navigate('/archive')} sx={{ bgcolor: 'white', color: 'primary.main', px: 4, '&:hover': { bgcolor: '#f8f9fa' } }}>
                    {t('start_browsing')}
                  </Button>
                  {!user && (
                    <Button variant="outlined" size="large" onClick={() => navigate('/register')} sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', px: 4, '&:hover': { borderColor: 'white' } }}>
                      {t('create_account')}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Microscope size={300} strokeWidth={0.5} style={{ opacity: 0.8, color: 'white' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {features.map((item, index) => (
            (!item.restricted || user) && (
              <Grid item xs={12} md={4} key={index}>
                <Paper onClick={() => navigate(item.path)} sx={{ p: 4, height: '100%', cursor: 'pointer', border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 2, '&:hover': { borderColor: item.color, boxShadow: `0 10px 40px -10px ${alpha(item.color, 0.3)}` } }}>
                  <Box sx={{ width: 60, height: 60, borderRadius: 4, bgcolor: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>{item.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{item.description}</Typography>
                  </Box>
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', color: item.color, fontWeight: 'bold' }}>
                    {item.action} <ArrowIcon size={18} style={{ marginInlineStart: 8 }} />
                  </Box>
                </Paper>
              </Grid>
            )
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
