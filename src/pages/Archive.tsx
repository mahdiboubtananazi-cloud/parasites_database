import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Chip,
  Stack,
  Fade,
  alpha,
  Pagination,
  Skeleton,
} from '@mui/material';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParasitesPaginated, useFilterOptions } from '../hooks/useParasitesQuery';
import ParasiteCard from '../components/archive/ParasiteCard';
import { colors } from '../theme/colors';

const Archive: React.FC = () => {
  const { t } = useTranslation();

  // حالة الفلاتر
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Debounce للبحث
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // جلب البيانات مع Pagination
  const { data, isLoading, isFetching } = useParasitesPaginated({
    page,
    limit: 12,
    search: debouncedSearch,
    type: typeFilter,
    stage: stageFilter,
    status: 'approved',
  });

  // جلب خيارات الفلاتر
  const { data: filterOptions } = useFilterOptions();

  const parasites = data?.data || [];
  const pagination = data?.pagination;

  const activeFiltersCount =
    (typeFilter !== 'all' ? 1 : 0) + (stageFilter !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setTypeFilter('all');
    setStageFilter('all');
    setSearchTerm('');
    setPage(1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // خلفية فاتحة بدل الغامقة
        background: `linear-gradient(to bottom, ${colors.background.default}, #f0f7f4, #e8f5e9)`,
        pt: { xs: 8, md: 10 },
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* ===== HEADER ===== */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                color: colors.primary.main,
                textAlign: 'center',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
              }}
            >
              {t('archive_title', { defaultValue: 'أرشيف الطفيليات' })}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              {t('archive_subtitle', {
                defaultValue: 'استكشف مجموعتنا الشاملة من العينات المجهرية الموثقة',
              })}
            </Typography>

            {/* عدد النتائج */}
            {pagination && (
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  textAlign: 'center',
                  mt: 1,
                  opacity: 0.8,
                }}
              >
                {t('total_results', {
                  defaultValue: `إجمالي ${pagination.total} عينة`,
                  count: pagination.total,
                })}
              </Typography>
            )}
          </Box>
        </Fade>

        {/* ===== SEARCH & FILTER ===== */}
        <Fade in timeout={1000}>
          <Stack spacing={3} sx={{ mb: 4 }}>
            {/* Search Bar */}
            <Paper
              elevation={0}
              sx={{
                p: '6px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 700,
                mx: 'auto',
                width: '100%',
                borderRadius: '50px',
                background: '#ffffff',
                border: `2px solid ${colors.primary.lighter}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  borderColor: colors.primary.main,
                  boxShadow: `0 4px 25px ${colors.primary.main}20`,
                },
              }}
            >
              <InputAdornment position="start" sx={{ pl: 3, color: colors.primary.main }}>
                <Search size={24} strokeWidth={2.5} />
              </InputAdornment>

              <TextField
                fullWidth
                placeholder={t('search_placeholder', {
                  defaultValue: 'البحث بالاسم العلمي، النوع، الوصف...',
                })}
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: colors.text.primary,
                    px: 2,
                  },
                }}
              />

              {searchTerm && (
                <Box
                  onClick={() => setSearchTerm('')}
                  sx={{
                    mr: 2,
                    p: 0.5,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: alpha(colors.primary.main, 0.1) },
                  }}
                >
                  <X size={20} color={colors.text.secondary} />
                </Box>
              )}

              {/* Loading indicator */}
              {isFetching && (
                <CircularProgress size={20} sx={{ mr: 2, color: colors.primary.main }} />
              )}
            </Paper>

            {/* Filter Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Paper
                onClick={() => setShowFilters(!showFilters)}
                elevation={0}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: '50px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: showFilters ? colors.primary.main : '#ffffff',
                  color: showFilters ? '#ffffff' : colors.primary.main,
                  border: `2px solid ${colors.primary.main}`,
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 15px ${colors.primary.main}30`,
                  },
                }}
              >
                <Filter size={18} strokeWidth={2.5} />
                <Typography variant="body2" fontWeight={700}>
                  {t('filter_toggle', { defaultValue: 'الفلاتر' })}
                  {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
                </Typography>
              </Paper>

              {activeFiltersCount > 0 && (
                <Paper
                  onClick={clearAllFilters}
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: '50px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    background: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: '#dc2626',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <X size={16} />
                  <Typography variant="body2" fontWeight={600}>
                    {t('clear_filters', { defaultValue: 'مسح الكل' })}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Stack>
        </Fade>

        {/* ===== FILTERS PANEL ===== */}
        {showFilters && (
          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: '#ffffff',
                border: `1px solid ${colors.primary.lighter}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <Stack spacing={3}>
                {/* Type Filter */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: colors.primary.main, fontWeight: 700 }}
                  >
                    {t('filter_type', { defaultValue: 'نوع الطفيلي' })}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    <Chip
                      label={t('filter_all', { defaultValue: 'الكل' })}
                      onClick={() => {
                        setTypeFilter('all');
                        setPage(1);
                      }}
                      sx={{
                        bgcolor: typeFilter === 'all' ? colors.primary.main : alpha(colors.primary.main, 0.1),
                        color: typeFilter === 'all' ? '#ffffff' : colors.primary.main,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: typeFilter === 'all' ? colors.primary.dark : alpha(colors.primary.main, 0.2),
                        },
                      }}
                    />
                    {filterOptions?.types.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        onClick={() => {
                          setTypeFilter(type);
                          setPage(1);
                        }}
                        sx={{
                          bgcolor: typeFilter === type ? colors.primary.main : alpha(colors.primary.main, 0.1),
                          color: typeFilter === type ? '#ffffff' : colors.primary.main,
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: typeFilter === type ? colors.primary.dark : alpha(colors.primary.main, 0.2),
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Stage Filter */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: colors.primary.main, fontWeight: 700 }}
                  >
                    {t('filter_stage', { defaultValue: 'المرحلة' })}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    <Chip
                      label={t('filter_all', { defaultValue: 'الكل' })}
                      onClick={() => {
                        setStageFilter('all');
                        setPage(1);
                      }}
                      sx={{
                        bgcolor: stageFilter === 'all' ? colors.primary.main : alpha(colors.primary.main, 0.1),
                        color: stageFilter === 'all' ? '#ffffff' : colors.primary.main,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: stageFilter === 'all' ? colors.primary.dark : alpha(colors.primary.main, 0.2),
                        },
                      }}
                    />
                    {filterOptions?.stages.map((stage) => (
                      <Chip
                        key={stage}
                        label={stage}
                        onClick={() => {
                          setStageFilter(stage);
                          setPage(1);
                        }}
                        sx={{
                          bgcolor: stageFilter === stage ? colors.primary.main : alpha(colors.primary.main, 0.1),
                          color: stageFilter === stage ? '#ffffff' : colors.primary.main,
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: stageFilter === stage ? colors.primary.dark : alpha(colors.primary.main, 0.2),
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Fade>
        )}

        {/* ===== RESULTS ===== */}
        {isLoading ? (
          // Skeleton Loading
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={320}
                sx={{ bgcolor: alpha(colors.primary.main, 0.08), borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : parasites.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 10,
              background: '#ffffff',
              borderRadius: 4,
              border: `1px solid ${colors.primary.lighter}`,
            }}
          >
            <Typography variant="h6" sx={{ color: colors.text.secondary }}>
              {t('archive_no_results', { defaultValue: 'لم يتم العثور على نتائج' })}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1, opacity: 0.7 }}>
              {t('archive_try_different', {
                defaultValue: 'جرب مصطلحات بحث أخرى أو قم بمسح الفلاتر',
              })}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Results Count */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{ color: colors.text.secondary, fontWeight: 600 }}
              >
                {t('showing_results', {
                  defaultValue: `عرض ${parasites.length} من ${pagination?.total || 0} عينة`,
                })}
              </Typography>
            </Box>

            {/* Cards Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
                opacity: isFetching ? 0.7 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {parasites.map((parasite, index) => (
                <Fade in timeout={300 + index * 50} key={parasite.id}>
                  <Box>
                    <ParasiteCard parasite={parasite} />
                  </Box>
                </Fade>
              ))}
            </Box>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, value) => {
                    setPage(value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: colors.primary.main,
                      borderColor: colors.primary.lighter,
                      fontWeight: 600,
                      '&.Mui-selected': {
                        bgcolor: colors.primary.main,
                        color: '#ffffff',
                        '&:hover': { bgcolor: colors.primary.dark },
                      },
                      '&:hover': { bgcolor: alpha(colors.primary.main, 0.1) },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Archive;