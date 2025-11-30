import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Grid,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Database,
  Activity,
  Microscope,
  ChevronRight,
  ShieldCheck,
  Beaker,
  Droplets,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { parasites, loading } = useParasites();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchTerm] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate statistics
  const stats = useMemo(() => {
    if (!parasites || parasites.length === 0) {
      return {
        total: 0,
        types: 0,
        sources: 0,
        typeDistribution: [],
        sourceDistribution: [],
      };
    }

    // Count types
    const uniqueTypes = new Set(parasites.map((p) => p.type || 'Unknown'));

    // Count sources
    const typeCounts = parasites.reduce(
      (acc, p) => {
        const type = p.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const typeDistribution = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
      color: theme.palette.primary.main,
    }));

    const sourceDistribution = [
      { name: 'Blood', value: 2, color: '#dc2626' },
      { name: 'Tissue', value: 2, color: '#ea580c' },
      { name: 'Feces', value: 1, color: '#a3b18a' },
      { name: 'Skin', value: 1, color: '#588157' },
    ];

    return {
      total: parasites.length,
      types: uniqueTypes.size,
      sources: 4,
      typeDistribution,
      sourceDistribution,
    };
  }, [parasites, theme]);

  // Get latest parasites
  const latestParasites = useMemo(
    () => (parasites ? parasites.slice(0, 6) : []),
    [parasites]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate('/archive?search=' + searchQuery);
  };

  const COLORS = ['#3a5a40', '#588157', '#a3b18a', '#2d4733', '#d4a574', '#ea580c'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f7f5', overflow: 'hidden' }}>
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
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

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            {/* Badge */}
            <Chip
              icon={<ShieldCheck size={16} />}
              label={t('academic_database') || 'Academic Database'}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                fontWeight: 600,
                px: 1,
              }}
            />

            {/* Main Title */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
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
                fontSize: { xs: '1rem', md: '1.25rem' },
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
                InputProps={{ disableUnderline: true, sx: { fontSize: '1rem' } }}
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
                }}
              >
                بحث
              </Button>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* ===== QUICK STATS SECTION ===== */}
      <Container maxWidth="lg" sx={{ mt: -8, mb: 6, position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {/* Total Samples */}
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.6)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' },
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Database size={28} />
            </Box>
            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إجمالي العينات المسجلة
            </Typography>
          </Paper>

          {/* Parasite Types */}
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.6)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' },
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.15),
                color: theme.palette.secondary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Microscope size={28} />
            </Box>
            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
              {stats.types}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              أنواع الطفيليات المكتشفة
            </Typography>
          </Paper>

          {/* Sample Sources */}
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.6)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' },
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: alpha('#dc2626', 0.15),
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Beaker size={28} />
            </Box>
            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
              {stats.sources}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              مصادر العينات المختلفة
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* ===== LATEST DISCOVERIES SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              color="text.primary"
              sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Activity size={32} style={{ color: theme.palette.primary.main }} />
              آخر الاكتشافات
            </Typography>
            <Typography variant="body1" color="text.secondary">
              العينات المضافة حديثاً في المختبر
            </Typography>
          </Box>

          {loading ? (
            <Typography color="text.secondary">جاري تحميل البيانات...</Typography>
          ) : latestParasites.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {latestParasites.map((parasite) => (
                <Card
                  key={parasite.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                    },
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  onClick={() => navigate(`/parasites/${parasite.id}`)}
                >
                  {parasite.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={parasite.imageUrl}
                      alt={parasite.scientificName}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                      {parasite.scientificName}
                    </Typography>
                    {parasite.arabicName && (
                      <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                        {parasite.arabicName}
                      </Typography>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Microscope size={16} color={theme.palette.secondary.main} />
                        <Typography variant="caption" color="text.secondary">
                          {parasite.type || 'غير محدد'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Droplets size={16} color="#dc2626" />
                        <Typography variant="caption" color="text.secondary">
                          {parasite.hostSpecies || 'غير محدد'}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <AlertCircle size={40} style={{ margin: '0 auto', marginBottom: 16, color: theme.palette.primary.main }} />
              <Typography color="text.secondary">لا توجد عينات مسجلة حالياً</Typography>
            </Paper>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              endIcon={<ChevronRight size={20} />}
              onClick={() => navigate('/archive')}
              sx={{ textTransform: 'none', fontSize: '1rem' }}
            >
              عرض الأرشيف الكامل
            </Button>
          </Box>
        </Stack>
      </Container>

      {/* ===== SAMPLE SOURCES DISTRIBUTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(255,255,255,0.7)',
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Beaker size={28} style={{ color: theme.palette.primary.main }} />
            توزيع مصادر العينات
          </Typography>
          {!isMobile && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          {isMobile && (
            <List dense>
              {stats.sourceDistribution.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.color,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name}: ${item.value} عينة`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      {/* ===== LABORATORY SUPPORT SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
              أنواع المختبرات المدعومة
            </Typography>
            <Typography variant="body1" color="text.secondary">
              النظام يدعم جميع أنواع الفحوصات المخبرية
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {[
              { icon: Droplets, label: 'Blood Tests', color: '#dc2626' },
              { icon: Beaker, label: 'Tissue Analysis', color: '#ea580c' },
              { icon: AlertCircle, label: 'Stool Examination', color: '#a3b18a' },
              { icon: Microscope, label: 'Microscopy Studies', color: theme.palette.primary.main },
            ].map((item, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' },
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    margin: '0 auto',
                    borderRadius: 2,
                    bgcolor: alpha(item.color, 0.1),
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <item.icon size={32} />
                </Box>
                <Typography variant="body1" fontWeight={600}>
                  {item.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Container>

      {/* ===== QUICK ACCESS CTA SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            ساهم في توسيع الأرشيف
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            أضف اكتشافات جديدة ووسّع قاعدة البيانات الأكاديمية
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate('/add-parasite')}
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              إضافة عينة جديدة
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/statistics')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              الإحصائيات المتقدمة
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: '#2d4733', color: 'white', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 4 }}>
            {/* About */}
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Microscope size={24} />
                نظام الطفيليات
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
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
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', pl: 0 }}
                  onClick={() => navigate('/archive')}
                >
                  الأرشيف الكامل
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', pl: 0 }}
                  onClick={() => navigate('/statistics')}
                >
                  الإحصائيات
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', pl: 0 }}
                  onClick={() => navigate('/add-parasite')}
                >
                  إضافة عينة
                </Button>
              </Stack>
            </Box>

            {/* Developer Credit */}
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                معلومات المشروع
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                <strong>المطور:</strong> Mehdi Boubetana
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <strong>التخصص:</strong> Parasitology Laboratory System
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 Parasites Database. جميع الحقوق محفوظة.
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Created with ❤️ by Mehdi Boubetana
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
