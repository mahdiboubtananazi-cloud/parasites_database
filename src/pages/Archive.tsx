import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Grid,
  alpha,
  useTheme,
  IconButton,
  Paper,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  keyframes,
} from '@mui/material';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Microscope,
  Database,
  X,
  Grid3X3,
  List,
  Droplets,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

// ===== ANIMATIONS =====
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fixImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/400x300?text=No+Image';
  if (url.includes('localhost')) {
    return url.replace(
      'localhost',
      window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname
    );
  }
  return url;
};

const Archive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parasites, loading, error } = useParasites();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 12 : 8;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';

  // حمّل البحث من URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  // احسب الفلاتر الفريدة من البيانات
  const availableTypes = useMemo(() => {
    if (!parasites) return [];
    const types = new Set(parasites.map((p) => p.type).filter(Boolean));
    return Array.from(types);
  }, [parasites]);

  // نتائج البحث والفلتر
  const filteredResults = useMemo(() => {
    if (!parasites) return [];

    return parasites.filter((p) => {
      // لا نعرض العينات المعلقة
      if ((p as any).status === 'pending') return false;

      // البحث في الاسم العلمي والعربي
      const term = searchTerm.toLowerCase();
      const nameMatch =
        (p.scientificName || '').toLowerCase().includes(term) ||
        (p.arabicName || '').toLowerCase().includes(term) ||
        (p.hostSpecies || '').toLowerCase().includes(term);

      // الفلتر حسب النوع
      const typeMatch =
        activeFilter === 'all' || (p.type || '').toLowerCase() === activeFilter.toLowerCase();

      return nameMatch && typeMatch;
    });
  }, [parasites, searchTerm, activeFilter]);

  // حساب الـ pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  // ريسيت الـ pagination عند تغيير الفلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  // بناء الفلاتر ديناميكياً
  const filters = [
    { id: 'all', label: t('filter_all') || 'الكل', icon: '📊' },
    ...availableTypes.map((type) => ({
      id: type.toLowerCase(),
      label: type,
      icon: type.includes('Protozoa') ? '🦠' : type.includes('Helminth') ? '🪱' : '🔬',
    })),
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#f8f7f5' }}>
      {/* ===== HEADER SECTION ===== */}
      <Paper
        elevation={0}
        sx={{
          pt: 4,
          pb: 3,
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: { xs: 64, md: 70 },
          zIndex: 10,
          animation: `${fadeInUp} 0.6s ease-out`,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* Title Section */}
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color="text.primary"
                sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box sx={{ fontSize: '32px' }}>📚</Box>
                {t('archive_title') || 'الأرشيف الأكاديمي'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredResults.length} {t('archive_subtitle') || 'عينة مسجلة'}
              </Typography>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder={t('search_placeholder') || 'ابحث عن طفيلي أو كائن مضيف...'}
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  transition: 'all 0.3s',
                  '&:focus-within': {
                    backgroundColor: 'white',
                    boxShadow: '0 10px 25px rgba(58, 90, 64, 0.1)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#9CA3AF" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton onClick={() => setSearchTerm('')} size="small">
                    <X size={14} />
                  </IconButton>
                ),
              }}
            />

            {/* Filters + View Mode */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {/* Filter Chips */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: 'auto',
                  pb: 1,
                  flex: 1,
                  '&::-webkit-scrollbar': { height: '4px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: '#a3b18a', borderRadius: '2px' },
                }}
              >
                {filters.map((f) => (
                  <Chip
                    key={f.id}
                    icon={<Box sx={{ fontSize: '14px' }}>{f.icon}</Box>}
                    label={f.label}
                    onClick={() => setActiveFilter(f.id)}
                    sx={{
                      bgcolor: activeFilter === f.id ? theme.palette.primary.main : 'transparent',
                      color: activeFilter === f.id ? 'white' : 'text.secondary',
                      border: '1px solid',
                      borderColor: activeFilter === f.id ? theme.palette.primary.main : 'divider',
                      fontWeight: activeFilter === f.id ? 600 : 400,
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => {
                  if (newMode !== null) {
                    setViewMode(newMode);
                    setCurrentPage(1);
                  }
                }}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.5)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <ToggleButton value="grid" sx={{ px: 2 }}>
                  <Grid3X3 size={18} />
                </ToggleButton>
                <ToggleButton value="list" sx={{ px: 2 }}>
                  <List size={18} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </Container>
      </Paper>

      {/* ===== MAIN CONTENT ===== */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredResults.length === 0 && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ fontSize: '64px', mb: 2 }}>🔍</Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              لا توجد نتائج
            </Typography>
            <Typography variant="body2" color="text.secondary">
              جرّب تغيير شروط البحث أو الفلاتر
            </Typography>
          </Paper>
        )}

        {/* Grid View */}
        {!loading && filteredResults.length > 0 && viewMode === 'grid' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {paginatedResults.map((p, idx) => (
              <Card
                key={p.id}
                onClick={() => navigate(`/parasites/${p.id}`)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  animation: `${fadeInUp} 0.5s ease-out ${idx * 0.05}s both`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {/* Image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={fixImageUrl(p.imageUrl)}
                  alt={p.scientificName}
                  sx={{ objectFit: 'cover' }}
                />

                {/* Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Scientific Name */}
                  <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                    {p.scientificName}
                  </Typography>

                  {/* Arabic Name */}
                  {p.arabicName && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ fontWeight: 600, mb: 1.5 }}
                    >
                      {p.arabicName}
                    </Typography>
                  )}

                  {/* Info Badges */}
                  <Stack spacing={1}>
                    {/* Type */}
                    {p.type && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Microscope size={14} style={{ color: theme.palette.primary.main }} />
                        <Typography variant="caption" color="text.secondary">
                          {p.type}
                        </Typography>
                      </Box>
                    )}

                    {/* Host Species */}
                    {p.hostSpecies && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Droplets size={14} style={{ color: '#dc2626' }} />
                        <Typography variant="caption" color="text.secondary">
                          {p.hostSpecies}
                        </Typography>
                      </Box>
                    )}

                    {/* Description */}
                    {(p as any).description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mt: 1,
                        }}
                      >
                        {(p as any).description}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>

                {/* Action Button */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {t('view_details') || 'عرض التفاصيل'}
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}

        {/* List View */}
        {!loading && filteredResults.length > 0 && viewMode === 'list' && (
          <Stack spacing={2}>
            {paginatedResults.map((p, idx) => (
              <Card
                key={p.id}
                onClick={() => navigate(`/parasites/${p.id}`)}
                sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  animation: `${fadeInUp} 0.5s ease-out ${idx * 0.05}s both`,
                  '&:hover': {
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {/* Image */}
                <CardMedia
                  component="img"
                  sx={{ width: 150, height: 150, objectFit: 'cover' }}
                  image={fixImageUrl(p.imageUrl)}
                  alt={p.scientificName}
                />

                {/* Content */}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                          {p.scientificName}
                        </Typography>
                        {p.arabicName && (
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                            {p.arabicName}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        endIcon={isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        sx={{ textTransform: 'none', ml: 2 }}
                      >
                        {t('view_details') || 'عرض'}
                      </Button>
                    </Box>

                    {/* Info Row */}
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                      {p.type && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Microscope size={16} style={{ color: theme.palette.primary.main }} />
                          <Typography variant="caption" color="text.secondary">
                            {p.type}
                          </Typography>
                        </Box>
                      )}

                      {p.hostSpecies && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Droplets size={16} style={{ color: '#dc2626' }} />
                          <Typography variant="caption" color="text.secondary">
                            {p.hostSpecies}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Description */}
                    {(p as any).description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          mt: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {(p as any).description}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {!loading && filteredResults.length > itemsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Archive;
