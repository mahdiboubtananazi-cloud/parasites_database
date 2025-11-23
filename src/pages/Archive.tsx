import React, { useState } from 'react';
import { 
  Container, Typography, Box, TextField, InputAdornment, Card, CardContent, 
  CardMedia, Chip, Stack, Button, CircularProgress, Grid, alpha, useTheme,
  IconButton, Paper
} from '@mui/material';
import { Search, ArrowRight, ArrowLeft, Microscope, Database, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

const Archive = () => {
  const navigate = useNavigate();
  const { parasites, loading, error } = useParasites();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // تصفية النتائج
  const filteredResults = parasites.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (p.scientificName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = activeFilter === 'all' || (p.type || '').toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesClass;
  });

  const filters = [
    { id: 'all', label: t('filter_all') },
    { id: 'protozoa', label: t('filter_protozoa') },
    { id: 'helminths', label: t('filter_helminths') },
    { id: 'arthropods', label: t('filter_arthropods') },
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#F8F9FC' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ pt: 4, pb: 3, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 64, zIndex: 10 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h5" fontWeight={800} color="primary.main">{t('archive_title')}</Typography>
              <Typography variant="body2" color="text.secondary">{filteredResults.length} {t('archive_subtitle')}</Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField fullWidth placeholder={t('search_placeholder')} size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search size={18} color="#9CA3AF" style={{marginRight: 8}} /> }} />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                {filters.map((filter) => (
                  <Chip key={filter.id} label={filter.label} onClick={() => setActiveFilter(filter.id)} sx={{ bgcolor: activeFilter === filter.id ? 'primary.main' : 'transparent', color: activeFilter === filter.id ? 'white' : 'text.secondary', border: '1px solid', borderColor: activeFilter === filter.id ? 'primary.main' : 'divider' }} />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Results */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> 
        : error ? <Typography color="error" align="center">Error Loading Data</Typography>
        : filteredResults.length === 0 ? <Typography align="center" sx={{ py: 10 }}>{t('no_results')}</Typography> 
        : (
          <Grid container spacing={3}>
            {filteredResults.map((parasite) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={parasite.id}>
                <Card onClick={() => navigate(`/parasites/${parasite.id}`)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: 4, '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}>
                  <CardMedia component="img" height="200" image={parasite.imageUrl} alt={parasite.name} sx={{ bgcolor: '#f1f5f9' }} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">{parasite.name}</Typography>
                    <Typography variant="body2" color="primary" sx={{ fontStyle: 'italic', mb: 1 }}>{parasite.scientificName}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>{parasite.description}</Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button fullWidth endIcon={<ArrowIcon size={16} />}>{t('view_details')}</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Archive;
