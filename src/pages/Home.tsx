import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Database,
  Activity,
  Microscope,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { parasites, loading } = useParasites();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchTerm] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    document.title = t('app_title');
  }, [t]);

  const stats = useMemo(() => {
    if (!parasites || parasites.length === 0) {
      return { total: 0, types: 0, recent: 0 };
    }

    const uniqueTypes = new Set(parasites.map((p) => p.type || 'Unknown'));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSamples = parasites.filter(p => {
      const createdDate = p.createdAt ? new Date(p.createdAt) : null;
      return createdDate && createdDate >= thirtyDaysAgo;
    }).length;

    return {
      total: parasites.length,
      types: uniqueTypes.size,
      recent: recentSamples,
    };
  }, [parasites]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/archive?search=${encodeURIComponent(trimmed)}`);
    }
  }, [searchQuery, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            {t('error_loading')}...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha('#10B981', 0.08)} 100%)`,
          pt: { xs: 4, md: 10 },
          pb: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern - احترافي */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.15)} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            opacity: 0.4,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            {/* Badge */}
            <Box>
              <Chip
                icon={<ShieldCheck size={16} />}
                label={t('app_subtitle')}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  height: 'auto',
                  py: 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Box>

            {/* Main Title */}
            <Stack spacing={1}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                  letterSpacing: '-0.02em',
                  color: theme.palette.primary.main,
                  lineHeight: 1.2,
                }}
              >
                {t('app_title')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: 700,
                  lineHeight: 1.8,
                  fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.2rem' },
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                }}
              >
                {t('hero_description')}
              </Typography>
            </Stack>

            {/* Search Bar */}
            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={0}
              sx={{
                p: '6px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                mt: 2,
                borderRadius: 50,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.15)}`,
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 30px 60px -15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <InputAdornment position="start" sx={{ pl: 2, color: 'action.disabled' }}>
                <Search size={22} />
              </InputAdornment>
              <TextField
                fullWidth
                placeholder={t('search_placeholder')}
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '0.9rem', md: '1rem' } }
                }}
                sx={{ px: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 50,
                  px: { xs: 2, md: 4 },
                  py: 1.5,
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }
                }}
              >
                {t('btn_search')}
              </Button>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* ===== QUICK STATS SECTION ===== */}
      <Container maxWidth="lg" sx={{ mt: { xs: -3, md: -5 }, mb: 10, position: 'relative', zIndex: 2 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 }
        }}>
          {/* Card 1: Total Samples */}
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              height: '100%',
              borderRadius: 2,
              border: 'none',
              background: `linear-gradient(135deg, ${alpha('#3B82F6', 0.08)} 0%, ${alpha('#3B82F6', 0.04)} 100%)`,     
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2)'
              },
            }}
          >
            <Stack spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#3B82F6',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Database size={28} color="white" />
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{ 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: theme.palette.text.primary,
                  }}
                >
                  {stats.total}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {t('stats_total_samples')}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Card 2: Parasite Types */}
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              height: '100%',
              borderRadius: 2,
              border: 'none',
              background: `linear-gradient(135deg, ${alpha('#8B5CF6', 0.08)} 0%, ${alpha('#8B5CF6', 0.04)} 100%)`,     
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.2)'
              },
            }}
          >
            <Stack spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#8B5CF6',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Microscope size={28} color="white" />
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{ 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: theme.palette.text.primary,
                  }}
                >
                  {stats.types}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {t('stats_parasite_types')}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Card 3: Recent Samples */}
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              height: '100%',
              borderRadius: 2,
              border: 'none',
              background: `linear-gradient(135deg, ${alpha('#10B981', 0.08)} 0%, ${alpha('#10B981', 0.04)} 100%)`,     
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2)'
              },
            }}
          >
            <Stack spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#10B981',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Activity size={28} color="white" />
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{ 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: theme.palette.text.primary,
                  }}
                >
                  {stats.recent}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {t('stats_recent_samples')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Container>

      {/* ===== CALL TO ACTION SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Paper
          sx={{
            p: { xs: 3.5, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: '#ffffff',
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 250,
              height: 250,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.08)',
              filter: 'blur(80px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 250,
              height: 250,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.08)',
              filter: 'blur(80px)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                mb: 1.5,
                color: '#ffffff',
                fontSize: { xs: '1.4rem', md: '2rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {t('stats_title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                opacity: 0.95, 
                color: '#ffffff',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                textShadow: '0 1px 5px rgba(0,0,0,0.15)',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {t('stats_subtitle')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ flexWrap: 'wrap' }}
            >
              {/* Primary Button */}
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/add-parasite')}
                sx={{
                  bgcolor: '#FFD700',
                  color: '#1a1a1a',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: { xs: 2, md: 4 },
                  py: 1.5,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                  '&:hover': {
                    bgcolor: '#FFC700',
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 15px 30px rgba(255, 215, 0, 0.6)',
                  },
                }}
              >
                {t('btn_add_sample')}
              </Button>

              {/* Secondary Button */}
              <Button
                variant="outlined"
                onClick={() => navigate('/archive')}
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: { xs: 2, md: 4 },
                  py: 1.5,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(255,255,255,0.2)',
                  },
                }}
              >
                {t('btn_browse_archive')}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: theme.palette.primary.dark, color: 'white', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 4
          }}>
            {/* About */}
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Microscope size={20} />
                {t('app_title')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                {t('hero_description')}
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                روابط سريعة
              </Typography>
              <Stack spacing={1}>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', pl: 0 }}
                  onClick={() => navigate('/archive')}
                >
                  {t('nav_parasites')}
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', pl: 0 }}
                  onClick={() => navigate('/add-parasite')}
                >
                  {t('nav_add_parasite')}
                </Button>
              </Stack>
            </Box>

            {/* Info */}
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                معلومات
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                <strong>القسم:</strong> علم الطفيليات
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <strong>الكلية:</strong> البيولوجيا
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              © 2025 Parasites Database. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
