import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Paper, Button, Chip, Stack, 
  alpha, useTheme, CircularProgress, Divider
} from '@mui/material';
import { ArrowRight, ArrowLeft, Calendar, Tag, Activity, Share2, Microscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../hooks/useParasites';

// تصحيح روابط الصور
const fixImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';
  
  // إذا كان الرابط كاملاً (http/https) استخدمه مباشرة
  if (url.startsWith('http')) {
    return url;
  }
  
  // إذا كان رابط نسبي، أضف الـ base URL للـ API
  const apiBase = process.env.REACT_APP_API_URL || 'https://parasites-api.onrender.com/api';
  return `${apiBase}${url}`;
};

export default function ParasiteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  
  const { parasites, loading: loadingParasites } = useParasites();
  
  const [parasite, setParasite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Zoom Logic
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ display: 'block', backgroundPosition: `${x}% ${y}%` });
  };

  useEffect(() => {
    setLoading(loadingParasites);
    
    if (!loadingParasites && parasites && parasites.length > 0) {
      console.log('All parasites:', parasites);
      console.log('Looking for ID:', id);
      
      // ابحث عن الطفيلي في الـ list
      const found = parasites.find((p: any) => {
        console.log('Comparing:', p.id, '===', id);
        return p.id === id;
      });
      
      if (found) {
        console.log('Found parasite:', found);
        setParasite(found);
        setError(null);
      } else {
        console.error('Parasite not found');
        setError('لم يتم العثور على الطفيلي في قاعدة البيانات');
        setParasite(null);
      }
    }
  }, [id, parasites, loadingParasites]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">جاري تحميل البيانات...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error || !parasite) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8F9FC' }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', maxWidth: 500, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h4" color="error" gutterBottom sx={{ mb: 2 }}>
            ❌ خطأ في التحميل
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error || 'لم يتم العثور على بيانات الطفيلي.'}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 3 }}>
            ID: {id}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button onClick={() => navigate('/archive')} variant="contained">
              العودة للأرشيف
            </Button>
            <Button onClick={() => window.location.reload()} variant="outlined">
              إعادة تحميل
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ✅ استخدم imageurl (lowercase) من Database
  const imageUrl = fixImageUrl((parasite as any).imageurl);

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#F8F9FC' }}>
      {/* Header Navigation */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 2, position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="lg">
          <Button 
            startIcon={<ArrowIcon size={18} />} 
            onClick={() => navigate('/archive')}
            sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            {t('archive') || 'الأرشيف'}
          </Button>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Image Section */}
          <Box>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 100 }}>
              
              <Box 
                sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden', 
                  height: { xs: 300, md: 400 }, 
                  bgcolor: '#f1f5f9', 
                  position: 'relative', 
                  border: '1px solid', 
                  borderColor: 'divider',
                  cursor: 'crosshair'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomStyle({ ...zoomStyle, display: 'none' })}
              >
                {/* Main Image */}
                <img 
                  src={imageUrl} 
                  alt={parasite.name || parasite.scientificName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                  }}
                />
                
                {/* Zoom Image */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '250%',
                    pointerEvents: 'none',
                    display: zoomStyle.display,
                    backgroundPosition: zoomStyle.backgroundPosition,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                    borderRadius: 3
                  }} 
                />

                {/* Type Badge */}
                <Chip 
                  label={(parasite.type || 'غير محدد').toUpperCase()} 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    [isRtl ? 'right' : 'left']: 16, 
                    bgcolor: 'rgba(255,255,255,0.95)', 
                    fontWeight: 800, 
                    color: 'primary.main', 
                    backdropFilter: 'blur(4px)',
                    zIndex: 10
                  }} 
                />
              </Box>
              
              <Typography variant="caption" align="center" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                💡 حرك الماوس لتكبير الصورة
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 3, px: 1 }}>
                <Button fullWidth variant="outlined" startIcon={<Share2 size={18} />} disabled>
                  مشاركة
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* Info Section */}
          <Box>
            {/* Title Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3" 
                fontWeight={800} 
                color="text.primary" 
                sx={{ mb: 2, fontSize: { xs: '1.6rem', md: '2.2rem' } }}
              >
                {parasite.name || parasite.scientificName || 'بدون اسم'}
              </Typography>
              <Typography 
                variant="h6" 
                color="primary.main" 
                sx={{ 
                  fontStyle: 'italic', 
                  fontFamily: '"Times New Roman", serif', 
                  bgcolor: alpha(theme.palette.primary.main, 0.08), 
                  display: 'inline-block', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}
              >
                {parasite.scientificName || 'غير محدد'}
              </Typography>
            </Box>

            {/* Basic Info Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F9FC', border: '1px solid', borderColor: 'divider', borderRadius: 3, transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.2, bgcolor: 'white', borderRadius: 2, color: 'secondary.main', display: 'flex', alignItems: 'center' }}>
                    <Activity size={24} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                      مرحلة الطفيلي
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {(parasite as any).stage || 'غير محدد'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F9FC', border: '1px solid', borderColor: 'divider', borderRadius: 3, transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ p: 1.2, bgcolor: 'white', borderRadius: 2, color: 'warning.main', display: 'flex', alignItems: 'center' }}>
                    <Calendar size={24} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                      تاريخ الإضافة
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {(parasite as any).createdat 
                        ? new Date((parasite as any).createdat).toLocaleDateString('ar-SA') 
                        : 'غير محدد'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'primary.main' }}
              >
                <Tag size={20} /> 
                الوصف
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
              >
                {(parasite as any).description || 'لا يوجد وصف متاح'}
              </Typography>
            </Box>

            {/* Sample Details */}
            {((parasite as any).sampletype || (parasite as any).stainColor) && (
              <Box sx={{ mb: 4, p: 3, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
                  <Microscope size={18} />
                  تفاصيل العينة
                </Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {(parasite as any).sampletype && (
                    <Typography variant="body2">
                      <Typography component="span" fontWeight={700}>نوع العينة:</Typography> {(parasite as any).sampletype}
                    </Typography>
                  )}
                  {(parasite as any).stainColor && (
                    <Typography variant="body2">
                      <Typography component="span" fontWeight={700}>نوع الصبغة:</Typography> {(parasite as any).stainColor}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            {/* Additional Info */}
            {((parasite as any).studentName || (parasite as any).supervisorName) && (
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.2) }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'info.main' }}>
                  معلومات إضافية
                </Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {(parasite as any).studentName && (
                    <Typography variant="body2">
                      <Typography component="span" fontWeight={700}>الطالب:</Typography> {(parasite as any).studentName}
                    </Typography>
                  )}
                  {(parasite as any).supervisorName && (
                    <Typography variant="body2">
                      <Typography component="span" fontWeight={700}>المشرف:</Typography> {(parasite as any).supervisorName}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}