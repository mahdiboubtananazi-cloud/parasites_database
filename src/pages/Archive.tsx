import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  CircularProgress,
  alpha,
  useTheme,
  IconButton,
  Paper,
  Pagination,
  Drawer,
  Divider,
  FormControlLabel,
  Checkbox,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Sliders,
  X,
  Home,
} from 'lucide-react';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

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

interface FilterState {
  types: string[];
  hosts: string[];
  dateRange: 'all' | 'month' | 'year';
}

const Archive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parasites, loading } = useParasites();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    hosts: [],
    dateRange: 'all',
  });
  const itemsPerPage = 20;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // حمّل البحث من URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  // احسب الفلاتر المتاحة
  const availableTypes = useMemo(() => {
    if (!parasites) return [];
    const types = new Set(parasites.map((p) => p.type).filter(Boolean));
    return Array.from(types).sort();
  }, [parasites]);

  const availableHosts = useMemo(() => {
    if (!parasites) return [];
    const hosts = new Set(parasites.map((p) => p.hostSpecies).filter(Boolean));
    return Array.from(hosts).sort();
  }, [parasites]);

  // نتائج البحث والفلتر
  const filteredResults = useMemo(() => {
    if (!parasites) return [];

    return parasites.filter((p) => {
      if ((p as any).status === 'pending') return false;

      // البحث
      const term = searchTerm.toLowerCase();
      const searchMatch =
        (p.scientificName || '').toLowerCase().includes(term) ||
        (p.arabicName || '').toLowerCase().includes(term) ||
        (p.hostSpecies || '').toLowerCase().includes(term) ||
        (p.type || '').toLowerCase().includes(term);

      if (!searchMatch) return false;

      // الفلاتر
      if (filters.types.length > 0 && !filters.types.includes(p.type || '')) {
        return false;
      }

      if (filters.hosts.length > 0 && !filters.hosts.includes(p.hostSpecies || '')) {
        return false;
      }

      return true;
    });
  }, [parasites, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  // ريسيت pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleHostToggle = (host: string) => {
    setFilters((prev) => ({
      ...prev,
      hosts: prev.hosts.includes(host)
        ? prev.hosts.filter((h) => h !== host)
        : [...prev.hosts, host],
    }));
  };

  const clearFilters = () => {
    setFilters({ types: [], hosts: [], dateRange: 'all' });
    setSearchTerm('');
  };

  const hasActiveFilters = filters.types.length > 0 || filters.hosts.length > 0 || searchTerm;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f7f5' }}>
      {/* ===== BREADCRUMBS ===== */}
      <Box sx={{ bgcolor: 'white', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Breadcrumbs>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Home size={16} />
              Home
            </Link>
            <Typography variant="body2" color="text.secondary">
              Archive
            </Typography>
            {hasActiveFilters && (
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                {filteredResults.length} Results
              </Typography>
            )}
          </Breadcrumbs>
        </Container>
      </Box>

      {/* ===== SEARCH & FILTERS SECTION ===== */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 3,
          position: 'sticky',
          top: 0,
          zIndex: 9,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={2}>
            {/* Title */}
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Academic Archive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore {parasites?.length || 0} parasitological specimens
              </Typography>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search by name, host species, or type..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(58, 90, 64, 0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:focus-within': {
                    backgroundColor: 'white',
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
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

            {/* Filter Button + Results Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={<Sliders size={16} />}
                onClick={() => setFiltersOpen(true)}
                variant={hasActiveFilters ? 'contained' : 'outlined'}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Filters
                {(filters.types.length > 0 || filters.hosts.length > 0) && (
                  <Box
                    sx={{
                      ml: 1,
                      px: 1.5,
                      py: 0.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {filters.types.length + filters.hosts.length}
                  </Box>
                )}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredResults.length)} of{' '}
                <strong>{filteredResults.length}</strong> results
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Paper>

      {/* ===== FILTERS DRAWER ===== */}
      <Drawer
        anchor={isRtl ? 'right' : 'left'}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      >
        <Box sx={{ width: { xs: 280, sm: 320 }, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Advanced Filters
            </Typography>
            <IconButton onClick={() => setFiltersOpen(false)} size="small">
              <X size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Types Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Parasite Type
            </Typography>
            <Stack spacing={1}>
              {availableTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={filters.types.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{type}</Typography>}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Host Species Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Host Species
            </Typography>
            <Stack spacing={1}>
              {availableHosts.map((host) => (
                <FormControlLabel
                  key={host}
                  control={
                    <Checkbox
                      checked={filters.hosts.includes(host)}
                      onChange={() => handleHostToggle(host)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{host}</Typography>}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              sx={{ mt: 2 }}
            >
              Clear All Filters
            </Button>
          )}
        </Box>
      </Drawer>

      {/* ===== MAIN CONTENT ===== */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Search size={48} style={{ color: theme.palette.primary.main, marginBottom: 16 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              No Results Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Paper>
        )}

        {/* Results Grid */}
        {!loading && filteredResults.length > 0 && (
          <>
            <Stack spacing={2}>
              {paginatedResults.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => navigate(`/parasites/${p.id}`)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{ mb: 0.5, color: theme.palette.primary.main }}
                      >
                        {p.scientificName}
                      </Typography>
                      {p.arabicName && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {p.arabicName}
                        </Typography>
                      )}
                      {p.hostSpecies && (
                        <Typography variant="caption" color="text.secondary">
                          Host: <strong>{p.hostSpecies}</strong>
                        </Typography>
                      )}
                    </Box>
                    <ChevronRight size={20} color={theme.palette.primary.main} />
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
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
