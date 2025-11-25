import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; //  قراءة الرابط
import { 
  Container, Typography, Box, TextField, InputAdornment, Card, CardContent, 
  CardMedia, Chip, Stack, Button, CircularProgress, Grid, alpha, useTheme,
  IconButton, Paper
} from '@mui/material';
import { Search, ArrowRight, ArrowLeft, Microscope, Database, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

const fixImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400';
  if (url.includes('localhost')) {
    return url.replace('localhost', window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname);
  }
  return url;
};

const Archive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); //  هوك البحث
  const { parasites, loading, error } = useParasites();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  //  تفعيل البحث تلقائياً إذا جاء من الصفحة الرئيسية
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  const filteredResults = useMemo(() => {
    if (!parasites) return [];
    return parasites.filter(p => {
      if ((p as any).status === 'pending') return false;
      const term = searchTerm.toLowerCase();
      const nameMatch = (p.name || '').toLowerCase().includes(term) || (p.scientificName || '').toLowerCase().includes(term);
      const typeMatch = activeFilter === 'all' || (p.type || '').toLowerCase() === activeFilter.toLowerCase();
      return nameMatch && typeMatch;
    });
  }, [parasites, searchTerm, activeFilter]);

  const filters = [{ id: 'all', label: t('filter_all') }, { id: 'protozoa', label: t('filter_protozoa') }, { id: 'helminths', label: t('filter_helminths') }, { id: 'arthropods', label: t('filter_arthropods') }];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#F8F9FC' }}>
      <Paper elevation={0} sx={{ pt: 4, pb: 3, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: { xs: 64, md: 70 }, zIndex: 10 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h5" fontWeight={800} color="primary.main">{t('archive_title')}</Typography>
              <Typography variant="body2" color="text.secondary">{filteredResults.length} {t('archive_subtitle')}</Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField 
                fullWidth placeholder={t('search_placeholder')} size="small" 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start"><Search size={18} color="#9CA3AF" /></InputAdornment>,
                  endAdornment: searchTerm && <IconButton onClick={() => setSearchTerm('')} size="small"><X size={14}/></IconButton>
                }} 
              />
            </Grid>
            <Grid item xs={12}>
               <Stack direction="row" spacing={1} sx={{overflowX:'auto', pb:1}}>{filters.map(f => <Chip key={f.id} label={f.label} onClick={() => setActiveFilter(f.id)} sx={{ bgcolor: activeFilter === f.id ? 'primary.main' : 'transparent', color: activeFilter === f.id ? 'white' : 'text.secondary', border: '1px solid', borderColor: activeFilter === f.id ? 'primary.main' : 'divider' }} />)}</Stack>
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> :
        filteredResults.length === 0 ? <Typography align="center" sx={{ py: 10 }}>{t('no_results')}</Typography> :
        <Grid container spacing={3}>
          {filteredResults.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card onClick={() => navigate(`/parasites/${p.id}`)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderRadius: 4, '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}>
                <CardMedia component="img" height="220" image={fixImageUrl(p.imageUrl)} alt={p.name} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{p.name}</Typography>
                  <Typography variant="body2" color="primary" sx={{ fontStyle: 'italic' }}>{p.scientificName}</Typography>
                </CardContent>
                <Box sx={{ p: 2 }}><Button fullWidth endIcon={<ArrowIcon size={16} />}>{t('view_details')}</Button></Box>
              </Card>
            </Grid>
          ))}
        </Grid>}
      </Container>
    </Box>
  );
};
export default Archive;
