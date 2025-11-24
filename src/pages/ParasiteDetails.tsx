import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Paper, Grid, Button, Chip, Stack, 
  alpha, useTheme, CircularProgress 
} from '@mui/material';
import { ArrowRight, ArrowLeft, Calendar, Tag, Microscope, Activity, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

//  الدالة الذكية المحسنة
const fixImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400';
  
  // 1. إذا كان الرابط خارجياً (http...) نتركه كما هو
  if (url.startsWith('http')) {
    // إذا كنا في الهاتف والرابط localhost، نحوله لـ IP
    if (window.location.hostname !== 'localhost' && url.includes('localhost')) {
      return url.replace('localhost', window.location.hostname); // استخدم نفس هوست المتصفح
    }
    // إذا كنا في الحاسوب، نتركه localhost كما جاء من السيرفر
    return url;
  }
  
  // 2. إذا كان مساراً نسبياً (/images/...)، نضيف له الهوست المناسب
  const baseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : `http://${window.location.hostname}:8000`;
    
  return `${baseUrl}${url}`;
};

// استخدام هوست ديناميكي للاتصال بالسيرفر أيضاً
const getApiUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`; // يعمل تلقائياً سواء كنت localhost أو IP
};

export default function ParasiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  
  const [parasite, setParasite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Zoom Logic
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ display: 'block', backgroundPosition: `${x}% ${y}%` });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getApiUrl()}/parasites`);
        const found = response.data.find((p: any) => p.id === id);
        setParasite(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!parasite) return <Box sx={{ textAlign: 'center', mt: 10 }}><Typography variant="h5">لم يتم العثور على العينة</Typography></Box>;

  const imageUrl = fixImageUrl(parasite.imageUrl);

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#F8F9FC' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Button 
            startIcon={<ArrowIcon size={18} />} 
            onClick={() => navigate('/archive')}
            sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            {t('archive')}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
              
              <Box 
                sx={{ 
                  borderRadius: 3, overflow: 'hidden', height: 350, 
                  bgcolor: '#f1f5f9', position: 'relative', 
                  border: '1px solid', borderColor: 'divider',
                  cursor: 'crosshair'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomStyle({ ...zoomStyle, display: 'none' })}
              >
                {/* الصورة الأساسية */}
                <img 
                  src={imageUrl} 
                  alt={parasite.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    // إذا فشلت الصورة، نضع صورة بديلة
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Error';
                  }}
                />
                
                {/* طبقة التكبير */}
                <Box 
                  sx={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '250%',
                    pointerEvents: 'none',
                    display: zoomStyle.display,
                    backgroundPosition: zoomStyle.backgroundPosition,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                  }} 
                />

                <Chip label={parasite.type.toUpperCase()} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.95)', fontWeight: 800, color: 'primary.main', backdropFilter: 'blur(4px)' }} />
              </Box>
              
              <Typography variant="caption" align="center" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                مرر الماوس للتكبير 
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 3, px: 1 }}>
                <Button fullWidth variant="outlined" startIcon={<Share2 size={18} />}>مشاركة</Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ pl: { md: 2 } }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>{parasite.name}</Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', bgcolor: alpha(theme.palette.primary.main, 0.05), display: 'inline-block', px: 2, py: 0.5, borderRadius: 2 }}>{parasite.scientificName}</Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F9FC', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: 'secondary.main' }}><Activity size={24} /></Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{t('label_stage')}</Typography>
                        <Typography variant="body1" fontWeight={700}>{parasite.stage || 'غير محدد'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F9FC', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: 'warning.main' }}><Calendar size={24} /></Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>تاريخ الإضافة</Typography>
                        <Typography variant="body1" fontWeight={700}>{parasite.createdAt ? new Date(parasite.createdAt).toLocaleDateString() : '2023'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Tag size={20} /> {t('label_desc')}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>{parasite.description}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
