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

  // Set page title for SEO
  useEffect(() => {
    document.title = 'نظام إدارة عينات الطفيليات - الرئيسية';
  }, []);

  // Calculate statistics with optimized logic
  const stats = useMemo(() => {
    if (!parasites || parasites.length === 0) {
      return { total: 0, types: 0, recent: 0 };
    }

    const uniqueTypes = new Set(parasites.map((p) => p.type || 'Unknown'));
    
    // Calculate recent samples (last 30 days)
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

  // Optimized search handler with proper encoding
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/archive?search=${encodeURIComponent(trimmed)}`);
    }
  }, [searchQuery, navigate]);

  // Loading state with professional spinner
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: '#f8f7f5'
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            جاري التحميل...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f7f5', overflow: 'hidden' }}>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          pt: { xs: 2, md: 8 },
          pb: { xs: 4, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            {/* Badge */}
            <Box>
              <Chip
                icon={<ShieldCheck size={16} />}
                label="Academic Database"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.25),
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Box>

            {/* Main Title */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.3rem', md: '2.2rem' },
                letterSpacing: '-0.02em',
                color: theme.palette.primary.main,
                lineHeight: 1.2,
              }}
            >
              نظام إدارة عينات الطفيليات
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                lineHeight: 1.7,
                fontSize: { xs: '0.9rem', md: '1.1rem' },
              }}
            >
              أرشيف أكاديمي متخصص لتوثيق واكتشاف الطفيليات في المختبرات البحثية
            </Typography>

            {/* Search Bar */}
            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={0}
              sx={{
                p: '8px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 550,
                mt: 2,
                borderRadius: 50,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 30px 60px -15px rgba(58, 90, 64, 0.2)',
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <InputAdornment position="start" sx={{ pl: 2, color: 'text.disabled' }}>
                <Search size={22} />
              </InputAdornment>
              <TextField
                fullWidth
                placeholder="ابحث عن نوع طفيلي أو مصدر العينة..."
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
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }
                }}
              >
                بحث
              </Button>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* ===== QUICK STATS SECTION ===== */}
      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -5 }, mb: 8, position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
          gap: 3 
        }}>
          {/* Total Samples Card */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              height: '100%',
              borderRadius: 3,
              border: 'none',
              background: `linear-gradient(135deg, ${alpha('#3B82F6', 0.1)} 0%, ${alpha('#3B82F6', 0.05)} 100%)`,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: '0 12px 20px -5px rgba(59, 130, 246, 0.3)' 
              },
            }}
          >
            <Stack spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#3B82F6',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(5deg) scale(1.1)',
                  }
                }}
              >
                <Database size={24} color="white" />
              </Box>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                color="text.primary" 
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                {stats.total}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}
              >
                إجمالي العينات المسجلة
              </Typography>
            </Stack>
          </Paper>

          {/* Parasite Types Card */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              height: '100%',
              borderRadius: 3,
              border: 'none',
              background: `linear-gradient(135deg, ${alpha('#8B5CF6', 0.1)} 0%, ${alpha('#8B5CF6', 0.05)} 100%)`,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: '0 12px 20px -5px rgba(139, 92, 246, 0.3)' 
              },
            }}
          >
            <Stack spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#8B5CF6',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(-5deg) scale(1.1)',
                  }
                }}
              >
                <Microscope size={24} color="white" />
              </Box>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                color="text.primary" 
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                {stats.types}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}
              >
                أنواع الطفيليات المكتشفة
              </Typography>
            </Stack>
          </Paper>

          {/* Recent Samples Card */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              height: '100%',
              borderRadius: 3,
              border: 'none',
              background: `linear-gradient(135deg, ${alpha('#10B981', 0.1)} 0%, ${alpha('#10B981', 0.05)} 100%)`,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: '0 12px 20px -5px rgba(16, 185, 129, 0.3)' 
              },
            }}
          >
            <Stack spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#10B981',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(5deg) scale(1.1)',
                  }
                }}
              >
                <Activity size={24} color="white" />
              </Box>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                color="text.primary" 
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                {stats.recent}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}
              >
                عينات مضافة خلال 30 يوم
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Container>

      {/* ===== CALL TO ACTION SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: '#ffffff',
            borderRadius: 3,
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
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
              filter: 'blur(60px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
              filter: 'blur(60px)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h4" 
              fontWeight={800} 
              sx={{ 
                mb: 2, 
                color: '#ffffff', 
                fontSize: { xs: '1.3rem', md: '1.8rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              ساهم في توسيع الأرشيف
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                opacity: 0.95, 
                color: '#ffffff', 
                fontSize: { xs: '0.95rem', md: '1rem' },
                textShadow: '0 1px 5px rgba(0,0,0,0.1)',
              }}
            >
              أضف اكتشافات جديدة ووسّع قاعدة البيانات الأكاديمية
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              {/* Primary CTA Button with Glow Effect */}
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/add-parasite')}
                sx={{
                  bgcolor: '#FFD700',
                  color: '#1a1a1a',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 4px 15px rgba(0,0,0,0.2)',
                  animation: 'pulseGlow 2s ease-in-out infinite',
                  '@keyframes pulseGlow': {
                    '0%, 100%': {
                      boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)',
                    },
                    '50%': {
                      boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.6)',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#FFC700',
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 15px 30px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.8)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                إضافة عينة جديدة
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
                  px: 4,
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
                استعراض الأرشيف
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: '#2d4733', color: 'white', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 4, 
            mb: 4 
          }}>
            {/* About Section */}
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Microscope size={20} />
                نظام الطفيليات
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ opacity: 0.8, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '0.95rem' } }}
              >
                أرشيف أكاديمي متخصص للطفيليات يدعم الباحثين والطلاب في المختبرات البحثية والأكاديمية.
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
                  sx={{ 
                    justifyContent: 'flex-start', 
                    textTransform: 'none', 
                    pl: 0, 
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      pl: 1,
                    }
                  }}
                  onClick={() => navigate('/archive')}
                >
                  الأرشيف الكامل
                </Button>
                <Button
                  color="inherit"
                  sx={{ 
                    justifyContent: 'flex-start', 
                    textTransform: 'none', 
                    pl: 0, 
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      pl: 1,
                    }
                  }}
                  onClick={() => navigate('/dashboard')}
                  disabled={!user}
                >
                  لوحة التحكم
                </Button>
                <Button
                  color="inherit"
                  sx={{ 
                    justifyContent: 'flex-start', 
                    textTransform: 'none', 
                    pl: 0, 
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      pl: 1,
                    }
                  }}
                  onClick={() => navigate('/add-parasite')}
                >
                  إضافة عينة
                </Button>
              </Stack>
            </Box>

            {/* Project Info */}
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                معلومات المشروع
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ opacity: 0.8, mb: 1, fontSize: { xs: '0.9rem', md: '0.95rem' } }}
              >
                <strong>المؤسسة:</strong> كلية البيولوجيا
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ opacity: 0.8, mb: 1, fontSize: { xs: '0.9rem', md: '0.95rem' } }}
              >
                <strong>القسم:</strong> قسم علم الطفيليات
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ opacity: 0.8, fontSize: { xs: '0.9rem', md: '0.95rem' } }}
              >
                <strong>المطور:</strong> Mehdi Boubetana
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2 
          }}>
            <Typography 
              variant="body2" 
              sx={{ opacity: 0.7, fontSize: { xs: '0.85rem', md: '0.9rem' } }}
            >
              © 2025 Parasites Database. جميع الحقوق محفوظة.
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ opacity: 0.6, fontSize: { xs: '0.75rem', md: '0.85rem' } }}
            >
              Created with ❤️ by Mehdi Boubetana
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;