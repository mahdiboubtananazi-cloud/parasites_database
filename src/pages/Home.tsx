import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Stack,
  Grid, // ✅ العودة للاستيراد القياسي
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Database, ArrowLeft, Microscope } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      title: 'أرشيف الطفيليات',
      description: 'تصفح قاعدة البيانات الشاملة وابحث عن العينات المصنفة.',
      icon: <Database size={32} />,
      path: '/archive',
      color: theme.palette.primary.main,
      bg: alpha(theme.palette.primary.main, 0.1),
      action: 'تصفح الأرشيف'
    },
    {
      title: 'إضافة عينة جديدة',
      description: 'ساهم في إثراء قاعدة البيانات بإضافة طفيليات جديدة.',
      icon: <Plus size={32} />,
      path: '/add-parasite',
      color: theme.palette.secondary.main,
      bg: alpha(theme.palette.secondary.main, 0.1),
      action: 'إضافة طفيلي',
      restricted: true
    },
    {
      title: 'البحث المتقدم',
      description: 'استخدم أدوات البحث للعثور على الفصائل النادرة بدقة.',
      icon: <Search size={32} />,
      path: '/archive',
      color: theme.palette.warning.main,
      bg: alpha(theme.palette.warning.main, 0.1),
      action: 'بحث الآن'
    }
  ];

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0F62FE 0%, #0043ce 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: '0 0 40px 40px' },
          mb: 6,
          boxShadow: '0 10px 40px rgba(15, 98, 254, 0.2)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Box 
                  sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    width: 'fit-content',
                    px: 2,
                    py: 1,
                    borderRadius: 50,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Microscope size={20} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    قاعدة البيانات الرقمية الجامعية
                  </Typography>
                </Box>
                
                <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  اكتشف عالم <br />
                  <span style={{ color: '#6ee7b7' }}>الطفيليات المجهرية</span>
                </Typography>
                
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, fontWeight: 400 }}>
                  منصة علمية متكاملة للطلاب والباحثين لتوثيق، تصنيف، ودراسة الطفيليات بأحدث التقنيات الرقمية.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={2}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/archive')}
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      fontSize: '1.1rem',
                      px: 4,
                      '&:hover': { bgcolor: '#f8f9fa' }
                    }}
                  >
                    ابدأ التصفح
                  </Button>
                  {!user && (
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.5)', 
                        color: 'white',
                        fontSize: '1.1rem',
                        px: 4,
                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                    >
                      إنشاء حساب
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    height: 400,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                  }
                }}
              >
                <Microscope size={300} strokeWidth={0.5} style={{ opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Cards Section */}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {features.map((item, index) => (
            (!item.restricted || user) && (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(item.path)}
                  sx={{
                    p: 4,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: item.color,
                      boxShadow: '0 10px 40px -10px ' + alpha(item.color, 0.3)
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 4, 
                      bgcolor: item.bg, 
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1
                    }}
                  >
                    {item.icon}
                  </Box>
                  
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {item.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', color: item.color, fontWeight: 'bold' }}>
                    {item.action} <ArrowLeft size={18} style={{ marginRight: 8 }} />
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
