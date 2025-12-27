import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { supabase } from '../lib/supabase';
import { Parasite } from '../types/parasite';
import ParasiteCard from '../components/archive/ParasiteCard';

const Archive: React.FC = () => {
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    const fetchParasites = async () => {
      try {
        const { data, error } = await supabase
          .from('parasites')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setParasites(data || []);
      } catch (err) {
        console.error('Error fetching parasites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParasites();
  }, []);

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
      parasites.filter((p) => {
        const matchesSearch =
          (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.type || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || p.type === typeFilter;
        const matchesStage = stageFilter === 'all' || p.stage === stageFilter;

        return matchesSearch && matchesType && matchesStage;
      }),
    [parasites, searchTerm, typeFilter, stageFilter]
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFCFB', pt: 10 }}>
      <Container maxWidth="lg">
        {/* Top bar: Archive + Search + Filter */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          gap={2.5}
          mb={showFilters ? 2 : 5}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#051F20',
              whiteSpace: 'nowrap',
            }}
          >
            Archive
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            flex={1}
            justifyContent={{ xs: 'center', md: 'flex-end' }}
          >
            {/* Search */}
            <Paper
              elevation={2}
              sx={{
                flex: 1,
                maxWidth: 420,
                borderRadius: 999,
                px: 2,
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Search by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  py: 1.1,
                  '& input': {
                    fontSize: 14,
                    px: 1,
                  },
                }}
              />
            </Paper>

            {/* زر الفلتر */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 999,
                px: 2.5,
                py: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#DAF1DE',
                color: '#0B2B26',
                fontWeight: 600,
              }}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FilterListIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {showFilters ? 'Hide filters' : 'Filters'}
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* لوحة الفلاتر الأكاديمية */}
        {showFilters && (
          <Paper
            elevation={1}
            sx={{
              mb: 4,
              p: 2.5,
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Stack direction="row" spacing={4} flexWrap="wrap" rowGap={2}>
              {/* نوع الطفيلي */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#051F20' }}>
                  Type
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                  <Chip
                    label="All"
                    color={typeFilter === 'all' ? 'success' : 'default'}
                    variant={typeFilter === 'all' ? 'filled' : 'outlined'}
                    size="small"
                    onClick={() => setTypeFilter('all')}
                  />
                  {distinctTypes.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      color={typeFilter === t ? 'success' : 'default'}
                      variant={typeFilter === t ? 'filled' : 'outlined'}
                      size="small"
                      onClick={() => setTypeFilter(t)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* المرحلة */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#051F20' }}>
                  Stage
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                  <Chip
                    label="All"
                    color={stageFilter === 'all' ? 'success' : 'default'}
                    variant={stageFilter === 'all' ? 'filled' : 'outlined'}
                    size="small"
                    onClick={() => setStageFilter('all')}
                  />
                  {distinctStages.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      color={stageFilter === s ? 'success' : 'default'}
                      variant={stageFilter === s ? 'filled' : 'outlined'}
                      size="small"
                      onClick={() => setStageFilter(s)}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* شبكة البطاقات */}
        {loading ? (
          <Box
            minHeight={200}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress sx={{ color: '#0B2B26' }} />
          </Box>
        ) : filteredParasites.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography sx={{ color: 'text.secondary' }}>
              No parasites found matching your search.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} pb={6}>
            {filteredParasites.map((parasite) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={parasite.id}>
                <ParasiteCard parasite={parasite} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Archive;
