import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import { Microscope, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme/colors';
import { useParasites } from '../../hooks/useParasites';

const getImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/400x300?text=No+Image';
  if (url.startsWith('http')) return url;
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  return `${SUPABASE_URL}/storage/v1/object/public/parasite-images/${url}`;
};

const StatsSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { parasites } = useParasites();

  // 1. آخر عينة
  const latestParasite = parasites && parasites.length > 0 ? parasites[0] : null;

  // 2. الأكثر انتشاراً
  const topType = React.useMemo(() => {
    if (!parasites) return { name: 'Unknown', count: 0 };
    const counts: Record<string, number> = {};
    parasites.forEach((p) => {
      if (p.type) counts[p.type] = (counts[p.type] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0
      ? { name: sorted[0][0], count: sorted[0][1] }
      : { name: 'None', count: 0 };
  }, [parasites]);

  // 3. عدد المساهمين الحقيقيين
  const contributorsCount = React.useMemo(() => {
    if (!parasites) return 0;
    const uniqueUploaders = new Set(
      parasites.map((p) => p.uploadedBy).filter(Boolean)
    );
    return uniqueUploaders.size;
  }, [parasites]);

  // 📱 تصميم الموبايل (بطاقة واحدة مدمجة)
  if (isMobile) {
    return (
      <Box sx={{ py: 4, bgcolor: '#fafcfb' }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: `1px solid ${colors.primary.light}30`,
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography
                variant="subtitle1"
                fontWeight={800}
                color={colors.primary.main}
              >
                {t('stats_overview', { defaultValue: 'نظرة عامة' })}
              </Typography>
              <Chip
                label="Live"
                size="small"
                color="success"
                sx={{ height: 20, fontSize: 10, fontWeight: 'bold' }}
              />
            </Stack>

            <Stack
              spacing={2}
              divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
            >
              {/* 1. أحدث اكتشاف */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                onClick={() =>
                  latestParasite && navigate(`/parasite/${latestParasite.id}`)
                }
              >
                {latestParasite ? (
                  <Box
                    component="img"
                    src={getImageUrl(latestParasite.imageUrl)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#f5f5f5',
                    }}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t('latest_addition', {
                      defaultValue: 'أحدث إضافة',
                    })}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {latestParasite?.scientificName || 'لا توجد بيانات'}
                  </Typography>
                </Box>
                <ChevronRight size={16} color="#ccc" />
              </Stack>

              {/* 2. الأكثر انتشاراً */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1,
                    bgcolor: `${colors.secondary.main}15`,
                    borderRadius: 2,
                    color: colors.secondary.main,
                  }}
                >
                  <TrendingUp size={20} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t('most_common', { defaultValue: 'الأكثر شيوعاً' })}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {topType.name} ({topType.count})
                  </Typography>
                </Box>
              </Stack>

              {/* 3. المجتمع العلمي */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                onClick={() => navigate('/statistics')}
              >
                <Box
                  sx={{
                    p: 1,
                    bgcolor: '#32b8c615',
                    borderRadius: 2,
                    color: '#32b8c6',
                  }}
                >
                  <Users size={20} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t('scientific_community', {
                      defaultValue: 'المجتمع العلمي',
                    })}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {contributorsCount}{' '}
                    {t('active_researchers_count', {
                      defaultValue: 'باحث مساهم',
                    })}
                  </Typography>
                </Box>
                <ChevronRight size={16} color="#ccc" />
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  // 🖥️ تصميم الديسكتوب (3 بطاقات منفصلة)
  return (
    <Box sx={{ py: 8, bgcolor: '#fafcfb' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 3,
          }}
        >
          {/* Card 1: Featured Discovery */}
          <Paper
            elevation={0}
            onClick={() =>
              latestParasite && navigate(`/parasite/${latestParasite.id}`)
            }
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${colors.primary.main}20`,
              background: `linear-gradient(135deg, #fff 0%, ${colors.primary.main}05 100%)`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: colors.primary.main,
              },
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: `${colors.primary.main}15`,
                    color: colors.primary.main,
                  }}
                >
                  <Microscope size={24} />
                </Box>
                <Chip
                  label="NEW"
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: 10, fontWeight: 'bold' }}
                />
              </Stack>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ textTransform: 'uppercase' }}
                >
                  {t('latest_discovery', { defaultValue: 'آخر اكتشاف' })}
                </Typography>
                {latestParasite && (
                  <Stack direction="row" spacing={2} mt={1} alignItems="center">
                    <Box
                      component="img"
                      src={getImageUrl(latestParasite.imageUrl)}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        objectFit: 'cover',
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        noWrap
                        sx={{ maxWidth: 140 }}
                      >
                        {latestParasite.scientificName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(
                          latestParasite.createdAt || ''
                        ).toLocaleDateString('ar-EG')}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Card 2: Trending */}
          <Paper
            elevation={0}
            onClick={() => navigate('/archive')}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${colors.secondary.main}20`,
              background: `linear-gradient(135deg, #fff 0%, ${colors.secondary.main}05 100%)`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: colors.secondary.main,
              },
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 1,
                  width: 'fit-content',
                  borderRadius: 2,
                  bgcolor: `${colors.secondary.main}15`,
                  color: colors.secondary.main,
                }}
              >
                <TrendingUp size={24} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ textTransform: 'uppercase' }}
                >
                  {t('most_prevalent', { defaultValue: 'الأكثر انتشاراً' })}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color={colors.secondary.main}
                  mt={0.5}
                >
                  {topType.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topType.count}{' '}
                  {t('records', { defaultValue: 'تسجيلات' })}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Card 3: Community (Real Data) */}
          <Paper
            elevation={0}
            onClick={() => navigate('/statistics')}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid #32b8c620`,
              background: `linear-gradient(135deg, #fff 0%, #32b8c605 100%)`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: '#32b8c6',
              },
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 1,
                  width: 'fit-content',
                  borderRadius: 2,
                  bgcolor: `#32b8c615`,
                  color: '#32b8c6',
                }}
              >
                <Users size={24} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ textTransform: 'uppercase' }}
                >
                  {t('active_contributors', {
                    defaultValue: 'المساهمون النشطون',
                  })}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="#32b8c6"
                  mt={0.5}
                >
                  {contributorsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('students_researchers', {
                    defaultValue: 'طالب وباحث',
                  })}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default StatsSection;