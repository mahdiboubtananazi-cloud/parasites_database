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
      setPage(1); // إعادة للصفحة الأولى عند البحث
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
        background: 'linear-gradient(to bottom, #0d1f15, #1a3d2a, #2d5a3d)',
        pt: 10,
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
                background: 'linear-gradient(135deg, #ffffff 0%, #c8e6d5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              {t('archive_title', { defaultValue: 'أرشيف الطفيليات' })}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
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
                  color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center',
                  mt: 1,
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
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(127,184,150,0.3)',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
              }}
            >
              <InputAdornment position="start" sx={{ pl: 3, color: '#2d5a3d' }}>
                <Search size={26} strokeWidth={2.5} />
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
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#0d1f15',
                    px: 3,
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
                    '&:hover': { bgcolor: alpha('#2d5a3d', 0.1) },
                  }}
                >
                  <X size={20} color="#5a7a66" />
                </Box>
              )}

              {/* Loading indicator */}
              {isFetching && (
                <CircularProgress size={20} sx={{ mr: 2, color: '#2d5a3d' }} />
              )}
            </Paper>

            {/* Filter Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Paper
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: showFilters
                    ? 'linear-gradient(135deg, #3a7050 0%, #2d5a3d 100%)'
                    : 'rgba(255,255,255,0.1)',
                  color: showFilters ? '#ffffff' : 'rgba(255,255,255,0.9)',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <Filter size={20} strokeWidth={2.5} />
                <Typography variant="body1" fontWeight={700}>
                  {t('filter_toggle', { defaultValue: 'الفلاتر' })}
                  {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
                </Typography>
              </Paper>

              {activeFiltersCount > 0 && (
                <Paper
                  onClick={clearAllFilters}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: '50px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    background: 'rgba(220, 38, 38, 0.9)',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  <X size={18} />
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
                p: 4,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(127,184,150,0.2)',
              }}
            >
              <Stack spacing={3}>
                {/* Type Filter */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: '#ffffff', fontWeight: 700 }}
                  >
                    {t('filter_type', { defaultValue: 'نوع الطفيلي' })}
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    <Chip
                      label={t('filter_all', { defaultValue: 'الكل' })}
                      onClick={() => {
                        setTypeFilter('all');
                        setPage(1);
                      }}
                      sx={{
                        bgcolor: typeFilter === 'all' ? '#3a7050' : 'rgba(255,255,255,0.1)',
                        color: typeFilter === 'all' ? '#ffffff' : 'rgba(255,255,255,0.8)',
                        fontWeight: 600,
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
                          bgcolor: typeFilter === type ? '#3a7050' : 'rgba(255,255,255,0.1)',
                          color: typeFilter === type ? '#ffffff' : 'rgba(255,255,255,0.8)',
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Stage Filter */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: '#ffffff', fontWeight: 700 }}
                  >
                    {t('filter_stage', { defaultValue: 'المرحلة' })}
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    <Chip
                      label={t('filter_all', { defaultValue: 'الكل' })}
                      onClick={() => {
                        setStageFilter('all');
                        setPage(1);
                      }}
                      sx={{
                        bgcolor: stageFilter === 'all' ? '#3a7050' : 'rgba(255,255,255,0.1)',
                        color: stageFilter === 'all' ? '#ffffff' : 'rgba(255,255,255,0.8)',
                        fontWeight: 600,
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
                          bgcolor: stageFilter === stage ? '#3a7050' : 'rgba(255,255,255,0.1)',
                          color: stageFilter === stage ? '#ffffff' : 'rgba(255,255,255,0.8)',
                          fontWeight: 600,
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
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : parasites.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 10,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('archive_no_results', { defaultValue: 'لم يتم العثور على نتائج' })}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
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
                sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}
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
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&.Mui-selected': {
                        bgcolor: '#3a7050',
                        '&:hover': { bgcolor: '#4a8a67' },
                      },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
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