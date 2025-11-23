import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Paper, Grid, Button, Chip, Stack, 
  Divider, alpha, useTheme, CircularProgress 
} from '@mui/material';
import { ArrowRight, ArrowLeft, Calendar, Tag, Microscope, Activity, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// رابط السيرفر
const API_URL = 'http://localhost:8000';

export default function ParasiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  
  const [parasite, setParasite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/parasites`);
        // البحث عن الطفيلي المطلوب
        const found = response.data.find((p: any) => p.id === id);
        setParasite(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!parasite) return <Box sx={{ textAlign: 'center', mt: 10 }}><Typography variant="h5">لم يتم العثور على العينة</Typography></Box>;

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#F8F9FC' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Button 
            startIcon={<ArrowIcon size={18} />} 
            onClick={() => navigate('/archive')}
            sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            {t('archive')}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
              <Box sx={{ borderRadius: 3, overflow: 'hidden', height: 350, bgcolor: '#f1f5f9', position: 'relative', border: '1px solid', borderColor: 'divider' }}>
                <img src={parasite.imageUrl} alt={parasite.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Chip label={parasite.type.toUpperCase()} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.95)', fontWeight: 800, color: 'primary.main', backdropFilter: 'blur(4px)' }} />
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 3, px: 1 }}>
                <Button fullWidth variant="outlined" startIcon={<Share2 size={18} />}>مشاركة</Button>
                <Button fullWidth variant="contained" startIcon={<Microscope size={18} />}>عرض مجهري</Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ pl: { md: 2 } }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>{parasite.name}</Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', bgcolor: alpha(theme.palette.primary.main, 0.05), display: 'inline-block', px: 2, py: 0.5, borderRadius: 2 }}>{parasite.scientificName}</Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F9FC', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: 'secondary.main' }}><Activity size={24} /></Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{t('label_stage')}</Typography>
                        <Typography variant="body1" fontWeight={700}>{parasite.stage || 'غير محدد'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F9FC', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: 'warning.main' }}><Calendar size={24} /></Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>تاريخ الإضافة</Typography>
                        <Typography variant="body1" fontWeight={700}>{parasite.createdAt ? new Date(parasite.createdAt).toLocaleDateString() : '2023'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Tag size={20} /> {t('label_desc')}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>{parasite.description}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
