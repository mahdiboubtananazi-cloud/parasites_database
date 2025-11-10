import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Paper,
  InputAdornment,
} from '@mui/material';
import { useParasites } from '../hooks/useParasites';
import { LoadingSpinner } from '../components/core/LoadingSpinner';

export default function ParasitesList() {
  const { t, i18n } = useTranslation();
  const { parasites, loading, filters, setFilters } = useParasites({ autoFetch: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [hosts, setHosts] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    // Extract unique hosts and years from parasites
    const uniqueHosts = [...new Set(parasites.map(p => p.hostSpecies).filter(Boolean))] as string[];
    const uniqueYears = [...new Set(parasites.map(p => p.discoveryYear).filter(Boolean))] as number[];
    setHosts(uniqueHosts);
    setYears(uniqueYears.sort((a, b) => b - a));
  }, [parasites]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        search: searchTerm || undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  // Filter parasites locally (since API handles it in development mode)
  const filteredParasites = parasites.filter((parasite) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !parasite.scientificName.toLowerCase().includes(searchLower) &&
        !parasite.arabicName?.includes(filters.search) &&
        !parasite.frenchName?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (filters.host && parasite.hostSpecies !== filters.host) {
      return false;
    }
    if (filters.year && parasite.discoveryYear !== filters.year) {
      return false;
    }
    return true;
  });

  if (loading && parasites.length === 0) {
    return <LoadingSpinner fullScreen message={t('loading')} />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('nav_parasites')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our comprehensive collection of parasites
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('filter_by_host')}</InputLabel>
              <Select
                value={filters.host || ''}
                label={t('filter_by_host')}
                onChange={(e) => handleFilterChange('host', e.target.value)}
              >
                <MenuItem value="">All Hosts</MenuItem>
                {hosts.map((host) => (
                  <MenuItem key={host} value={host}>
                    {host}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('filter_by_year')}</InputLabel>
              <Select
                value={filters.year || ''}
                label={t('filter_by_year')}
                onChange={(e) => handleFilterChange('year', e.target.value ? Number(e.target.value) : undefined)}
              >
                <MenuItem value="">All Years</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={resetFilters}
              sx={{ height: '56px' }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Found {filteredParasites.length} parasite(s)
        </Typography>
      </Box>

      {/* Parasites Grid */}
      {filteredParasites.length > 0 ? (
        <Grid container spacing={3}>
          {filteredParasites.map((parasite) => (
            <Grid item xs={12} sm={6} md={4} key={parasite.id}>
              <Card
                component={Link}
                to={`/parasite/${parasite.id}`}
                sx={{
                  textDecoration: 'none',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={parasite.imageUrl || '/images/placeholder.png'}
                  alt={parasite.scientificName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {parasite.scientificName}
                  </Typography>
                  {i18n.language === 'ar' && parasite.arabicName && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {parasite.arabicName}
                    </Typography>
                  )}
                  {i18n.language === 'fr' && parasite.frenchName && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {parasite.frenchName}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('host_species')}:</strong> {parasite.hostSpecies}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('discovery_year')}:</strong> {parasite.discoveryYear}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {t('no_results')}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
