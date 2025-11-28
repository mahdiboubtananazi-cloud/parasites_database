import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper,
  TextField, InputAdornment, MenuItem, Select,
  FormControl, InputLabel, Button, Card, CardContent,
  CardMedia, CardActions, Chip, CircularProgress,
  Alert, Stack
} from '@mui/material';
import { Search, Filter, Info, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { parasitesApi, type Parasite } from '../api/parasites';

const ParasitesList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hostFilter, setHostFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const fetchParasites = async () => {
    try {
      setLoading(true);
      const response = await parasitesApi.getAll({
        search: searchTerm,
        host: hostFilter || undefined,
        year: yearFilter ? parseInt(yearFilter) : undefined
      });
      setParasites(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch parasites', err);
      setError(t('error_fetching_data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParasites();
  }, [searchTerm, hostFilter, yearFilter]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F9FC', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            {t('parasites_archive')}
          </Typography>
          <Typography color="text.secondary">
            {t('archive_subtitle')}
          </Typography>
        </Box>

        {/* Filters Section (Using Flexbox instead of Grid) */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            alignItems: 'center' 
          }}>
            {/* Search Input */}
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="gray" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Host Select */}
            <Box sx={{ flex: '1 1 200px' }}>
              <FormControl fullWidth>
                <InputLabel>{t('host_species')}</InputLabel>
                <Select
                  value={hostFilter}
                  label={t('host_species')}
                  onChange={(e) => setHostFilter(e.target.value)}
                >
                  <MenuItem value="">{t('all')}</MenuItem>
                  <MenuItem value="Homo sapiens">Homo sapiens</MenuItem>
                  <MenuItem value="Canis lupus">Canis lupus</MenuItem>
                  <MenuItem value="Felis catus">Felis catus</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Year Input */}
            <Box sx={{ flex: '1 1 150px' }}>
              <TextField
                fullWidth
                label={t('discovery_year')}
                type="number"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
            </Box>

            {/* Filter Button */}
            <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: 'auto' } }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Filter size={18} />}
                onClick={fetchParasites}
                sx={{ height: '56px', minWidth: '120px' }}
              >
                {t('filter')}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Content Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : parasites.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('no_results')}
            </Typography>
          </Box>
        ) : (
          // Cards Layout (Using Flexbox for Grid-like behavior)
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            justifyContent: 'flex-start' 
          }}>
            {parasites.map((parasite) => (
              <Box 
                key={parasite.id} 
                sx={{ 
                  width: { 
                    xs: '100%',      // Mobile: 1 card per row
                    sm: 'calc(50% - 12px)', // Tablet: 2 cards per row
                    md: 'calc(33.333% - 16px)' // Desktop: 3 cards per row
                  } 
                }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={parasite.imageUrl || '/placeholder.png'}
                    alt={parasite.scientificName}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                      {parasite.scientificName}
                    </Typography>
                    
                    {/* Localized Names */}
                    {i18n.language === 'ar' && parasite.arabicName && (
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {parasite.arabicName}
                      </Typography>
                    )}
                    {i18n.language === 'fr' && parasite.frenchName && (
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {parasite.frenchName}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<Info size={14} />} 
                        label={parasite.hostSpecies || 'Unknown'} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                      {parasite.discoveryYear && (
                        <Chip 
                          icon={<Calendar size={14} />} 
                          label={parasite.discoveryYear} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link} 
                      to={`/parasites/${parasite.id}`} 
                      size="small" 
                      variant="contained" 
                      fullWidth
                    >
                      {t('view_details')}
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ParasitesList;