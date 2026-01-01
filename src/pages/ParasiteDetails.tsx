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
import { Parasite } from '../types/parasite';

// دالة لإصلاح رابط الصورة
const getImageUrl = (parasite: Parasite): string => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const DEFAULT_IMAGE = 'https://placehold.co/800x600?text=No+Image';

  const imageValue = parasite.imageUrl;

  if (!imageValue) {
    return DEFAULT_IMAGE;
  }

  if (imageValue.startsWith('http')) {
    return imageValue;
  }

  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/parasites/${imageValue}`;
  }

  return DEFAULT_IMAGE;
};

export default function ParasiteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const { parasites, loading: loadingParasites } = useParasites();

  const [parasite, setParasite] = useState<Parasite | null>(null);
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
      const found = parasites.find((p) => String(p.id) === String(id));

      if (found) {
        setParasite(found);
        setError(null);
      } else {
        setError(t('error_not_found', { defaultValue: 'العينة غير موجودة' }));
        setParasite(null);
      }
    }
  }, [id, parasites, loadingParasites, t]);

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
          <Typography color="text.secondary">{t('loading')}</Typography>
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
            {t('error')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error || t('error_loading_data')}
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
              {t('nav_archive')}
            </Button>
            <Button onClick={() => window.location.reload()} variant="outlined">
              {t('btn_retry', { defaultValue: 'إعادة المحاولة' })}
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // استخدام الحقول من Parasite interface مباشرة
  const imageUrl = getImageUrl(parasite);

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
            {t('nav_archive')}
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
                {t('details_zoom_hint', { defaultValue: 'حرك الماوس للتكبير' })}
              </Typography>

              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download size={18} />}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = `${parasite.scientificName || parasite.name || 'parasite'}.jpg`;
                    link.click();
                  }}
                >
                  {t('btn_download')}
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* Info Section */}
          <Box>
            <Stack spacing={3.5}>
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
                  {parasite.name || parasite.scientificName || t('scientific_name')}
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
                  {parasite.scientificName || t('common_name')}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {parasite.stage && (
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
                          {t('details_stage')}
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                          {parasite.stage}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                )}

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
                        {t('details_added_date')}
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {parasite.createdAt
                          ? new Date(parasite.createdAt).toLocaleDateString(
                              i18n.language === 'ar' ? 'ar-SA' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )
                          : t('no_data', { defaultValue: 'غير متوفر' })}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              <Divider />

              {parasite.description && (
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
                    {t('details_description')}
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
                    {parasite.description}
                  </Typography>
                </Box>
              )}

              {(parasite.sampleType || parasite.stainColor) && (
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
                    {t('details_sample_info', { defaultValue: 'معلومات العينة' })}
                  </Typography>
                  <Stack spacing={1.5}>
                    {parasite.sampleType && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Beaker size={16} color={theme.palette.success.main} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {t('details_sample_type')}:
                          </Typography>{' '}
                          <Chip
                            label={parasite.sampleType}
                            size="small"
                            sx={{ ml: 1, fontWeight: 600 }}
                          />
                        </Typography>
                      </Box>
                    )}
                    {parasite.stainColor && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Beaker size={16} color={theme.palette.success.main} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {t('details_stain_color')}:
                          </Typography>{' '}
                          <Chip
                            label={parasite.stainColor}
                            size="small"
                            sx={{ ml: 1, fontWeight: 600 }}
                          />
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              {(parasite.host || parasite.location) && (
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
                    {t('details_location_info', { defaultValue: 'معلومات الموقع' })}
                  </Typography>
                  <Stack spacing={1.5}>
                    {parasite.host && (
                      <Typography variant="body2">
                        <Typography
                          component="span"
                          fontWeight={700}
                          color="text.primary"
                        >
                          {t('details_host')}:
                        </Typography>{' '}
                        {parasite.host}
                      </Typography>
                    )}
                    {parasite.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={16} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {t('details_location')}:
                          </Typography>{' '}
                          {parasite.location}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              {(parasite.studentName || parasite.supervisorName) && (
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
                    {t('details_researcher_info', { defaultValue: 'معلومات الباحث' })}
                  </Typography>
                  <Stack spacing={1.5}>
                    {parasite.studentName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={16} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {t('details_student_name')}:
                          </Typography>{' '}
                          {parasite.studentName}
                        </Typography>
                      </Box>
                    )}
                    {parasite.supervisorName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={16} />
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {t('details_supervisor_name')}:
                          </Typography>{' '}
                          {parasite.supervisorName}
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