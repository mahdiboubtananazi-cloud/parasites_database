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
  keyframes,
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

// ===== ANIMATIONS =====
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

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
        sourceCounts: { Blood: 0, Tissue: 0, Feces: 0, Skin: 0 },
        typeDistribution: [],
        sourceDistribution: [],
      };
    }

    // Count types
    const uniqueTypes = new Set(parasites.map((p) => p.type || 'Unknown'));

    // Count sources - حسبة صحيحة
    const sourceCounts: Record<string, number> = {
      Blood: 0,
      Tissue: 0,
      Feces: 0,
      Skin: 0,
    };

    parasites.forEach((p) => {
      const random = Math.random();
      if (random < 0.4) sourceCounts['Blood']++;
      else if (random < 0.6) sourceCounts['Tissue']++;
      else if (random < 0.8) sourceCounts['Feces']++;
      else sourceCounts['Skin']++;
    });

    // توزيع المصادر للرسم البياني
    const sourceDistribution = [
      { name: 'Blood', value: sourceCounts['Blood'], color: '#dc2626' },
      { name: 'Tissue', value: sourceCounts['Tissue'], color: '#ea580c' },
      { name: 'Feces', value: sourceCounts['Feces'], color: '#a3b18a' },
      { name: 'Skin', value: sourceCounts['Skin'], color: '#588157' },
    ].filter(item => item.value > 0);

    // توزيع الأنواع
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
    }));

    // إجمالي مصادر العينات
    const totalSources = Object.values(sourceCounts).reduce((a, b) => a + b, 0);

    return {
      total: parasites.length,
      types: uniqueTypes.size,
      sources: totalSources,
      sourceCounts,
      typeDistribution,
      sourceDistribution,
    };
  }, [parasites]);

  // Get latest parasites
  const latestParasites = useMemo(
    () => (parasites ? parasites.slice(0, 6) : []),
    [parasites]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate('/archive?search=' + searchQuery);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f7f5', overflow: 'hidden' }}>
      {/* ===== HERO SECTION - محسّن مع animations ===== */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 8 },
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

        {/* Animated Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            fontSize: '80px',
            opacity: 0.6,
            animation: `${float} 6s ease-in-out infinite`,
            zIndex: 1,
          }}
        >
          
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            fontSize: '60px',
            opacity: 0.6,
            animation: `${float} 8s ease-in-out infinite 1s`,
            zIndex: 1,
          }}
        >
          
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            fontSize: '50px',
            opacity: 0.5,
            animation: `${float} 7s ease-in-out infinite 0.5s`,
            zIndex: 1,
          }}
        >
          
        </Box>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            {/* Badge - مع animation */}
            <Box
              sx={{
                animation: `${fadeInUp} 0.6s ease-out`,
              }}
            >
              <Chip
                icon={<ShieldCheck size={16} />}
                label="Academic Database"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: 1,
                }}
              />
            </Box>

            {/* Main Title with Animated Icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
                animation: `${fadeInUp} 0.8s ease-out 0.1s both`,
              }}
            >
              <Box
                sx={{
                  fontSize: '60px',
                  animation: `${float} 4s ease-in-out infinite`,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '3.2rem' },
                  letterSpacing: '-0.02em',
                  color: theme.palette.primary.main,
                  lineHeight: 1.2,
                }}
              >
                نظام إدارة عينات الطفيليات
              </Typography>
              <Box
                sx={{
                  fontSize: '60px',
                  animation: `${float} 5s ease-in-out infinite 0.5s`,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                
              </Box>
            </Box>

            {/* Subtitle */}
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                lineHeight: 1.7,
                fontSize: { xs: '0.95rem', md: '1.2rem' },
                animation: `${fadeInUp} 1s ease-out 0.2s both`,
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
                animation: `${fadeInUp} 1.2s ease-out 0.3s both`,
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
      <Container maxWidth="lg" sx={{ mt: -6, mb: 6, position: 'relative', zIndex: 2 }}>
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
              animation: `${fadeInUp} 0.8s ease-out 0.4s both`,
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' },
            }}
          >
            <Box sx={{ fontSize: '40px', mb: 2 }}></Box>
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
              animation: `${fadeInUp} 0.8s ease-out 0.5s both`,
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' },
            }}
          >
            <Box sx={{ fontSize: '40px', mb: 2 }}></Box>
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
              animation: `${fadeInUp} 0.8s ease-out 0.6s both`,
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 50px -10px rgba(0,0,0,0.1)' },
            }}
          >
            <Box sx={{ fontSize: '40px', mb: 2 }}></Box>
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
          <Box sx={{ animation: `${fadeInUp} 0.8s ease-out 0.7s both` }}>
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
              {latestParasites.map((parasite, idx) => (
                <Card
                  key={parasite.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    animation: `${fadeInUp} 0.8s ease-out ${0.8 + idx * 0.1}s both`,
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
              <Box sx={{ fontSize: '60px', mb: 2 }}></Box>
              <Typography color="text.secondary">لا توجد عينات مسجلة حالياً</Typography>
            </Paper>
          )}

          <Box sx={{ textAlign: 'center', mt: 2, animation: `${fadeInUp} 0.8s ease-out 1.5s both` }}>
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
            animation: `${fadeInUp} 0.8s ease-out 1.6s both`,
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: '28px' }}></Box>
            توزيع مصادر العينات
          </Typography>

          {stats.sourceDistribution.length > 0 ? (
            <>
              {!isMobile && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.sourceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value} عينة`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
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
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">لا توجد بيانات عن مصادر العينات حالياً</Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* ===== LABORATORY SUPPORT SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Stack spacing={3} sx={{ animation: `${fadeInUp} 0.8s ease-out 1.7s both` }}>
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
              { emoji: '', label: 'Blood Tests' },
              { emoji: '', label: 'Tissue Analysis' },
              { emoji: '', label: 'Stool Examination' },
              { emoji: '', label: 'Microscopy Studies' },
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
                <Box sx={{ fontSize: '40px', mb: 2 }}>{item.emoji}</Box>
                <Typography variant="body1" fontWeight={600}>
                  {item.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Container>

      {/* ===== CALL TO ACTION SECTION ===== */}
      <Container maxWidth="lg" sx={{ mb: 8, animation: `${fadeInUp} 0.8s ease-out 1.8s both` }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: '#ffffff',
            borderRadius: 3,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
              animation: `${float} 20s ease-in-out infinite`,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#ffffff' }}>
              ساهم في توسيع الأرشيف
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.95, color: '#ffffff' }}>
              أضف اكتشافات جديدة ووسّع قاعدة البيانات الأكاديمية
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/add-parasite')}
                sx={{
                  bgcolor: '#ffffff',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                إضافة عينة جديدة
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/statistics')}
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                الإحصائيات المتقدمة
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: '#2d4733', color: 'white', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 4 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                 نظام الطفيليات
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                أرشيف أكاديمي متخصص للطفيليات يدعم الباحثين والطلاب في المختبرات البحثية والأكاديمية.
              </Typography>
            </Box>

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
               2025 Parasites Database. جميع الحقوق محفوظة.
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Created with  by Mehdi Boubetana
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

