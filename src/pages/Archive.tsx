// src/pages/Archive.tsx
// النسخة المحدثة - تستخدم useParasites hook

import React, { useMemo, useState } from 'react';
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
} from '@mui/material';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../hooks/useParasites';
import { Parasite } from '../types/parasite';
import ParasiteCard from '../components/archive/ParasiteCard';

const Archive: React.FC = () => {
  const { t } = useTranslation();
  
  // ✅ استخدام الـ hook بدلاً من Supabase مباشرة
  const { parasites, loading, error } = useParasites();
  console.log('🔍 First parasite:', parasites[0]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');

  // استخراج القيم المميزة للفلاتر
  const distinctTypes = useMemo(
    () => Array.from(new Set(parasites.map((p) => p.type).filter(Boolean))) as string[],
    [parasites]
  );

  const distinctStages = useMemo(
    () => Array.from(new Set(parasites.map((p) => p.stage).filter(Boolean))) as string[],
    [parasites]
  );

  const filteredParasites = useMemo(
    () =>
      parasites.filter((p: Parasite) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          (p.name || '').toLowerCase().includes(searchLower) ||
          (p.type || '').toLowerCase().includes(searchLower) ||
          (p.host || '').toLowerCase().includes(searchLower) ||
          (p.scientificName || '').toLowerCase().includes(searchLower);

        const matchesType = typeFilter === 'all' || p.type === typeFilter;
        const matchesStage = stageFilter === 'all' || p.stage === stageFilter;

        return matchesSearch && matchesType && matchesStage;
      }),
    [parasites, searchTerm, typeFilter, stageFilter]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== 'all') count++;
    if (stageFilter !== 'all') count++;
    return count;
  }, [typeFilter, stageFilter]);

  const clearAllFilters = () => {
    setTypeFilter('all');
    setStageFilter('all');
    setSearchTerm('');
  };

  // ✅ إضافة معالجة الخطأ
  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0d1f15, #1a3d2a, #2d5a3d)',
        pt: 10,
        pb: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)' }}>
          <Typography color="error" variant="h6">
            {t('error_loading', { defaultValue: 'حدث خطأ في تحميل البيانات' })}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0d1f15, #1a3d2a, #2d5a3d)',
      pt: 10,
      pb: 6
    }}>
      <Container maxWidth="lg">

        {/* ===== HEADER SECTION ===== */}
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
                textAlign: 'center'
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
                mx: 'auto'
              }}
            >
              {t('archive_subtitle', { defaultValue: 'استكشف مجموعتنا الشاملة من العينات المجهرية الموثقة' })}
            </Typography>
          </Box>
        </Fade>

        {/* ===== SEARCH & FILTER BAR ===== */}
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 25px 60px -10px rgba(45,90,61,0.5)',
                  borderColor: 'rgba(127,184,150,0.5)'
                },
                '&:focus-within': {
                  boxShadow: '0 25px 60px -10px rgba(45,90,61,0.6)',
                  borderColor: 'rgba(127,184,150,0.7)'
                }
              }}
            >
              <InputAdornment position="start" sx={{ pl: 3, color: '#2d5a3d' }}>
                <Search size={26} strokeWidth={2.5} />
              </InputAdornment>

              <TextField
                fullWidth
                placeholder={t('search_placeholder', { defaultValue: 'البحث بالاسم العلمي، النوع، العائل...' })}
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
                    '& input::placeholder': {
                      color: '#5a7a66',
                      opacity: 1
                    }
                  }
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
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha('#2d5a3d', 0.1)
                    }
                  }}
                >
                  <X size={20} color="#5a7a66" />
                </Box>
              )}
            </Paper>

            {/* Filter Toggle Button */}
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
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${showFilters ? '#3a7050' : 'rgba(127,184,150,0.3)'}`,
                  color: showFilters ? '#ffffff' : 'rgba(255,255,255,0.9)',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: showFilters
                      ? 'linear-gradient(135deg, #4a8a67 0%, #3a7050 100%)'
                      : 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                  }
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(185, 28, 28, 1)',
                      transform: 'translateY(-2px)'
                    }
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
                    sx={{
                      mb: 2,
                      color: '#ffffff',
                      fontWeight: 700,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {t('filter_type', { defaultValue: 'نوع الطفيلي' })}
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    <Chip
                      label={t('filter_all', { defaultValue: 'الكل' })}
                      onClick={() => setTypeFilter('all')}
                      sx={{
                        bgcolor: typeFilter === 'all' ? '#3a7050' : 'rgba(255,255,255,0.1)',
                        color: typeFilter === 'all' ? '#ffffff' : 'rgba(255,255,255,0.8)',
                        fontWeight: 600,
                        border: `1px solid ${typeFilter === 'all' ? '#3a7050' : 'rgba(127,184,150,0.3)'}`,
                        '&:hover': {
                          bgcolor: typeFilter === 'all' ? '#4a8a67' : 'rgba(255,255,255,0.15)',
                        }
                      }}
                    />
                    {distinctTypes.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        onClick={() => setTypeFilter(type)}
                        sx={{
                          bgcolor: typeFilter === type ? '#3a7050' : 'rgba(255,255,255,0.1)',
                          color: typeFilter === type ? '#ffffff' : 'rgba(255,255,255,0.8)',
                          fontWeight: 600,
                          border: `1px solid ${typeFilter === type ? '#3a7050' : 'rgba(127,184,150,0.3)'}`,
                          '&:hover': {
                            bgcolor: typeFilter === type ? '#4a8a67' : 'rgba(255,255,255,0.15)',
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Stage Filter */}
                <Box>
                  <Typography
                    variant="subtitle1" 
                    sx={{
                      mb: 2,
                      color: '#ffffff',
                      fontWeight: 700,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {t('filter_stage', { defaultValue: 'المرحلة' })}
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    <Chip
                      label={t('filter_all', { defaultValue: 'الكل' })}
                      onClick={() => setStageFilter('all')}
                      sx={{
                        bgcolor: stageFilter === 'all' ? '#3a7050' : 'rgba(255,255,255,0.1)',
                        color: stageFilter === 'all' ? '#ffffff' : 'rgba(255,255,255,0.8)',
                        fontWeight: 600,
                        border: `1px solid ${stageFilter === 'all' ? '#3a7050' : 'rgba(127,184,150,0.3)'}`,
                        '&:hover': {
                          bgcolor: stageFilter === 'all' ? '#4a8a67' : 'rgba(255,255,255,0.15)',
                        }
                      }}
                    />
                    {distinctStages.map((stage) => (
                      <Chip
                        key={stage}
                        label={stage}
                        onClick={() => setStageFilter(stage)}
                        sx={{
                          bgcolor: stageFilter === stage ? '#3a7050' : 'rgba(255,255,255,0.1)',
                          color: stageFilter === stage ? '#ffffff' : 'rgba(255,255,255,0.8)',
                          fontWeight: 600,
                          border: `1px solid ${stageFilter === stage ? '#3a7050' : 'rgba(127,184,150,0.3)'}`,
                          '&:hover': {
                            bgcolor: stageFilter === stage ? '#4a8a67' : 'rgba(255,255,255,0.15)',
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Fade>
        )}

        {/* ===== RESULTS SECTION ===== */}
        {loading ? (
          <Box
            sx={{
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ color: '#7fb896' }} />
          </Box>
        ) : filteredParasites.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 10,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(127,184,150,0.2)'
            }}
          >
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('archive_no_results', { defaultValue: 'لم يتم العثور على نتائج' })}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
              {t('archive_try_different', { defaultValue: 'جرب مصطلحات بحث أخرى أو قم بمسح الفلاتر' })}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Results Count */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600
                }}
              >
                {t('results_count', {
                  defaultValue: `تم العثور على ${filteredParasites.length} عينة`,
                  count: filteredParasites.length
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
              }}
            >
              {filteredParasites.map((parasite, index) => (
                <Fade in timeout={800 + index * 100} key={parasite.id}>
                  <Box>
                    <ParasiteCard parasite={parasite} />
                  </Box>
                </Fade>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Archive;