import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  alpha,
  useTheme,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Tag,
  Activity,
  Microscope,
  Beaker,
  MapPin,
  User,
  Download,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../hooks/useParasites';

// تصحيح روابط الصور
const fixImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/800x600?text=No+Image';

  if (url.startsWith('http')) return url;

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    'https://parasites-api-boubetana.onrender.com';

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
  const [zoomStyle, setZoomStyle] = useState({
    display: 'none',
    backgroundPosition: '0% 0%',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ display: 'block', backgroundPosition: `${x}% ${y}%` });
  };

  useEffect(() => {
    setLoading(loadingParasites);

    if (!loadingParasites && parasites && parasites.length > 0) {
      const found = parasites.find((p: any) => String(p.id) === String(id));

      if (found) {
        setParasite(found);
        setError(null);
      } else {
        setError('لم يتم العثور على الطفيلي في قاعدة البيانات');
        setParasite(null);
      }
    }
  }, [id, parasites, loadingParasites]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">جاري تحميل البيانات...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error || !parasite) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 500,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h4"
            color="error"
            gutterBottom
            sx={{ mb: 2, fontWeight: 900 }}
          >
            ❌ خطأ في التحميل
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error || 'لم يتم العثور على بيانات الطفيلي.'}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: 'block', mb: 3 }}
          >
            ID: {id}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
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

  // الحقول المستخدمة
  const imageUrl = fixImageUrl(
    (parasite as any).imageurl || (parasite as any).imageUrl
  );
  const sampleType =
    (parasite as any).sampleType || (parasite as any).sampletype;
  const stainColor = (parasite as any).stainColor;
  const stage = (parasite as any).stage;
  const host = (parasite as any).host || (parasite as any).hostSpecies;
  const location = (parasite as any).location;
  const studentName = (parasite as any).studentName;
  const supervisorName = (parasite as any).supervisorName;
  const createdAt =
    (parasite as any).createdAt || (parasite as any).createdat;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 8,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      {/* Header Navigation */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 1.5,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: theme.shadows[1],
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowIcon size={18} />}
            onClick={() => navigate('/archive')}
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              minWidth: 0,
              px: 0,
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('archive') || 'الأرشيف'}
          </Button>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1.2fr' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Image Section */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'white',
                position: { md: 'sticky' },
                top: { md: 96 },
              }}
            >
              {/* Main Image Container */}
              <Box
                sx={{
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  height: { xs: 260, md: 420 },
                  bgcolor: '#f1f5f9',
                  position: 'relative',
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: 'crosshair',
                  mb: 2,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() =>
                  setZoomStyle({ ...zoomStyle, display: 'none' })
                }
              >
                {/* Main Image */}
                <img
                  src={imageUrl}
                  alt={parasite.name || parasite.scientificName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/800x600?text=No+Image';
                  }}
                />

                {/* Zoom Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '250%',
                    pointerEvents: 'none',
                    display: zoomStyle.display,
                    backgroundPosition: zoomStyle.backgroundPosition,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.35)',
                    borderRadius: 2.5,
                  }}
                />

                {/* Type Badge */}
                {parasite.type && (
                  <Chip
                    label={parasite.type.toUpperCase()}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      [isRtl ? 'right' : 'left']: 16,
                      bgcolor: alpha(theme.palette.primary.main, 0.95),
                      color: 'white',
                      fontWeight: 800,
                      letterSpacing: 1,
                      backdropFilter: 'blur(4px)',
                      zIndex: 10,
                    }}
                  />
                )}
              </Box>

              <Typography
                variant="caption"
                align="center"
                display="block"
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                💡 حرك الماوس فوق الصورة للحصول على تكبير موضعي
              </Typography>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download size={18} />}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = `${parasite.scientificName || 'parasite'}.jpg`;
                    link.click();
                  }}
                >
                  تحميل الصورة
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* Info Section */}
          <Box>
            <Stack spacing={3.5}>
              {/* Title Section */}
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    mb: 1,
                    fontSize: { xs: '1.8rem', md: '2.4rem' },
                    lineHeight: 1.2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {parasite.name || parasite.scientificName || 'بدون اسم'}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: 'italic',
                    fontFamily: '"Times New Roman", serif',
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    color: theme.palette.primary.main,
                    display: 'inline-block',
                    px: 2,
                    py: 0.7,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  {parasite.scientificName || 'غير محدد'}
                </Typography>
              </Box>

              {/* Quick Info Cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {/* Stage */}
                {stage && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: alpha(theme.palette.info.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      borderRadius: 2.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.5}>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: 'white',
                          borderRadius: 1.5,
                          color: theme.palette.info.main,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Activity size={20} />
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={700}
                          sx={{ mb: 0.5, textTransform: 'uppercase' }}
                        >
                          مرحلة التطور
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                          {stage}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                )}

                {/* Date */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: alpha(theme.palette.warning.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    borderRadius: 2.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'white',
                        borderRadius: 1.5,
                        color: theme.palette.warning.main,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Calendar size={20} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ mb: 0.5, textTransform: 'uppercase' }}
                      >
                        تاريخ الإضافة
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {createdAt
                          ? new Date(createdAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'غير محدد'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              <Divider />

              {/* Description */}
              {(parasite as any).description && (
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                      color: theme.palette.primary.main,
                    }}
                  >
                    <Tag size={20} />
                    الوصف المجهري
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 2,
                      fontSize: '1.02rem',
                      p: 2,
                      bgcolor: alpha(theme.palette.grey[500], 0.05),
                      borderRadius: 2,
                      borderInlineStart: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    {(parasite as any).description}
                  </Typography>
                </Box>
              )}

              {/* Sample Details */}
              {(sampleType || stainColor) && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    borderRadius: 2.5,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.success.main,
                      mb: 1.5,
                    }}
                  >
                    <Microscope size={20} />
                    تفاصيل العينة والفحص
                  </Typography>
                  <Stack spacing={1.5}>
                    {sampleType && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Beaker size={16} color={theme.palette.success.main} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            نوع العينة:
                          </Typography>{' '}
                          <Chip
                            label={sampleType}
                            size="small"
                            sx={{ ml: 1, fontWeight: 600 }}
                          />
                        </Typography>
                      </Box>
                    )}
                    {stainColor && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Beaker size={16} color={theme.palette.success.main} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            الصبغة المستخدمة:
                          </Typography>{' '}
                          <Chip
                            label={stainColor}
                            size="small"
                            sx={{ ml: 1, fontWeight: 600 }}
                          />
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Host & Location */}
              {(host || location) && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                    borderRadius: 2.5,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.secondary.main,
                      mb: 1.5,
                    }}
                  >
                    <MapPin size={20} />
                    معلومات المصدر
                  </Typography>
                  <Stack spacing={1.5}>
                    {host && (
                      <Typography variant="body2">
                        <Typography
                          component="span"
                          fontWeight={700}
                          color="text.primary"
                        >
                          العائل:
                        </Typography>{' '}
                        {host}
                      </Typography>
                    )}
                    {location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={16} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            الموقع:
                          </Typography>{' '}
                          {location}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Researcher Info */}
              {(studentName || supervisorName) && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderRadius: 2.5,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.primary.main,
                      mb: 1.5,
                    }}
                  >
                    <User size={20} />
                    معلومات التوثيق
                  </Typography>
                  <Stack spacing={1.5}>
                    {studentName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={16} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            الباحث:
                          </Typography>{' '}
                          {studentName}
                        </Typography>
                      </Box>
                    )}
                    {supervisorName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={16} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            المشرف الأكاديمي:
                          </Typography>{' '}
                          {supervisorName}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
